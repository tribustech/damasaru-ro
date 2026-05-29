import Link from 'next/link'
import type { CtaBannerDTO } from '@repo/types'
import { WaitlistCard } from '../molecules/AudiobookWaitlistForm'
import { getAudiobookWaitlistCount } from '@/lib/strapi'

interface CTABannerProps {
  section: CtaBannerDTO
}

const WAITLIST_BASELINE = 72

const ZONE_BY_ACCENT: Record<CtaBannerDTO['accent'], string> = {
  navy: 'zone-dark',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

type CommunityBlock =
  | { kind: 'p'; text: string }
  | { kind: 'li'; text: string }

function parseCommunityBlocks(subtext: string | null): CommunityBlock[] {
  if (!subtext) return []
  return subtext
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map<CommunityBlock>((line) =>
      line.startsWith('- ') ? { kind: 'li', text: line.slice(2).trim() } : { kind: 'p', text: line }
    )
}

export async function CTABanner({ section }: CTABannerProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-dark'
  const eyebrowLower = (section.eyebrow ?? '').toLowerCase()
  const isWaitlist = /pre[- ]?launch|waitlist|listă|lista|audiobook/.test(eyebrowLower)
  const isCommunity = /comunitate|mintea[- ]?treaz/.test(eyebrowLower)

  if (isWaitlist) {
    const paragraphs = (section.subheading ?? '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
    const realCount = await getAudiobookWaitlistCount().catch(() => 0)
    return (
      <section className={zoneClass}>
        <div className="ds-container">
          <WaitlistCard
            eyebrow={section.eyebrow}
            heading={section.heading}
            headingItalic={section.headingItalic}
            paragraphs={paragraphs}
            submitLabel={section.cta?.label ?? 'Înscrie-mă pe listă'}
            initialCount={WAITLIST_BASELINE + realCount}
          />
        </div>
      </section>
    )
  }

  if (isCommunity) {
    const blocks = parseCommunityBlocks(section.subheading)
    const paragraphs = blocks.filter((b) => b.kind === 'p')
    const bullets = blocks.filter((b) => b.kind === 'li')
    const submitLabel = section.cta?.label ?? 'Mă înscriu'
    return (
      <section className={zoneClass}>
        <div className="ds-container">
          <div className="community-card">
            <div className="community-grid">
              <div>
                {section.eyebrow && (
                  <div className="community-tag">
                    <span className="pulse-dot" aria-hidden />
                    {section.eyebrow}
                  </div>
                )}
                <h2>
                  {section.heading}
                  {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
                </h2>
                {paragraphs[0] && (
                  <p className="community-subtitle">{`„${paragraphs[0].text}"`}</p>
                )}
                {paragraphs.slice(1).map((p, i) => (
                  <p key={`p${i}`}>{`„${p.text}"`}</p>
                ))}
                {bullets.length > 0 && (
                  <ul className="community-list">
                    {bullets.map((b, i) => (
                      <li key={`li${i}`}>{b.text}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <form className="community-form" action={section.cta?.href ?? '#'} method="post">
                  <label htmlFor="community-email">Adresa ta de email *</label>
                  <input
                    id="community-email"
                    name="email"
                    type="email"
                    placeholder="adresa@ta.ro"
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    {submitLabel} <span aria-hidden>→</span>
                  </button>
                  <div className="community-form-hint">
                    Bine ai venit. Primul insight ajunge curând.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={zoneClass}>
      <div className="ds-container">
        <div className="body-grid-narrow" style={{ textAlign: 'center' }}>
          {section.eyebrow && (
            <div className="section-eyebrow center">{section.eyebrow}</div>
          )}
          <h2 className="section-title center">
            {section.heading}
            {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
          </h2>
          {section.subheading && (
            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.7,
                color: 'var(--color-text-light)',
                marginTop: '32px',
                marginBottom: '40px',
              }}
            >
              {section.subheading}
            </p>
          )}
          {section.cta && (
            <Link href={section.cta.href} className="btn btn-primary">
              {section.cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
