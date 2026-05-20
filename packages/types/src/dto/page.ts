export interface MediaFormat {
  url: string
  width: number
  height: number
}

export interface MediaDTO {
  url: string
  alt: string
  width: number
  height: number
  formats?: {
    thumbnail?: MediaFormat
    small?: MediaFormat
    medium?: MediaFormat
    large?: MediaFormat
  }
}

export interface SeoDTO {
  title: string | null
  description: string | null
}

export interface CtaButtonDTO {
  label: string
  href: string
  variant: 'primary' | 'outline'
}

export type AccentDTO = 'navy' | 'paper' | 'paper-warm' | 'navy-deep'

export interface PageDTO {
  id: number
  documentId: string
  locale: string
  slug: string
  seo: SeoDTO
}
