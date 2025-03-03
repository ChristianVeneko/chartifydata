import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get stored tokens if in browser
  let storedTokens = {};
  if (isBrowser) {
    try {
      storedTokens = {
        access_token: localStorage.getItem('spotify_access_token') ? 'exists' : 'not found',
        refresh_token: localStorage.getItem('spotify_refresh_token') ? 'exists' : 'not found',
        expires_at: localStorage.getItem('spotify_token_expires_at') || 'not found'
      };
    } catch (e) {
      storedTokens = { error: 'Cannot access localStorage in server environment' };
    }
  }
  
  return {
    clientId: config.clientId ? `${config.clientId.substring(0, 5)}...` : 'undefined',
    clientSecret: config.clientSecret ? `${config.clientSecret.substring(0, 5)}...` : 'undefined',
    redirectUri: config.redirectUri,
    publicBaseUrl: config.public.baseUrl,
    publicAppName: config.public.appName,
    publicAppDescription: config.public.appDescription,
    publicRedirectUri: config.public.redirectUri,
    env: {
      NUXT_CLIENT_ID: process.env.NUXT_CLIENT_ID ? `${process.env.NUXT_CLIENT_ID.substring(0, 5)}...` : 'undefined',
      NUXT_CLIENT_SECRET: process.env.NUXT_CLIENT_SECRET ? `${process.env.NUXT_CLIENT_SECRET.substring(0, 5)}...` : 'undefined',
      NUXT_REDIRECT_URI: process.env.NUXT_REDIRECT_URI,
      NUXT_PUBLIC_BASE_URL: process.env.NUXT_PUBLIC_BASE_URL,
      NUXT_PUBLIC_APP_NAME: process.env.NUXT_PUBLIC_APP_NAME,
      NUXT_PUBLIC_APP_DESCRIPTION: process.env.NUXT_PUBLIC_APP_DESCRIPTION
    },
    storedTokens: storedTokens
  };
}); 