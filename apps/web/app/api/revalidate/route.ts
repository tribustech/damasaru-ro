import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

interface RevalidateBody {
  // Preferred contract: the CMS computes the exact cache tags to bust.
  tags?: unknown
  // Legacy contract: a single model (+ optional entry slug).
  model?: string
  entry?: { slug?: string }
}

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: RevalidateBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Collect the tags to revalidate. New callers send an explicit `tags` array;
  // older callers send `model` (+ `entry.slug`) and we derive the pair.
  const tags = new Set<string>()

  if (Array.isArray(body.tags)) {
    for (const tag of body.tags) {
      if (typeof tag === 'string' && tag.length > 0) tags.add(tag)
    }
  } else if (body.model) {
    tags.add(body.model)
    if (body.entry?.slug) tags.add(`${body.model}:${body.entry.slug}`)
  }

  if (tags.size === 0) {
    return NextResponse.json({ error: 'Missing tags' }, { status: 400 })
  }

  // Expire immediately ({ expire: 0 }) rather than the 'max' profile. Strapi is an
  // external system hitting this Route Handler, so editors expect their published
  // change visible on the very next load. The 'max' profile only marks the tag
  // *stale* (stale-while-revalidate): the first visit after a change still serves
  // the old render and refetches in the background, so e.g. a newly-featured press
  // mention wouldn't show up until a later visit. Next 16 docs call out
  // `{ expire: 0 }` as the required pattern for external webhooks needing immediate
  // expiration (updateTag is Server-Action-only, so it isn't usable here).
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 })
  }

  return NextResponse.json({ revalidated: true, tags: [...tags] })
}
