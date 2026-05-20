import type { StrapiBase, Section } from '../index'

export interface HomePage extends StrapiBase {
  seoTitle: string | null
  seoDescription: string | null
  sections: Section[]
}
