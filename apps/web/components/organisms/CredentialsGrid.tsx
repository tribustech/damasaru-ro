import Image from 'next/image'
import type { CredentialsGridDTO } from '@repo/types'

interface CredentialsGridProps {
  section: CredentialsGridDTO
}

const ZONE_BY_ACCENT: Record<CredentialsGridDTO['accent'], string> = {
  navy: 'zone-dark',
  paper: 'zone-light',
  'paper-warm': 'zone-warm',
  'navy-deep': 'zone-dark-deep',
}

export function CredentialsGrid({ section }: CredentialsGridProps) {
  const zoneClass = ZONE_BY_ACCENT[section.accent] ?? 'zone-warm'

  return (
    <section className={zoneClass}>
      <div className="ds-container">
        {section.eyebrow && <div className="section-eyebrow">{section.eyebrow}</div>}
        {section.heading && (
          <h2 className="section-title">
            {section.heading}
            {section.headingItalic && <span className="italic">{section.headingItalic}</span>}
          </h2>
        )}
        {section.lead && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '22px',
              color: 'var(--color-text-mid)',
              marginTop: '32px',
              lineHeight: 1.5,
              maxWidth: '880px',
            }}
          >
            {section.lead}
          </p>
        )}
        <div className="creds-grid">
          {section.groups.map((group) => (
            <div key={group.id} className="creds-col">
              <h4>{group.title}</h4>
              {group.image && (
                <div className="mentor-photo">
                  <Image
                    src={group.image.url}
                    alt={group.image.alt || group.title}
                    width={group.image.width || 600}
                    height={group.image.height || 600}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              )}
              {group.imageCaption && <p className="mentor-caption">{group.imageCaption}</p>}
              {group.items.length > 0 && (
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      {item.sub ? (
                        <>
                          <strong>{item.label}</strong> — {item.sub}
                        </>
                      ) : (
                        item.label
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
