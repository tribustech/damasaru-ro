#!/usr/bin/env node
/**
 * Restores the local production snapshot into the local Postgres DB.
 *
 * This is the "SQL snapshot as seed" path: instead of the TS bootstrap in
 * `src/seed/`, we drop+recreate the target database and replay an exact dump of
 * production (`database/snapshot.sql`). The snapshot is the source of truth, so
 * a fresh local DB ends up byte-identical to prod (content, media rows, and the
 * admin accounts that were live when the dump was taken).
 *
 * Refresh the snapshot from prod with: `pnpm --filter cms seed:dump`
 *
 * Usage (from apps/cms):
 *   pnpm seed:sql            # interactive: prompts before dropping the DB
 *   pnpm seed:sql --yes      # skip prompt (CI / scripts)
 *
 * Requires `psql` on PATH (the snapshot uses COPY blocks, which the `pg` client
 * library can't stream — psql is the right tool to replay them). Node ≥20 for
 * `--env-file`.
 */

const { Client } = require('pg')
const { spawnSync, execSync } = require('node:child_process')
const readline = require('node:readline/promises')
const path = require('node:path')
const fs = require('node:fs')

const args = new Set(process.argv.slice(2))
const skipPrompt = args.has('--yes') || args.has('-y')

const SNAPSHOT = path.join(__dirname, '..', 'database', 'snapshot.sql')

function dbConfig() {
  return {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT) || 5432,
    database: process.env.DATABASE_NAME || 'damasaru',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'pass123',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  }
}

function assertPsql() {
  try {
    execSync('psql --version', { stdio: 'ignore' })
  } catch {
    console.error(
      'psql not found on PATH. Install the Postgres client tools (e.g. `brew install libpq`\n' +
        'and add its bin to PATH) — the snapshot uses COPY blocks that only psql can replay.'
    )
    process.exit(1)
  }
}

async function confirm(message) {
  if (skipPrompt) return true
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const answer = (await rl.question(`${message} [y/N] `)).trim().toLowerCase()
  rl.close()
  return answer === 'y' || answer === 'yes'
}

async function main() {
  if (!fs.existsSync(SNAPSHOT)) {
    console.error(`Snapshot not found: ${SNAPSHOT}\nRun \`pnpm --filter cms seed:dump\` to create it.`)
    process.exit(1)
  }
  assertPsql()

  const cfg = dbConfig()
  const sizeMb = (fs.statSync(SNAPSHOT).size / 1024 / 1024).toFixed(1)
  console.log(`▶ Target: ${cfg.host}:${cfg.port}/${cfg.database} as ${cfg.user}`)
  console.log(`▶ Snapshot: database/snapshot.sql (${sizeMb} MB)`)
  console.log(`\nThis will DROP and recreate "${cfg.database}", wiping all local data,`)
  console.log('then replay the production snapshot in its place.')

  const ok = await confirm('\nProceed?')
  if (!ok) {
    console.log('Aborted.')
    return
  }

  // 1. Drop + recreate the target DB from the `postgres` maintenance DB.
  const admin = new Client({ ...cfg, database: 'postgres' })
  await admin.connect()
  try {
    console.log(`\n▶ Dropping and recreating "${cfg.database}"…`)
    await admin.query(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity
         WHERE datname = $1 AND pid <> pg_backend_pid()`,
      [cfg.database]
    )
    await admin.query(`DROP DATABASE IF EXISTS "${cfg.database}"`)
    await admin.query(`CREATE DATABASE "${cfg.database}"`)
  } finally {
    await admin.end()
  }

  // 2. Replay the snapshot with psql (ON_ERROR_STOP so a bad restore fails loud).
  console.log('▶ Restoring snapshot…')
  const res = spawnSync(
    'psql',
    [
      '-h', cfg.host,
      '-p', String(cfg.port),
      '-U', cfg.user,
      '-d', cfg.database,
      '-v', 'ON_ERROR_STOP=1',
      '-q',
      '-f', SNAPSHOT,
    ],
    {
      stdio: ['ignore', 'inherit', 'inherit'],
      env: { ...process.env, PGPASSWORD: cfg.password },
    }
  )

  if (res.status !== 0) {
    console.error(`\n✗ Restore failed (psql exit ${res.status}).`)
    process.exit(res.status || 1)
  }

  console.log(`\n✓ Restored "${cfg.database}" from the production snapshot.`)
  console.log('  Start Strapi: pnpm dev (in apps/cms)')
}

main().catch((err) => {
  console.error('seed:sql failed:', err.message)
  process.exit(1)
})
