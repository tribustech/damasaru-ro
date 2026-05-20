import Image from 'next/image'
import Link from 'next/link'
import type { ProjectDTO, SectionAccent } from '@repo/types'
import { getAccent } from '@/lib/accent'

interface ProjectCardProps {
  project: ProjectDTO
  locale: string
  accent?: SectionAccent | null
}

export function ProjectCard({ project, locale, accent }: ProjectCardProps) {
  const a = getAccent(accent)
  const href = project.url ?? `/${locale}/proiecte/${project.slug}`
  const isExternal = !!project.url
  const imageUrl = project.cover?.url ?? null

  const card = (
    <article className={`group flex flex-col rounded-3xl overflow-hidden border ${a.border} ${a.isDark ? 'bg-white/5' : 'bg-white'}`}>
      {imageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={imageUrl} alt={project.cover?.alt ?? project.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-8">
        <h3 className={`text-2xl font-serif mb-3 ${a.text}`}>{project.name}</h3>
        {project.tagline && <p className={`text-sm font-serif italic mb-3 ${a.italic}`}>{project.tagline}</p>}
        {project.description && (
          <p className={`text-sm leading-relaxed ${a.textMuted}`}>{project.description}</p>
        )}
      </div>
    </article>
  )

  return isExternal ? (
    <a href={href} target="_blank" rel="noreferrer">{card}</a>
  ) : (
    <Link href={href}>{card}</Link>
  )
}
