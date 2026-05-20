import type { PageDTO } from './page'
import type { SectionDTO } from './section'
import type {
  ArticleDTO,
  EventDTO,
  PodcastEpisodeDTO,
  ProjectDTO,
  ProductDTO,
} from './entity'

export type PageSlug =
  | 'home'
  | 'despre'
  | 'cartea'
  | 'podcast'
  | 'idei'
  | 'proiecte'
  | 'evenimente'
  | 'magazin'
  | 'media'
  | 'contact'

export interface SingleTypePageDTO extends PageDTO {
  sections: SectionDTO[]
}

export interface ArticleDetailDTO extends ArticleDTO {
  body: string
  related: ArticleDTO[]
}

export interface PodcastEpisodeDetailDTO extends PodcastEpisodeDTO {
  showNotes: string | null
  related: PodcastEpisodeDTO[]
}

export interface ProjectDetailDTO extends ProjectDTO {
  body: string | null
  related: ProjectDTO[]
}

export interface EventDetailDTO extends EventDTO {
  body: string | null
  related: EventDTO[]
}

export interface ProductDetailDTO extends ProductDTO {
  body: string | null
  related: ProductDTO[]
}
