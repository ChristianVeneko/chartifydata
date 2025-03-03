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
    const { refresh_token } = body;
    
    if (!refresh_token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Refresh token is required' })
      };
    }
    
    const config = useRuntimeConfig();
    const clientId = config.clientId;
    const clientSecret = config.clientSecret;
    
    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Spotify credentials are missing in server configuration' })
      };
    }
    
    // Encode credentials in Base64 for authentication
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // Make request to Spotify API to refresh the token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error in Spotify response:', data);
      console.error('Using client ID starting with:', clientId.substring(0, 5));
      console.error('Using refresh token starting with:', refresh_token.substring(0, 5));
      
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: data.error_description || 'Error refreshing access token',
          details: data
        })
      };
    }
    
    // Return the new access token to the client
    return {
      access_token: data.access_token,
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