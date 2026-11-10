export default {
  routes: [
    {
      method: 'GET',
      path: '/sitemap-entries',
      handler: 'pages.sitemap',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/pages/:slug',
      handler: 'pages.findSingle',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/pages/:type/:slug',
      handler: 'pages.findDetail',
      config: { auth: false },
    },
  ],
}
