import type { StrapiBase, Section } from '../index'

export interface ProiectePage extends StrapiBase {
  seoTitle: string | null
  seoDescription: string | null
  sections: Section[]
}
