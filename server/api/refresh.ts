// server/api/refresh.ts

import { getRefreshToken } from '~/utils/getToken';
import { getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const refreshToken = query.refresh_token as string;
  
  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Refresh token is required'
    });
  }
  
  const config = useRuntimeConfig();

  try {
    const data = await getRefreshToken(config.clientId, config.clientSecret, refreshToken);
    
    if (data.error) {
      console.error(`Error refreshing token: ${data.error}`);
      throw createError({
        statusCode: 401,
        statusMessage: data.error_description || 'Error refreshing token'
      });
    }

    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type
    };
  } catch (error) {
    console.error('Error in refresh token process:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during token refresh'
    });
  }
});
