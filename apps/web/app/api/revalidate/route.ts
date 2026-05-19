import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { model?: string; entry?: { slug?: string } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { model, entry } = body

  if (!model) {
    return NextResponse.json({ error: 'Missing model' }, { status: 400 })
  }

  // Use 'max' profile for stale-while-revalidate semantics (Next.js 16)
  revalidateTag(model, 'max')
  if (entry?.slug) {
    revalidateTag(`${model}:${entry.slug}`, 'max')
  }

  return NextResponse.json({ revalidated: true, model })
}
