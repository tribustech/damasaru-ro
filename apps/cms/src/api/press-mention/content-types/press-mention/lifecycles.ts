import { errors } from '@strapi/utils'
import { isYoutubeUrl } from '../../../../utils/youtube'

/**
 * Guard rails for the Media "Top Apariții" featured grid. That grid (a) renders a
 * YouTube thumbnail per card, so a featured mention without a video url can't show,
 * and (b) is intentionally curated to FEATURED_LIMIT cards. Without enforcement an
 * editor can mark a mention Featured and have it silently never appear — either
 * because it has no YouTube url, or because it's the 9th+ in a capped grid.
 *
 * We only enforce on a genuine false→true toggle (or a new entry created Featured).
 * Editing other fields, un-featuring, publishing, and pre-existing over-cap data are
 * all left alone, so this never blocks unrelated saves.
 */

const UID = 'api::press-mention.press-mention'
const FEATURED_LIMIT = 8
const { ValidationError } = errors

async function assertFeaturable(entry: any, excludeId?: number): Promise<void> {
  if (!isYoutubeUrl(entry?.url)) {
    throw new ValidationError(
      'O apariție „Featured" trebuie să aibă un link YouTube — grila „Top Apariții" afișează thumbnail-uri video. Adaugă un link YouTube sau debifează „Featured".',
    )
  }
  // Count distinct documents flagged Featured by counting draft rows (one per
  // document), excluding this entry. Display reads the published twin, but the
  // draft flag is the editor's intent and what we cap.
  const where: Record<string, unknown> = { featured: true, publishedAt: { $null: true } }
  if (excludeId) where.id = { $ne: excludeId }
  const count = await strapi.db.query(UID).count({ where })
  if (count >= FEATURED_LIMIT) {
    throw new ValidationError(
      `Sunt deja ${FEATURED_LIMIT} apariții „Featured" (grila „Top Apariții" afișează maxim ${FEATURED_LIMIT}). Debifează una înainte de a marca alta.`,
    )
  }
}

export default {
  async beforeCreate(event: any) {
    const { data } = event.params
    if (data?.featured !== true) return
    // The published twin minted by publish() carries publishedAt — the draft it
    // copies was already validated, so don't re-check (and double-count) here.
    if (data.publishedAt) return
    await assertFeaturable(data)
  },

  async beforeUpdate(event: any) {
    const { data, where } = event.params
    if (data?.featured !== true) return
    const id = where?.id
    const current = id ? await strapi.db.query(UID).findOne({ where: { id } }) : null
    if (current?.publishedAt) return // updating a published row (publish flow)
    if (current?.featured === true) return // already Featured — not a new toggle
    await assertFeaturable({ ...current, ...data }, id)
  },
}
