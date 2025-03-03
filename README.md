# Chartifydata

Chartifydata es una aplicación web que te permite visualizar tus estadísticas personales de Spotify, como artistas, canciones y álbumes más escuchados en diferentes períodos de tiempo.

![Chartifydata Screenshot](https://via.placeholder.com/800x400?text=Chartifydata+Screenshot)

## Características

- 🎵 Visualiza tus artistas más escuchados
- 🎧 Descubre tus canciones favoritas
- 💿 Explora tus álbumes más reproducidos
- 📊 Analiza tu historial de reproducción reciente
- 🕒 Filtra por diferentes períodos de tiempo (4 semanas, 6 meses, todo el tiempo)
- 🔒 Autenticación segura con Spotify
- 📱 Diseño responsive para todos los dispositivos

## Tecnologías utilizadas

- [Nuxt.js 3](https://nuxt.com/) - Framework basado en Vue.js
- [Pinia](https://pinia.vuejs.org/) - Gestión de estado
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
   ```

## Configuración de Spotify Developer

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) y crea una nueva aplicación
2. Configura la URL de redirección en la configuración de tu aplicación:
   - Añade `http://localhost:3000/api/callback` para desarrollo local
3. Copia el Client ID y Client Secret a tu archivo `.env`

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

## Despliegue

La aplicación puede ser desplegada en cualquier plataforma que soporte aplicaciones Nuxt.js, como Vercel, Netlify o Heroku.

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

Configura tu repositorio en Netlify y usa los siguientes comandos de construcción:

- Build command: `npm run generate`
- Publish directory: `dist`

## Estructura del proyecto

```
chartifydata/
├── components/       # Componentes Vue
├── pages/            # Páginas de la aplicación
├── public/           # Archivos estáticos
├── server/           # API endpoints (Nitro)
├── utils/            # Utilidades y helpers
├── .env              # Variables de entorno
├── nuxt.config.ts    # Configuración de Nuxt
└── package.json      # Dependencias y scripts
```

## Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter) - email@example.com

Link del proyecto: [https://github.com/tu-usuario/chartifydata](https://github.com/tu-usuario/chartifydata)

## Agradecimientos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Nuxt.js](https://nuxt.com/)
- [Vue.js](https://vuejs.org/)
