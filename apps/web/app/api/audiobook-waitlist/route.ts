import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { submitAudiobookWaitlist } from '@/lib/strapi'

export async function POST(req: Request) {
  try {
    const { email, note } = await req.json()
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    await submitAudiobookWaitlist(email.trim(), typeof note === 'string' && note.trim() ? note.trim() : null)
    revalidateTag('audiobook-waitlist', { expire: 0 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    const isDuplicate = /unique|duplicate/i.test(message)
    return NextResponse.json(
      { error: isDuplicate ? 'already-subscribed' : message },
      { status: isDuplicate ? 409 : 500 }
    )
  }
}
