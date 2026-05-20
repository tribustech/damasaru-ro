import type { NextConfig } from 'next'

// In Next.js 16, the image optimizer refuses to fetch from upstreams whose
// hostname resolves to a private IP (including 127.0.0.1 and ::1) — even if
// `remotePatterns` matches. For local dev against Strapi on `localhost:1337`
// we have to opt in via `dangerouslyAllowLocalIP`. Gate it to development so
// production keeps the protection.
const isDev = process.env.NODE_ENV !== 'production'

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**', search: '' },
      { protocol: 'http', hostname: '127.0.0.1', port: '1337', pathname: '/uploads/**', search: '' },
      ...(process.env.STRAPI_HOSTNAME && process.env.STRAPI_HOSTNAME !== 'localhost'
        ? [
            {
              protocol: 'https' as const,
              hostname: process.env.STRAPI_HOSTNAME,
              pathname: '/uploads/**',
              search: '',
            },
          ]
        : []),
    ],
  },
}

export default nextConfig
