import { NextResponse } from 'next/server'
import { submitNewsletter } from '@/lib/strapi'

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json()
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    await submitNewsletter(email, typeof source === 'string' ? source : 'default')
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'unknown error' },
      { status: 500 }
    )
  }
}
