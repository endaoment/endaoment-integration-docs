import type { Request, Response } from 'express';
import { getAccessToken } from '../utils/access-token';
import { getEndaomentUrls } from '../utils/endaoment-urls';

export const createDaf = async (req: Request, res: Response) => {
  const newFundName = req.body['name'] as string;
  const newFundDescription = req.body['description'] as string;
  const newFundAdvisor = req.body['fundAdvisor'] as string;

  if (!newFundName || !newFundDescription || !newFundAdvisor) {
    res.status(400);
    res.end();
    return;
  }

  const token = getAccessToken(req);

  // For more details about the data contract of the API, see the API reference:
  // https://api.dev.endaoment.org/oas#/Funds/FundsController_processFund
  const fundCreationResponse = await fetch(
    `${getEndaomentUrls().api}/v1/funds`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass the user's token in the Authorization header
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fundInput: {
          name: newFundName,
          description: newFundDescription,
          advisor: newFundAdvisor,
        },
      }),
    }
  );

  res.status(200);
  res.json(await fundCreationResponse.json());
  res.end();
};
