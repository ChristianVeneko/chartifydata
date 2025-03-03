// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '@/public/styles.css', // Ruta a tu archivo de estilos globales
  ],
  modules: ['@pinia/nuxt'],
	pinia: {
		storesDirs: ['./stores/**']
	},
	runtimeConfig: {
		clientId: process.env.NUXT_CLIENT_ID,
		clientSecret: process.env.NUXT_CLIENT_SECRET,
		redirectUri: process.env.NUXT_REDIRECT_URI,
		public: {
			baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
			appName: process.env.NUXT_PUBLIC_APP_NAME,
			appDescription: process.env.NUXT_PUBLIC_APP_DESCRIPTION
		}
	},

  app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			title: 'Chartifydata - Visualiza tus estadísticas de Spotify',
			meta: [
				{
					name: 'description',
					content: 'Visualiza tus artistas, canciones y álbumes más escuchados en Spotify'
				},
				{
					name: 'theme-color',
					content: '#1db954'
				}
			],
			link: [
				{
					rel: 'icon',
					type: 'image/png',
					href: '/favicon.png'
				}
			]
		}
	}

})
