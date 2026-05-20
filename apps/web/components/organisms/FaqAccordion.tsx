'use client'

import { useState } from 'react'
import type { FaqAccordionDTO } from '@repo/types'
import { SectionHeading } from '../molecules/SectionHeading'
import { getAccent, accentRootClass } from '@/lib/accent'

interface FaqAccordionProps {
  section: FaqAccordionDTO
}

export function FaqAccordion({ section }: FaqAccordionProps) {
  const a = getAccent(section.accent)
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className={`${a.background} ${accentRootClass(section.accent)} py-24`}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <SectionHeading
          eyebrow={section.eyebrow}
          heading={section.heading ?? ''}
          accent={section.accent}
          align="center"
        />
        <ul className="mt-12 space-y-3">
          {section.items.map((item) => {
            const isOpen = open === item.id
            return (
              <li key={item.id} className={`border ${a.border} rounded-2xl overflow-hidden`}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className={`w-full text-left px-6 py-5 flex justify-between items-center gap-4 ${a.text}`}
                >
                  <span className="text-lg font-serif">{item.question}</span>
                  <span className={`text-2xl ${a.italic.split(' ')[0]} transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    className={`px-6 pb-6 text-base leading-relaxed ${a.textMuted} prose ${a.isDark ? 'prose-navy' : 'prose-paper'} max-w-none`}
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
