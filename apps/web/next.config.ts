import type { NextConfig } from 'next'

// In Next.js 16, the image optimizer refuses to fetch from upstreams whose
// hostname resolves to a private IP (including 127.0.0.1 and ::1) — even if
// `remotePatterns` matches. For local dev against Strapi on `localhost:1337`
// we have to opt in via `dangerouslyAllowLocalIP`. Gate it to development so
// production keeps the protection.
const isDev = process.env.NODE_ENV !== 'production'

// S3 public media host. CMS uploads via the aws-s3 provider, so media URLs are
// absolute (https://<bucket>.s3.<region>.amazonaws.com/<key>, bucket root) and
// the host must be allow-listed for next/image. The bucket name is not a secret
// (it appears in every image URL the browser fetches), so it's hardcoded as a
// default that works out of the box; MEDIA_HOSTNAME overrides it per environment
// if the bucket ever differs.
const s3MediaHost = process.env.MEDIA_HOSTNAME ?? 'damasaru-ro.s3.eu-central-1.amazonaws.com'

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
      { protocol: 'https', hostname: s3MediaHost, pathname: '/**', search: '' },
    ],
  },
}

export default nextConfig
