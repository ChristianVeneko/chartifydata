import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  // Only allow POST method
  if (event.node.req.method !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Only POST requests are accepted.' })
    };
  }

  try {
    const body = await readBody(event);
    const { code } = body;
    
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Authorization code is required' })
      };
    }
    
    const config = useRuntimeConfig();
    const clientId = config.clientId;
    const clientSecret = config.clientSecret;
    const redirectUri = config.redirectUri;
    
    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Spotify credentials are missing in server configuration' })
      };
    }
    
    // Encode credentials in Base64 for authentication
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // Make request to Spotify API to exchange code for token
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
      console.error('Error in Spotify response:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error_description || 'Error obtaining access token' })
      };
    }
    
    // Return tokens to client
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in
    };
    
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}); 