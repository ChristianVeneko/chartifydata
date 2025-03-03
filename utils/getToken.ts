export async function getToken(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<any> {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });
    
    return await response.json();
  }
  
  // Nota: La función getRefreshToken ha sido removida para evitar duplicación
  // con la implementación en utils/useAuth.js
  