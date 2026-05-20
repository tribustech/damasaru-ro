import type { StrapiBase, Section } from '../index'

export interface PodcastPage extends StrapiBase {
  seoTitle: string | null
  seoDescription: string | null
  sections: Section[]
}
