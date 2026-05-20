import type { StrapiBase, Section } from '../index'

export interface AboutPage extends StrapiBase {
  seoTitle: string | null
  seoDescription: string | null
  sections: Section[]
}
