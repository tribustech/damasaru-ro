'use strict'

/**
 * Data migration for commit 03ed9b2 (rename reserved `status` attribute).
 *
 * Strapi v5's schema sync renames the DB columns (`status` -> `event_status`,
 * `episode_status`, ...) but DROPS the old column's data — every renamed column
 * comes back NULL. It also can't touch values stored inside dynamic-zone
 * component JSON, so `components_sections_featured_lists.filter_by` keeps the old
 * reserved key `{"status": ...}`, which then explodes the event Document Service
 * query at request time ("page composition failed", HTTP 500 on /evenimente, /).
 *
 * This backfills the renamed columns from the seed source of truth and rewrites
 * the stale filter_by key. Idempotent (only touches NULLs / rows that still carry
 * the old key), so it's a safe no-op on environments already patched by hand.
 *
 * Postgres-only (jsonb ops); skipped on other clients.
 */

const EVENT_VIITOR = [
  'iasi-septembrie-2026',
  'constanta-mai-2026',
  'bucuresti-noiembrie-2026',
]
const EVENT_TRECUT = [
  'bucuresti-ianuarie-2026',
  'cluj-mai-2025',
  'tedx-constanta-2024',
  'forbes-cee-forum-2023',
  'tedxquestfield-2025',
  'tati-care-iubesc-2024',
  'gotech-world',
  'i-love-failure-2025',
  'human-2-0-cluj-2023',
  'ani-casarica-constanta-anterioare',
  'sports-business-academy',
]
const EPISODE_LIVE = [
  'ep-01-eu-creierul-tau-si-aceasta-conversatie',
  'ep-02-ce-face-ai-ul-cu-mintea-ta',
]
const EPISODE_UPCOMING = [
  'ep-03-arta-de-a-fi-ascultat-cu-adevarat',
  'ep-04-creierul-care-performeaza-sub-presiune',
  'ep-05-credinta-stiinta-si-liniste-interioara',
  'ep-06-unde-mergem-impreuna-de-aici',
]

async function backfill(knex, table, column, slugs, value) {
  const has = await knex.schema.hasColumn(table, column)
  if (!has) return
  await knex(table)
    .whereIn('slug', slugs)
    .whereNull(column)
    .update({ [column]: value })
}

module.exports = {
  async up(knex) {
    const dialect = knex.client.dialect // 'postgresql' on Postgres
    if (dialect !== 'postgresql') return

    // 1. Backfill the columns the schema rename left NULL.
    await backfill(knex, 'events', 'event_status', EVENT_VIITOR, 'viitor')
    await backfill(knex, 'events', 'event_status', EVENT_TRECUT, 'trecut')
    await backfill(knex, 'podcast_episodes', 'episode_status', EPISODE_LIVE, 'live')
    await backfill(knex, 'podcast_episodes', 'episode_status', EPISODE_UPCOMING, 'upcoming')

    // 2. Rewrite the stale reserved key inside stored featured-list filter_by JSON.
    //    {"status": "trecut", ...} -> {"eventStatus": "trecut", ...}. No-op if absent.
    if (await knex.schema.hasTable('components_sections_featured_lists')) {
      await knex.raw(`
        UPDATE components_sections_featured_lists
        SET filter_by = (filter_by - 'status')
                        || jsonb_build_object('eventStatus', filter_by->'status')
        WHERE filter_by ? 'status'
      `)
    }
  },

  // No down(): the original column data was already destroyed by the schema
  // rename before this migration ran, so there is nothing to restore.
  async down() {},
}
