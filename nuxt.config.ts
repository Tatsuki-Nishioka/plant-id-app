// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    baseURL: '/plant-id-app/',
    head: {
      meta: [
          {name: "theme-color", content: "#326CB3"},
      ],
      link: [
          {rel: 'icon', href: `/favicon.ico`, sizes: "48x48"},
          {rel: 'apple-touch-icon', href: `/apple-touch-icon-180x180.png`},
      ],
  },
  },

  nitro: {
    output: {
      dir: 'docs' // GitHub Pagesのデフォルトディレクトリに合わせて出力ディレクトリを設定
    }
  },

  modules: ['@nuxt/eslint', '@vite-pwa/nuxt'],
  pwa: {
    registerType: "autoUpdate", // 多分なくてもよい
    manifest: {
        name: 'マレシア植物区の植物同定アプリ',
        description: "マレシア植物区の植物同定アプリ",
        theme_color: "#4caf50", // テーマカラー
        lang: "ja",
        short_name: "マレシア植物同定",
        scope: "/plant-id-app/",
        start_url: "/plant-id-app/",
        display: "standalone",
        background_color: "#ffffff",
        icons: [
            {
                "src": "pwa-64x64.png",
                "sizes": "64x64",
                "type": "image/png"
            },
            {
                "src": "pwa-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "pwa-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            },
            {
                "src": "maskable-icon-512x512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable"
            }
        ],
    },
    workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest}'],
        navigateFallback: '/'
    },
    devOptions: { // テスト用
        enabled: true,
        type: "module"
    },
  }
})