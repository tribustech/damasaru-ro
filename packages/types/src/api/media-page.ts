import type { StrapiBase, Section } from '../index'

export interface MediaPage extends StrapiBase {
  seoTitle: string | null
  seoDescription: string | null
  sections: Section[]
}
