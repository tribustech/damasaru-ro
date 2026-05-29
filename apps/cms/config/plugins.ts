import type { Core } from '@strapi/strapi'

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'i18n': {
    enabled: true,
    config: {
      defaultLocale: 'ro',
      locales: ['ro', 'en'],
    },
  },
  // Use the aws-s3 upload provider only when a bucket is configured; otherwise
  // fall back to Strapi's default local-disk provider (keeps local dev + the
  // seed bootstrap working without S3 credentials).
  ...(env('AWS_BUCKET')
    ? {
        upload: {
          config: {
            provider: 'aws-s3',
            providerOptions: {
              s3Options: {
                credentials: {
                  accessKeyId: env('AWS_ACCESS_KEY_ID'),
                  secretAccessKey: env('AWS_ACCESS_SECRET'),
                },
                region: env('AWS_REGION'),
                params: {
                  // The ACL key must stay PRESENT — the provider injects a
                  // `public-read` default when `'ACL' in params` is false, which
                  // buckets with Object Ownership = "Bucket owner enforced" (the
                  // AWS default since 2023) reject with AccessControlListNotSupported.
                  // Leaving AWS_ACL empty sends a present-but-falsy value, so the
                  // provider omits the ACL header entirely. Grant public read via
                  // a bucket policy instead. Set AWS_ACL=public-read only on
                  // buckets that still allow ACLs.
                  ACL: env('AWS_ACL'),
                  Bucket: env('AWS_BUCKET'),
                },
              },
            },
            actionOptions: {
              upload: {},
              uploadStream: {},
              delete: {},
            },
          },
        },
      }
    : {}),
})

export default config
