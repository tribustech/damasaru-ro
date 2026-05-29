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

  // Use the 'max' profile for stale-while-revalidate semantics (Next.js 16).
  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }

  return NextResponse.json({ revalidated: true, tags: [...tags] })
}
