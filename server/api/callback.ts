// server/api/callback.ts

import { getToken } from '~/utils/getToken';
import { getQuery, sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;
  const state = query.state as string;
  const config = useRuntimeConfig();

  const data = await getToken(config.clientId, config.clientSecret, code, config.redirectUri);

  const redirectUrl = `${config.public.baseUrl}/auth?access_token=${data.access_token}&refresh_token=${data.refresh_token}`;

  return sendRedirect(event, redirectUrl, 302);
});
