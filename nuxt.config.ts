// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/global.css',
  ],
  modules: ['@pinia/nuxt'],
	pinia: {
		storesDirs: ['./stores/**']
	},
	runtimeConfig: {
		// Variables disponibles solo en el servidor
		clientId: process.env.NUXT_CLIENT_ID,
		clientSecret: process.env.NUXT_CLIENT_SECRET,
		redirectUri: process.env.NUXT_REDIRECT_URI || 'http://localhost:3000/api/callback',
		public: {
			// Variables disponibles en el cliente
			baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
			appName: process.env.NUXT_PUBLIC_APP_NAME || 'Chartifydata',
			appDescription: process.env.NUXT_PUBLIC_APP_DESCRIPTION || 'Visualize your Spotify statistics',
		}
	},
  vite: {
    vue: {
      template: {
        compilerOptions: {
          // Removed the incorrect isCustomElement setting
        }
      }
    },
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm-bundler.js'
      }
    }
  },

  app: {
		head: {
			title: 'Chartifydata - Visualize your Spotify statistics',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ 
					hid: 'description', 
					name: 'description', 
					content: 'Explore and visualize your Spotify statistics with Chartifydata. Discover your most listened artists, songs, and albums.'
				},
				{ name: 'theme-color', content: '#1DB954' }
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
			],
			htmlAttrs: {
				lang: 'en'
			}
		}
	}

})
