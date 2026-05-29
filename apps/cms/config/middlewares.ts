import type { Core } from '@strapi/strapi';

const bucket = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;
// The admin panel loads media previews directly from S3, so the bucket host
// must be allow-listed in the CSP img-src/media-src directives or thumbnails
// and video previews break. Host follows the virtual-hosted–style URL Strapi
// stores: https://<bucket>.s3.<region>.amazonaws.com
const s3Host = bucket && region ? `${bucket}.s3.${region}.amazonaws.com` : undefined;
const s3Sources = s3Host ? [s3Host] : [];

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'ws:', 'wss:'],
          'img-src': ["'self'", 'data:', 'blob:', ...s3Sources],
          'media-src': ["'self'", 'data:', 'blob:', ...s3Sources],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
