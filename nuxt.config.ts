
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
	pinia: {
		storesDirs: ['./stores/**']
	},
	runtimeConfig: {
		clientId: '',
		clientSecret: '',
		redirectUri: '',
		public: {
			clientId: '',
			baseUrl: ''
		}
	},
  app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			title: 'Chartify',
			meta: [
				{
					name: 'description',
					content: 'hello world'
				}
			]
		}
	}

})
