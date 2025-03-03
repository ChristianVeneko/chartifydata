// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Desactivar devtools en producción para mejorar el rendimiento
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  css: [
    '~/assets/css/global.css',
  ],
  modules: ['@pinia/nuxt'],
	pinia: {
		autoImports: ['defineStore', 'acceptHMRUpdate'],
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
  // Optimizaciones para build
  build: {
    transpile: ['pinia'],
  },
  
  // Optimizaciones para vite
  vite: {
    // Optimizar la compilación de Vue
    vue: {
      template: {
        compilerOptions: {
          hoistStatic: true,
          cacheHandlers: true
        }
      }
    },
    
    // Configuración básica de build
    build: {
      target: 'es2019',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
        }
      }
    },
    
    // Optimizar la caché
    optimizeDeps: {
      include: ['pinia'],
      exclude: ['vue'],  // Excluir Vue ya que es manejado por Nuxt
    }
  },

  // Optimizaciones para la construcción de Nuxt
  build: {
    analyze: false,
  },
  
  // Optimizar nitro server
  nitro: {
    // Optimización de compresión
    compressPublicAssets: true,
    // Optimizaciones del servidor
    minify: true
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
		},
    // Optimizaciones de rendimiento para la aplicación
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Optimizaciones de rendimiento (solo opciones soportadas)
  experimental: {
    // Cargar componentes asíncronicamente
    asyncContext: true,
    // Optimizar la carga de los componentes
    componentIslands: true,
    // Activar tree shaking para componentes del lado del cliente
    treeshakeClientOnly: true
  }
  
})
