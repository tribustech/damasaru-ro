import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      ...(process.env.STRAPI_HOSTNAME
        ? [
            {
              protocol: 'https' as const,
              hostname: process.env.STRAPI_HOSTNAME,
              pathname: '/uploads/**',
            },
          ]
        : []),
    ],
  },
}

export default nextConfig
