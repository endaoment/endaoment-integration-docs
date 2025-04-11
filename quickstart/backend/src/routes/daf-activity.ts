import type { Request, Response } from 'express';
import { getAccessToken } from '../utils/access-token';
import { getEndaomentUrls } from '../utils/endaoment-urls';

export async function getDafActivity(req: Request, res: Response) {
  const { fundId } = req.query;

  if (!fundId || typeof fundId !== 'string') {
    res.status(400);
    res.json({ error: 'Fund ID is required' });
    res.end();
    return;
  }

  const token = getAccessToken(req);

  try {
    // For more details about the data contract of the API, see the API reference:
    // https://api.dev.endaoment.org/oas#/Activity/ActivityController_getRecentFundActivity
    const dafActivityResponse = await fetch(
      `${getEndaomentUrls().api}/v1/activity/fund/${fundId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Pass the user's token in the Authorization header
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const dafActivity = await dafActivityResponse.json();

    if (dafActivity.statusCode === 500) {
      res.status(500);
      res.json({ error: dafActivity.message });
      res.end();
      return;
    }

    res.status(200);
    res.json(dafActivity);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error });
    res.end();
  }
}
