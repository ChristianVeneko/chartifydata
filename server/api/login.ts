// server/api/login.ts

import { sendRedirect } from 'h3';

// Simple function to generate a random string for state parameter
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const state = generateRandomString(16);
  
  // Verificar que tenemos las credenciales necesarias
  if (!config.clientId) {
    console.error('ERROR: Client ID de Spotify no configurado');
    return sendRedirect(event, `${config.public.baseUrl}?error=missing_client_id`, 302);
  }
  
  if (!config.redirectUri) {
    console.error('ERROR: URI de redirección no configurado');
    return sendRedirect(event, `${config.public.baseUrl}?error=missing_redirect_uri`, 302);
  }
  
  // Extended scopes for a complete Spotify API
  const scope = [
    'user-read-private',    // Para información básica del perfil
    'user-read-email',      // Para identificación del usuario
    'user-top-read',        // Para obtener top artistas y canciones
    'user-read-recently-played',  // Para análisis de escuchas recientes
    'user-library-read'     // Para análisis de biblioteca
  ].join(' ');
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    scope,
    redirect_uri: config.redirectUri,
    state,
    show_dialog: 'true' // Allows the user to choose an account each time if necessary
  });
  
  console.log('Login - Redireccionando a Spotify para autenticación');
  console.log('Login - Detalles de configuración:');
  console.log('  • Client ID:', config.clientId ? `${config.clientId.substring(0, 4)}...${config.clientId.substring(config.clientId.length - 4)}` : 'NO CONFIGURADO');
  console.log('  • Redirect URI:', config.redirectUri);
  console.log('  • Base URL:', config.public.baseUrl);
  
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('Login - URL de autorización completa:', spotifyAuthUrl);
  
  return sendRedirect(event, spotifyAuthUrl, 302);
});
