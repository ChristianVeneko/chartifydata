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
  
  // Extended scopes for a complete Spotify API
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
    show_dialog: 'true' // Allows the user to choose an account each time if necessary
  });
  
  console.log('Login redirection to Spotify with client ID:', config.clientId);
  console.log('Redirect URI:', config.redirectUri);
  
  return sendRedirect(event, `https://accounts.spotify.com/authorize?${params.toString()}`, 302);
});
