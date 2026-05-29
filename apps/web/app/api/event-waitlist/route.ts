import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { submitEventWaitlist } from '@/lib/strapi'

export async function POST(req: Request) {
  try {
    const { email, source, name } = await req.json()
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (typeof source !== 'string' || !source) {
      return NextResponse.json({ error: 'Missing source' }, { status: 400 })
    }
    await submitEventWaitlist(
      email.trim(),
      source.trim(),
      typeof name === 'string' && name.trim() ? name.trim() : null,
    )
    revalidateTag(`event-waitlist:${source}`, { expire: 0 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
