// server/api/login.ts

import { sendRedirect } from 'h3';
import { generateRandomString } from '~/utils/generateRandomString';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const state = generateRandomString(16);
  
  // Scopes ampliados para una API completa de Spotify
  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-follow-read'
  ].join(' ');
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    scope,
    redirect_uri: config.redirectUri,
    state,
    show_dialog: 'true' // Permite al usuario elegir cuenta cada vez si es necesario
  });
  
  return sendRedirect(event, `https://accounts.spotify.com/authorize?${params.toString()}`, 302);
});
