import Link from 'next/link'
import { getPressMentions } from '@/lib/strapi'
import { ArchiveFilter } from './ArchiveFilter'

export default async function MediaArhivaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const items = await getPressMentions(locale).catch(() => [])
  const total = items.length

  return (
    <>
      <style>{HERO_CSS}</style>

      <section className="arh-hero">
        <div className="ds-container">
          <Link href={`/${locale}/media`} className="arh-back">
            <span aria-hidden="true">←</span> Înapoi la Media
          </Link>
          <div className="arh-eyebrow">Arhiva completă</div>
          <h1 className="arh-h1">
            Arhiva completă
            <em>{total} apariții</em>
          </h1>
          <p className="arh-lead">
            Fiecare interviu, podcast, articol și eveniment, într-un singur loc. Filtrează
            după tip de apariție sau brand și caută exact ce te interesează.
          </p>
        </div>
      </section>

      <section className="arh-body">
        <div className="ds-container">
          <ArchiveFilter items={items} />
        </div>
      </section>
    </>
  )
}

const HERO_CSS = `
.arh-hero {
  background: var(--color-navy);
  padding: 80px 0 64px;
  position: relative;
  overflow: hidden;
}
.arh-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 30%, rgba(212,175,106,0.08), transparent 50%),
    radial-gradient(ellipse at 20% 70%, rgba(90,153,153,0.06), transparent 50%);
  pointer-events: none;
}
.arh-hero .ds-container { position: relative; z-index: 2; }
.arh-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-light);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: none;
  margin-bottom: 36px;
  transition: color 0.2s ease;
}
.arh-back:hover { color: var(--color-gold); }
.arh-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 24px;
}
.arh-eyebrow::before {
  content: '';
  width: 32px;
  height: 1px;
  background: var(--color-gold);
}
.arh-h1 {
  font-family: var(--font-serif);
  font-size: 72px;
  font-weight: 500;
  line-height: 1;
  color: #fff;
  letter-spacing: -2px;
  margin: 0 0 28px;
}
.arh-h1 em {
  display: block;
  color: var(--color-gold);
  font-style: italic;
  font-weight: 500;
}
.arh-lead {
  max-width: 620px;
  color: var(--color-text-light);
  font-size: 16px;
  line-height: 1.7;
  opacity: 0.85;
  margin: 0;
}
.arh-body {
  background: var(--color-paper);
  padding: 64px 0 100px;
}
@media (max-width: 1024px) {
  .arh-h1 { font-size: 52px; }
}
@media (max-width: 640px) {
  .arh-h1 { font-size: 40px; }
  .arh-hero { padding: 56px 0 48px; }
}
`
