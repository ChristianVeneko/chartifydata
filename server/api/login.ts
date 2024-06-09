// server/api/login.ts

import { sendRedirect } from 'h3';
import { generateRandomString } from '~/utils/generateRandomString';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email user-top-read';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    scope,
    redirect_uri: config.redirectUri,
    state,
  });
  return sendRedirect(event, `https://accounts.spotify.com/authorize?${params.toString()}`, 302);
});
