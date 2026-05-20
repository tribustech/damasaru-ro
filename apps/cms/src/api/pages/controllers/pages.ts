import { composeSinglePage, composeDetailPage } from '../services/compose'

export default {
  async findSingle(ctx: any) {
    const { slug } = ctx.params
    const locale = (ctx.query.locale as string) ?? 'ro'
    try {
      const dto = await composeSinglePage(slug, locale)
      if (!dto) return ctx.notFound(`no page for slug "${slug}"`)
      ctx.body = dto
    } catch (err) {
      strapi.log.error('[pages] findSingle failed', { slug, locale, err })
      ctx.throw(500, 'page composition failed')
    }
  },

  async findDetail(ctx: any) {
    const { type, slug } = ctx.params
    const locale = (ctx.query.locale as string) ?? 'ro'
    try {
      const dto = await composeDetailPage(type, slug, locale)
      if (!dto) return ctx.notFound(`no ${type} for slug "${slug}"`)
      ctx.body = dto
    } catch (err) {
      strapi.log.error('[pages] findDetail failed', { type, slug, locale, err })
      ctx.throw(500, 'detail composition failed')
    }
  },
}
