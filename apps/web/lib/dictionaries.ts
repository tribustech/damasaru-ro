import 'server-only'
import type { Locale } from '../proxy'

const dictionaries = {
  ro: () => import('../dictionaries/ro.json').then((m) => m.default),
  en: () => import('../dictionaries/en.json').then((m) => m.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
