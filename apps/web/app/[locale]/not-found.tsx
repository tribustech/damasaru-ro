import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="text-center">
        <p className="text-sm uppercase tracking-wider mb-4" style={{ color: '#B8866F' }}>
          404
        </p>
        <h2 className="text-4xl font-serif font-light mb-6" style={{ color: '#2D241E' }}>
          Pagina nu a fost găsită.
        </h2>
        <Link
          href="/ro"
          className="text-sm hover:opacity-70 transition-opacity"
          style={{ color: '#B8866F' }}
        >
          ← Înapoi acasă
        </Link>
      </div>
    </div>
  )
}
