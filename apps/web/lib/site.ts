/** Canonical public origin (apex 308-redirects to www). Override per env with SITE_URL. */
export const SITE_URL = (process.env.SITE_URL || 'https://www.damasaru.ro').replace(/\/$/, '')
