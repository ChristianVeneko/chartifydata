// server/api/refresh.ts

import { getRefreshToken } from '~/utils/getToken';
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const refreshToken = query.refresh_token as string;
  const config = useRuntimeConfig();

  const data = await getRefreshToken(config.clientId, config.clientSecret, refreshToken);

  return {
    access_token: data.access_token,
  };
});
