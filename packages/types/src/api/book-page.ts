import type { StrapiBase, Section } from '../index'

export interface BookPage extends StrapiBase {
  seoTitle: string | null
  seoDescription: string | null
  sections: Section[]
}
