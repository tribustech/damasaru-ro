import type { ProductDTO } from '@repo/types'
import { ProductFormatCard, type ProductCardFormat } from './ProductFormatCard'

interface ProductCardProps {
  product: ProductDTO
}

// The card image treatment only knows four formats; course/bundle (and anything
// unknown) fall back to the plain cover treatment.
function cardFormat(format: string | null): ProductCardFormat {
  switch (format) {
    case 'ebook':
    case 'audiobook':
    case 'event':
      return format
    default:
      return 'hardcover'
  }
}

// Derived eyebrow per format — mirrors the Magazin page's richer eyebrows without
// needing a dedicated CMS field. The meta list carries the finer specifics.
const eyebrowByFormat: Record<string, string> = {
  hardcover: 'Carte tipărită',
  ebook: 'E-book · PDF + EPUB',
  audiobook: 'Audiobook · înregistrat de Costin',
  event: 'Eveniment',
  course: 'Program digital',
  bundle: 'Pachet',
}

// Status pill text per availability.
const tagByAvailability: Record<string, string> = {
  available: 'Bestseller',
  upcoming: 'În curând',
  waitlist: 'Listă așteptare',
  sold_out: 'Epuizat',
}

// Placeholder shown instead of a price when the product isn't purchasable yet.
const priceTextByAvailability: Record<string, string> = {
  upcoming: 'Disponibil curând',
  waitlist: 'Listă așteptare',
  sold_out: 'Epuizat',
}

/**
 * Homepage shop-zone card (relation `products`). Adapts a `ProductDTO` pulled
 * from the `product` collection onto the shared `ProductFormatCard`, so the
 * homepage MAGAZIN zone matches the Magazin page while staying fully dynamic.
 */
export function ProductCard({ product }: ProductCardProps) {
  const format = cardFormat(product.format)
  const availability = product.availability ?? 'available'
  const purchasable = availability === 'available'

  const isBookzone = (product.url ?? '').includes('bookzone')
  const ctaLabel = purchasable
    ? isBookzone
      ? 'Cumpără pe Bookzone'
      : 'Cumpără'
    : availability === 'sold_out'
      ? 'Detalii'
      : 'Listă așteptare'

  return (
    <ProductFormatCard
      format={format}
      image={product.cover}
      tag={tagByAvailability[availability] ?? null}
      tagTone={!purchasable ? 'waitlist' : format === 'hardcover' ? 'physical' : 'digital'}
      eyebrow={eyebrowByFormat[product.format ?? ''] ?? null}
      title={product.name}
      text={product.description}
      metaItems={product.metaItems ?? []}
      price={purchasable ? product.price : null}
      priceText={purchasable ? null : (priceTextByAvailability[availability] ?? 'Disponibil curând')}
      ctaLabel={ctaLabel}
      ctaVariant={purchasable ? 'primary' : 'ghost'}
      href={product.url}
    />
  )
}
