import type { Core } from '@strapi/strapi'
import { seedAll } from './seed'
import { registerRevalidation, enableRevalidation } from './revalidation'

const PUBLIC_ACTIONS = [
  'api::audiobook-waitlist-entry.audiobook-waitlist-entry.create',
  'api::audiobook-waitlist-entry.audiobook-waitlist-entry.find',
  'api::event-waitlist-entry.event-waitlist-entry.create',
  'api::event-waitlist-entry.event-waitlist-entry.find',
  // Speaker booking: create only — submissions are private leads (admin reads via Strapi UI).
  'api::speaker-booking-entry.speaker-booking-entry.create',
]

async function grantPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } })
  if (!publicRole) return
  for (const action of PUBLIC_ACTIONS) {
    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } })
    if (!existing) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } })
    }
  }
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    registerRevalidation(strapi)
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedAll(strapi)
    await grantPublicPermissions(strapi)
    // Seed writes are done — start forwarding content changes to the web app.
    enableRevalidation()
  },
}
