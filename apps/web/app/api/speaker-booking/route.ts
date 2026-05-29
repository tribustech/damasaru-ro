import { NextResponse } from 'next/server'
import { submitSpeakerBooking, type SpeakerBookingPayload } from '@/lib/strapi'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 })
    }
    const payload: SpeakerBookingPayload = {
      email,
      name,
      message,
      phone: typeof body?.phone === 'string' && body.phone.trim() ? body.phone.trim() : null,
      organization:
        typeof body?.organization === 'string' && body.organization.trim()
          ? body.organization.trim()
          : null,
      eventType:
        typeof body?.eventType === 'string' && body.eventType ? body.eventType : null,
      audienceSize:
        typeof body?.audienceSize === 'string' && body.audienceSize ? body.audienceSize : null,
      budget: typeof body?.budget === 'string' && body.budget ? body.budget : null,
      dateEstimate:
        typeof body?.dateEstimate === 'string' && body.dateEstimate.trim()
          ? body.dateEstimate.trim()
          : null,
    }
    await submitSpeakerBooking(payload)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
