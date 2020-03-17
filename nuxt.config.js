import webpack from 'webpack'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet',  href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js' },
      { src: 'https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver', body: true },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: 'red' },
  /*
  ** Global CSS
  */
  css: [
    '~/node_modules/materialize-css/dist/css/materialize.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~filters/date' },
    { src: '~plugins/mixins' },
    { src: '~plugins/modalsLogic' },
    { src: '~plugins/loadingComponent' },
    { src: '~plugins/noty', mode: 'client' },
    { src: '~plugins/vue-pagination', mode: 'client' },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    transpile: [
      "vee-validate/dist/rules",
    ],
    extend(config, ctx) {}
  },
  /*
  ** Routes settings
  */
  router: {
    prefetchLinks: false,
    linkActiveClass: 'active',
    middleware: [
      'check-admin',
    ]
  },
  /*
  ** Environment variables
  */
  env: {
    access_token: 'access_token',
    default_user_image: 'default_user_image.svg',
    default_product_image: 'default_product_image.svg',
    path_users_images: 'images/users',
    path_products_images: 'images/products',
  }
}
