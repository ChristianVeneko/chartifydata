
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
		clientId: 'a',
		clientSecret: 's',
		redirectUri: 'v',
		public: {
			clientId: '',
			baseUrl: '',
			test:''
		}
	},

  app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			title: 'Chartifydata',
			meta: [
				{
					name: 'description',
					content: 'hello world'
				}
			]
		}
	}

})
