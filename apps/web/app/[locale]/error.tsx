'use client'

import { useEffect } from 'react'
import { Button } from '@/components/atoms/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="text-center">
        <h2 className="text-2xl font-serif font-light mb-4" style={{ color: '#2D241E' }}>
          Ceva nu a funcționat corect.
        </h2>
        <Button onClick={reset} variant="outline">
          Încearcă din nou
        </Button>
      </div>
    </div>
  )
}
