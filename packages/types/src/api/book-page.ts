import type { StrapiBase, Section } from '../index'

export interface BookPage extends StrapiBase {
  sections: Section[]
}
