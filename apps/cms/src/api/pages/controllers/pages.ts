export default {
  async findSingle(ctx: any) {
    const { slug } = ctx.params
    ctx.body = { ok: true, slug, locale: ctx.query.locale ?? 'ro' }
  },
  async findDetail(ctx: any) {
    const { type, slug } = ctx.params
    ctx.body = { ok: true, type, slug, locale: ctx.query.locale ?? 'ro' }
  },
}
