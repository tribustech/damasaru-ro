export function sectionAnchorId(eyebrow: string | null | undefined): string | undefined {
  if (!eyebrow) return undefined
  const slug = eyebrow
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || undefined
}
