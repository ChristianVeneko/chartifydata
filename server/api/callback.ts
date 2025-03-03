// server/api/callback.ts

import { getQuery, sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;
  const state = query.state as string;
  const error = query.error as string;
  const config = useRuntimeConfig();

  // Handle authentication errors
  if (error) {
    console.error(`Authentication error: ${error}`);
    return sendRedirect(event, `${config.public.baseUrl}/auth?error=${encodeURIComponent(error)}`, 302);
  }

  // Verify that we have the necessary code
  if (!code) {
    console.error('No authorization code received');
    return sendRedirect(event, `${config.public.baseUrl}/auth?error=no_code`, 302);
  }

  try {
    // Make request to Spotify API to exchange code for token
    const clientId = config.clientId;
    const clientSecret = config.clientSecret;
    const redirectUri = config.redirectUri;
    
    if (!clientId || !clientSecret) {
      console.error('Spotify credentials are missing in server configuration');
      return sendRedirect(event, `${config.public.redirectUri.split('/auth')[0]}?error=missing_credentials`, 302);
    }
    
    // Encode credentials in Base64 for authentication
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`Error obtaining token: ${data.error}`);
      return sendRedirect(event, `${config.public.baseUrl}/auth?error=${encodeURIComponent(data.error)}`, 302);
    }

    const redirectUrl = `${config.public.baseUrl}/auth?access_token=${data.access_token}&refresh_token=${data.refresh_token}&expires_in=${data.expires_in}`;
    return sendRedirect(event, redirectUrl, 302);
  } catch (error) {
    console.error('Error in authentication process:', error);
    return sendRedirect(event, `${config.public.baseUrl}/auth?error=authentication_failed`, 302);
  }
});
