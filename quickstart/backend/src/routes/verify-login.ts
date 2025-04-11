import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ACCESS_TOKEN_NAME, NdaoTokenResponse } from '../utils/access-token';
import { getEndaomentUrls } from '../utils/endaoment-urls';
import { getEnvOrThrow } from '../utils/env';

export const verifyLogin = async (req: Request, res: Response) => {
  const stateFromUrl = req.query['state'];
  const code = req.query['code'];
  if (
    !stateFromUrl ||
    !code ||
    typeof stateFromUrl !== 'string' ||
    typeof code !== 'string'
  ) {
    res.status(400);
    res.send('Missing state or code');
    res.end();
    return;
  }

  const exportedVariables = JSON.parse(
    fs.readFileSync(
      path.join(
        import.meta.dirname,
        '../../login-states/',
        `${stateFromUrl}-exportedVariables.json`
      ),
      'utf8'
    )
  );

  const staticUrl = `${getEndaomentUrls().auth}/token`;
  const formData = new URLSearchParams();
  formData.append('grant_type', 'authorization_code');
  formData.append('code', code);
  formData.append('code_verifier', exportedVariables.codeVerifier);
  formData.append('redirect_uri', getEnvOrThrow('ENDAOMENT_REDIRECT_URI'));

  const tokenResponse = await fetch(staticUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.ENDAOMENT_CLIENT_ID}:${process.env.ENDAOMENT_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: formData,
  });
  const tokenResponseJson: NdaoTokenResponse = await tokenResponse.json();

  /** Example response:
   * {
      "access_token": "JCUzUT4ZpJ6m7TC27nQfP7v1q2F8Xym34Bp3w4Pk5RXrElIOJxsLCOHZfyFDHh9IolH51GlUm4w9s3mJdFHmSbAAdHoqnfnEjAt8l8xlQciuuIYT5D1JlIgwtrTbejiWoRtgxyKCL4ssJWfh54JzDQDhhVp6mZLYwxzAFyVd8R6QRlYE9zDTKZLae0hknB8YvAq4mvNUmQYUCEgkSOX4bMgmpswni9iFsW4wqWXVWEGH3ZwuuJ4IpAFQ1tiJBWQTJx9BRwPnP13bJlZj3NIhhsSwDl6bCfZMi9YwuUwYv5pZFgBplHKJN0hwmUABHmYzY8TNljZkGpApOcnU81kCsGFwArBwLfvdTNHfsQOXE4jG9GiDIoTN0wrE9GCh16Wss7yYm9EXmHy7g8uWfzlCXb5ReoG5Ul3AQ0l7JydRWF1qUsGW9RuhajSJw7JV3BsoZmK51uiwqVlXah19siLbbxtsBDHTPT2LuvCoFzcJNcmDBqioVtV03XiEMEDRnxyyYYlPe1EbKUNz6gCvbZgE3NSoHdsZPp3IZP0qzYJCWLWSCqKanNnimXaUcbdNYgOdaROzT3lXOy0ZXphXicXWi5g2sjhRWABUq1niO8ZPbLlJ4l6R1L0C5uPSrBBYnrjAnfUs2vdmFYrQQXrCCqVu1VTqKfUy7J5lmt8xYMhyEOzmtSL9OODJue1YBUtmgvom19lPqfbJzvBAyhWxY8vmGA9yiEwhpZgJctUjF7I6WOKPAFWKbe9w3Vgjd17llPkrO4LnMdrpgY4KDq6exLn9DKwQcJMkpylTtPPFUYJghvVYwDLibGZYiG7CeR4SPv5To7XAjo",
      "token_type": "Bearer",
      "expires_in": 3600,
      "id_token": "Nbj6pYAJCTkaSpwQN9TOUhNqXL5fWDi0FdogLwSbeL1aoMQD62FYS8AIPUJriTzo8YSI3UIwlcsEDSNqztnnuFwPOf3b0GtVNXHMVjCDdxD75pJF2VfpUDMgu21lKCQc4Qyr0rbmxDk1DukOkbkqNHHWHeXlDpSQh4I1Vl8cLWay0MO5hyrMTIcxEmmFbhl65eGE5Rrv1cTvSmRJva6sHZOi2D2abde6xBbhvHAc7mvVLZTuqCXEVGR56VVOg6FGRgwrGF4xmw0YTWkypQ4TUPi4AvTScJxi3OhviY2Idt9HThFbHqWU3DysP984CO3bfw4KO3jRc6CCyY0Oye9rQvuqPHqxwvrpFvBsBM52wP0kMU1HZr8zZU98AqvlfRu8Sxrc4mcj5VYMLxesxB525XfedUJbHhRhAy1LoyEbWveoCTibGFziHMvOwFcvXqoSQXPWqlKHHKeUSqPUrJcaufbMmDXBP5ZeS3IPDFlBZCfcAl6983mcO5slfj54kJ9j6a7W4JcOQeGGV4ik9cwvI5KmOQuAIdJby0Uh9LMSOeBRThQGIPBYo3uwB212sRtodQAA0LM3YYybuf3R3bQ4hZNN19iq9K4TPHlukV3Ji9WCOH3yn91m0MHhvepxqswwntV5vcatFCB8dx68HuqvEwZzBg5OClzeXnQOpYibWNmi2pd0xZE8LBEdpNwjV41ys8YEM2NEpNUIt4HAlt72RqRdIkDhtuK1lTN8CSkYIxzTuKE6SoqBfky7YRRWKxuhD7",
      "refresh_token": "eGGV4ik9cwvI5KmOQuAIdJby0Uh9LMSOeBRThQGIPBY",
      "scope": "accounts transactions profile"
    }
   */

  res.cookie(ACCESS_TOKEN_NAME, tokenResponseJson, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.redirect(getEnvOrThrow('FRONTEND_URL'));
  res.end();
};
