export interface StrapiMedia {
  id: number
  documentId: string
  url: string
  alternativeText: string | null
  width: number | null
  height: number | null
  formats: Record<string, {
    url: string
    width: number
    height: number
  }> | null
}

export interface StrapiPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface StrapiSingleResponse<T> {
  data: T
  meta: Record<string, unknown>
}

export interface StrapiListResponse<T> {
  data: T[]
  meta: { pagination: StrapiPagination }
}

export interface StrapiBase {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string
}

export interface CtaButton {
  id: number
  label: string
  href: string
  variant: 'primary' | 'outline'
}
