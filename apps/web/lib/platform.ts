/**
 * Audiobook platform (platforma.damasaru.ro). Romanian-only for now, so the
 * menu/footer entry is shown on /ro only. UTM campaign `meniu` keeps menu
 * traffic separate from the homepage section (`homepage-biblioteca`, set in the CMS).
 */
export const PLATFORM_MENU_URL =
  'https://platforma.damasaru.ro/?utm_source=damasaru.ro&utm_medium=referral&utm_campaign=meniu'

export const hasPlatformLink = (locale: string) => locale === 'ro'
