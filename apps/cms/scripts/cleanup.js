#!/usr/bin/env node
/**
 * Wipes all CMS content so the next Strapi boot re-runs the bootstrap seed
 * from scratch.
 *
 * Truncates every "content" table in the Postgres DB (collection types, single
 * types, dynamic-zone link tables, and component tables). Leaves admin users,
 * roles, permissions, and uploaded files intact — uploaded media is reused on
 * re-seed via name lookup in `seed/utils.ts`.
 *
 * Usage (from apps/cms):
 *   pnpm cleanup            # interactive: prompts before wiping
 *   pnpm cleanup --yes      # skip prompt (use in CI / scripts)
 *   pnpm cleanup --files    # ALSO wipe uploaded files (full reset)
 *
 * Node ≥20 is required for `--env-file` (already in this project's engines).
 */

const { Client } = require('pg')
const readline = require('node:readline/promises')
const path = require('node:path')

// Tiny argv parser — we only have two flags.
const args = new Set(process.argv.slice(2))
const skipPrompt = args.has('--yes') || args.has('-y')
const alsoWipeFiles = args.has('--files')

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

// Tables we should NEVER touch — anything that powers the admin panel, auth,
// permissions, or uploaded file metadata. Glob patterns matched with LIKE.
const PROTECTED_TABLE_PATTERNS = [
  'admin_%',
  'strapi_%',
  'up_%', // users-permissions plugin
  'i18n_locales',
  'webhooks',
]
const PROTECTED_EXACT = new Set([
  // upload plugin storage — keep so re-seed reuses media by name
  'files',
  'files_folder_lnk',
  'files_related_mph',
  'upload_folders',
  'upload_folders_parent_lnk',
])

async function listContentTables(client) {
  const protectedExpr = PROTECTED_TABLE_PATTERNS
    .map((p) => `table_name NOT LIKE '${p}'`)
    .join(' AND ')
  const { rows } = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND ${protectedExpr}
    ORDER BY table_name
  `)
  return rows
    .map((r) => r.table_name)
    .filter((name) => !PROTECTED_EXACT.has(name))
}

async function listFileTables(client) {
  const { rows } = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('files', 'files_folder_lnk', 'files_related_mph', 'upload_folders', 'upload_folders_parent_lnk')
  `)
  return rows.map((r) => r.table_name)
}

async function confirm(message) {
  if (skipPrompt) return true
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const answer = (await rl.question(`${message} [y/N] `)).trim().toLowerCase()
  rl.close()
  return answer === 'y' || answer === 'yes'
}

async function main() {
  const config = dbConfig()
  console.log(`▶ Connecting to ${config.host}:${config.port}/${config.database} as ${config.user}`)

  const client = new Client(config)
  await client.connect()

  try {
    const contentTables = await listContentTables(client)
    if (contentTables.length === 0) {
      console.log('No content tables found. Has Strapi ever been booted against this DB?')
      return
    }

    console.log(`\nWill TRUNCATE ${contentTables.length} content/component tables:`)
    console.log(contentTables.map((t) => `  · ${t}`).join('\n'))

    let fileTables = []
    if (alsoWipeFiles) {
      fileTables = await listFileTables(client)
      console.log(`\nAND will TRUNCATE ${fileTables.length} upload tables (--files):`)
      console.log(fileTables.map((t) => `  · ${t}`).join('\n'))
      console.log('\nNote: uploaded media files on disk will NOT be deleted by this script.')
      console.log('Strapi reuploads them on next boot via name dedup.')
    }

    const ok = await confirm('\nProceed?')
    if (!ok) {
      console.log('Aborted.')
      return
    }

    const all = [...contentTables, ...fileTables]
    const quoted = all.map((t) => `"${t}"`).join(', ')
    await client.query(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`)
    console.log(`\n✓ Truncated ${all.length} tables.`)
    console.log('  Restart Strapi to re-seed: pnpm dev (in apps/cms)')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error('Cleanup failed:', err.message)
  process.exit(1)
})
