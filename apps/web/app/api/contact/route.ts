import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    // Persist via Strapi (contact-message collection to be added by editor) or just log for now.
    // For v1, we forward to Strapi if a collection exists; otherwise just succeed.
    const res = await fetch(`${STRAPI_URL}/api/contact-messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
      },
      body: JSON.stringify({ data: { name, email, message } }),
    }).catch(() => null)

    if (!res || res.status >= 500) {
      console.error('Contact form: failed to persist', { name, email })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'unknown error' },
      { status: 500 }
    )
  }
}
