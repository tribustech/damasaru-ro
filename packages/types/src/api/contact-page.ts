import type { StrapiBase, Section } from '../index'

export interface ContactPage extends StrapiBase {
  seoTitle: string | null
  seoDescription: string | null
  sections: Section[]
}
