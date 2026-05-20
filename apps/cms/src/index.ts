import type { Core } from '@strapi/strapi'
import { seedAll } from './seed'

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedAll(strapi)
  },
}
