import Image from 'next/image'
import Link from 'next/link'
import type { ProductDTO, SectionAccent } from '@repo/types'
import { getAccent } from '@/lib/accent'

interface ProductCardProps {
  product: ProductDTO
  accent?: SectionAccent | null
}

const formatLabel: Record<string, string> = {
  hardcover: 'Carte',
  ebook: 'E-book',
  audiobook: 'Audiobook',
  event: 'Eveniment',
  course: 'Program digital',
  bundle: 'Pachet',
}

const availabilityLabel: Record<string, string> = {
  available: 'Disponibil',
  waitlist: 'Listă așteptare',
  sold_out: 'Epuizat',
  upcoming: 'Disponibil curând',
}

const overlayTag: Record<string, { label: string; tone: 'gold' | 'forest' } | null> = {
  available: { label: 'Bestseller', tone: 'gold' },
  waitlist: { label: 'Listă așteptare', tone: 'forest' },
  sold_out: { label: 'Epuizat', tone: 'forest' },
  upcoming: { label: 'În curând', tone: 'forest' },
}

export function ProductCard({ product, accent }: ProductCardProps) {
  const a = getAccent(accent)
  const imageUrl = product.cover?.url ?? null
  const availability = product.availability ?? ''
  const format = product.format ?? ''
  const tag = overlayTag[availability] ?? null
  const isDisabled = availability === 'upcoming' || availability === 'sold_out'
  const ctaHref = product.url ?? '#'

  return (
    <article
      className={`group flex flex-col rounded-xl overflow-hidden border ${a.border} ${a.isDark ? 'bg-white/5' : 'bg-white'} transition-all hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(20,32,46,0.18)] hover:border-[var(--color-gold-deep)]`}
    >
      <div className="relative aspect-[4/5] bg-gradient-to-br from-[var(--color-navy-soft)] to-[var(--color-navy)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.cover?.alt ?? product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] uppercase tracking-[0.2em] text-white/30">
            {formatLabel[format] ?? format}
          </div>
        )}
        {tag && (
          <span
            className={`absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] ${
              tag.tone === 'gold'
                ? 'bg-[var(--color-gold)] text-[var(--color-navy)]'
                : 'bg-[var(--color-forest)] text-white'
            }`}
          >
            {tag.label}
          </span>
        )}
      </div>

      <div className="flex flex-col p-6 flex-1">
        {format && (
          <span className="inline-block self-start bg-[var(--color-forest)] text-white text-[10px] uppercase tracking-[0.15em] font-bold px-2.5 py-1 rounded-full">
            {formatLabel[format] ?? format}
          </span>
        )}
        <h3 className={`font-serif text-[22px] font-medium leading-[1.25] mt-2.5 mb-3 ${a.text}`}>
          {product.name}
        </h3>
        {product.description && (
          <p className={`text-[13px] leading-[1.5] flex-1 ${a.textMuted}`}>{product.description}</p>
        )}
        <div className={`mt-5 pt-5 border-t ${a.border} flex justify-between items-center gap-4`}>
          {isDisabled ? (
            <span className={`font-serif italic text-sm text-[var(--color-text-soft)]`}>
              {availabilityLabel[availability] ?? availability}
            </span>
          ) : product.price ? (
            <span className={`font-serif text-2xl font-medium ${a.text}`}>{product.price}</span>
          ) : null}
          <Link
            href={ctaHref}
            className="text-[13px] font-medium border-b border-[var(--color-gold-deep)] text-[var(--color-gold-deep)] pb-0.5 hover:text-[var(--color-navy)] hover:border-[var(--color-navy)] transition-colors"
          >
            {isDisabled ? 'Listă așteptare' : product.url ? 'Cumpără' : 'Detalii'} →
          </Link>
        </div>
      </div>
    </article>
  )
}
