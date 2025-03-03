// server/api/callback.ts

import { getToken } from '~/utils/getToken';
import { getQuery, sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;
  const state = query.state as string;
  const error = query.error as string;
  const config = useRuntimeConfig();

  // Manejar errores de autenticación
  if (error) {
    console.error(`Error de autenticación: ${error}`);
    return sendRedirect(event, `${config.public.baseUrl}?error=${encodeURIComponent(error)}`, 302);
  }

  // Verificar que tenemos el código necesario
  if (!code) {
    console.error('No se recibió código de autorización');
    return sendRedirect(event, `${config.public.baseUrl}?error=no_code`, 302);
  }

  try {
    const data = await getToken(config.clientId, config.clientSecret, code, config.redirectUri);
    
    if (data.error) {
      console.error(`Error al obtener token: ${data.error}`);
      return sendRedirect(event, `${config.public.baseUrl}?error=${encodeURIComponent(data.error)}`, 302);
    }

    const redirectUrl = `${config.public.baseUrl}/auth?access_token=${data.access_token}&refresh_token=${data.refresh_token}&expires_in=${data.expires_in}`;
    return sendRedirect(event, redirectUrl, 302);
  } catch (error) {
    console.error('Error en el proceso de autenticación:', error);
    return sendRedirect(event, `${config.public.baseUrl}?error=authentication_failed`, 302);
  }
});
