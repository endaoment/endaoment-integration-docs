import { Request } from 'express';

export type NdaoTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
};

export const ACCESS_TOKEN_NAME = 'ndao_token';

export const getAccessToken = (req: Request): string => {
  const tokenCookie: NdaoTokenResponse = req.cookies[ACCESS_TOKEN_NAME];

  if (!tokenCookie) throw new Error('No access token found in cookies');

  return tokenCookie.access_token;
};
