// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Desactivar devtools en producción para mejorar el rendimiento
  devtools: { enabled: process.env.NODE_ENV === 'development' },
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
  // Optimizaciones para vite
  vite: {
    // Optimizar la compilación de Vue
    vue: {
      template: {
        compilerOptions: {}
      }
    },
    // Resolver alias más eficientemente
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm-bundler.js'
      }
    },
    // Optimizar la construcción
    build: {
      // Fragmentar el código para mejor rendimiento
      chunkSizeWarningLimit: 1000, // Aumentar el límite de advertencia
      rollupOptions: {
        output: {
          manualChunks: {
            // Separar en chunks para cargar en paralelo
            'vue-vendor': ['vue', 'vue-router'],
            // Removemos pinia de aquí para evitar conflictos
          }
        }
      },
      // Minificar el código en producción
      minify: process.env.NODE_ENV === 'production',
      // Desactivar source maps en producción
      sourcemap: process.env.NODE_ENV !== 'production'
    },
    // Optimizar la caché
    optimizeDeps: {
      include: ['vue']
      // Removemos pinia para evitar el conflicto
    }
  },

  // Optimizaciones para la construcción de Nuxt
  build: {
    // No marcar pinia como externo
    // transpile: ['pinia']
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
