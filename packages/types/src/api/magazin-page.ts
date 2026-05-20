import type { StrapiBase, Section } from '../index'

export interface MagazinPage extends StrapiBase {
  seoTitle: string | null
  seoDescription: string | null
  sections: Section[]
}
