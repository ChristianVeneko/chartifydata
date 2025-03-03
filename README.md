# Chartifydata

Chartifydata es una aplicación web que te permite visualizar tus estadísticas personales de Spotify, como artistas, canciones y álbumes más escuchados en diferentes períodos de tiempo, así como tu historial de reproducción reciente.

![Chartifydata Screenshot](https://via.placeholder.com/800x400?text=Chartifydata+Screenshot)

## Características

- 🎵 **Visualiza tus artistas más escuchados** - Descubre a quiénes escuchas más
- 🎧 **Descubre tus canciones favoritas** - Visualiza tus canciones más reproducidas
- 💿 **Explora tus álbumes más reproducidos** - Conoce tus álbumes preferidos
- 🕰️ **Analiza tu historial de reproducción reciente** - Revisa tu actividad musical más reciente
- 🔍 **Filtra por diferentes períodos de tiempo** - 4 semanas, 6 meses o todo el tiempo
- 📊 **Exporta tus datos** - Guarda tus estadísticas en formato CSV
- 🔄 **Autenticación mejorada** - Sistema de login y refresh token implementado con Pinia
- 📱 **Diseño responsive** - Optimizado para todos los dispositivos
- ⚡ **Interfaz reactiva** - Actualizaciones en tiempo real cuando cambia el estado de autenticación

## Tecnologías utilizadas

- [Nuxt.js 3](https://nuxt.com/) - Framework basado en Vue.js
- [Vue 3](https://vuejs.org/) - Framework JavaScript progresivo
- [Pinia](https://pinia.vuejs.org/) - Gestión de estado para Vue
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - API de Spotify

## Requisitos previos

- Node.js (v16 o superior)
- Cuenta de desarrollador de Spotify
- Aplicación registrada en [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/chartifydata.git
   cd chartifydata
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Copia el archivo `.env.example` a `.env` y configura tus credenciales de Spotify:
   ```bash
   cp .env.example .env
   ```

4. Edita el archivo `.env` con tus credenciales de Spotify:
   ```
   NUXT_CLIENT_ID=tu_client_id_de_spotify
   NUXT_CLIENT_SECRET=tu_client_secret_de_spotify
   NUXT_REDIRECT_URI=http://localhost:3000/api/callback
   NUXT_PUBLIC_BASE_URL=http://localhost:3000
   NUXT_PUBLIC_APP_NAME=Chartifydata
   NUXT_PUBLIC_APP_DESCRIPTION=Visualiza tus estadísticas de Spotify
   ```

## Configuración de Spotify Developer

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) y crea una nueva aplicación
2. Configura la URL de redirección en la configuración de tu aplicación:
   - Añade `http://localhost:3000/api/callback` para desarrollo local
   - Para producción, añade la URL de tu sitio desplegado seguida de `/api/callback`
3. Copia el Client ID y Client Secret a tu archivo `.env`
4. Asegúrate de que tu aplicación tiene los permisos (scopes) necesarios:
   - `user-read-private`
   - `user-read-email`
   - `user-top-read`
   - `user-read-recently-played`

## Ejecución

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm run start
```

## Sistema de Autenticación

Chartifydata implementa un sistema robusto de autenticación con Spotify utilizando:

- **OAuth 2.0** para autenticación segura con Spotify
- **Store centralizado** con Pinia para gestionar el estado de autenticación
- **Refresco automático de tokens** para mantener la sesión sin interrupciones
- **Sincronización entre pestañas** para mantener el estado de autenticación consistente
- **Gestión de errores** para manejar problemas de autenticación

Los endpoints principales para la autenticación son:

- `/api/login` - Inicia el flujo de autenticación OAuth 2.0 con Spotify
- `/api/callback` - Procesa la respuesta de autenticación de Spotify
- `/api/refresh` - Refresca el token de acceso cuando está a punto de expirar
- `/api/logout` - Cierra la sesión del usuario

## Estructura del proyecto

```
chartifydata/
├── assets/           # Recursos estáticos (CSS, imágenes)
├── components/       # Componentes Vue reutilizables
│   ├── Header.vue    # Barra de navegación con estado de autenticación
│   ├── MusicForm.vue # Formulario para seleccionar datos a visualizar
│   └── ResultsComponent.vue # Visualización de resultados
├── pages/            # Páginas de la aplicación
│   ├── index.vue     # Página principal
│   └── auth.vue      # Página de autenticación
├── public/           # Archivos públicos (favicon, iconos)
│   └── assets/       # Recursos accesibles públicamente
├── server/           # API endpoints (Nitro)
│   └── api/          # Endpoints de la API
│       ├── login.ts  # Iniciar autenticación
│       ├── callback.ts # Procesar callback de Spotify
│       ├── refresh.js # Refrescar token de acceso
│       └── logout.js # Cerrar sesión
├── stores/           # Stores de Pinia
│   └── auth.js       # Store para gestión de autenticación
├── utils/            # Utilidades y helpers
│   └── music.js      # Clase para interactuar con la API de Spotify
├── .env              # Variables de entorno
├── nuxt.config.ts    # Configuración de Nuxt
└── package.json      # Dependencias y scripts
```

## Características de UI/UX

- **Diseño moderno y minimalista** inspirado en la estética de Spotify
- **Animaciones suaves** para una experiencia de usuario agradable
- **Modo responsivo** adaptado a diferentes tamaños de pantalla
- **Tarjetas interactivas** con efectos hover para visualizar datos
- **Exportación de datos** a CSV para análisis adicional
- **Enlaces directos a Spotify** para cada artista, canción o álbum
- **Diseño accesible** con contrastes adecuados y elementos intuitivos

## Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Agradecimientos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Nuxt.js](https://nuxt.com/)
- [Vue.js](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
