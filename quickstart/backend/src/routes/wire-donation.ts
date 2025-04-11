import crypto from 'crypto';
import { getAccessToken } from '../utils/access-token';
import type { Request, Response } from 'express';
import { getEndaomentUrls } from '../utils/endaoment-urls';

export async function getWireInstructions(req: Request, res: Response) {
  // For more details about the data contract of the API, see the API reference:
  // https://api.dev.endaoment.org/oas#/Donation%20Pledges/DonationPledgesController_getDomesticPledgeDetails
  // https://api.dev.endaoment.org/oas#/Donation%20Pledges/DonationPledgesController_getInternationalPledgeDetails
  const wireInstructionsResponse = await fetch(
    // For domestic wire instructions
    `${getEndaomentUrls().api}/v1/donation-pledges/wire/details/domestic`,
    // For international wire instructions
    // `${getEndaomentUrls().api}/v1/donation-pledges/wire/details/international`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        //   This does not need any authentication since this is public information
      },
    }
  );

  const wireInstructions = await wireInstructionsResponse.json();

  res.status(200);
  res.json(wireInstructions);
  res.end();
}

export async function wireDonation(req: Request, res: Response) {
  const amount = req.body['amount'];
  const receivingFundId = req.body['fundId'];

  if (!amount || !receivingFundId) {
    res.status(400);
    res.json({ error: 'Missing amount or fundId' });
    res.end();
    return;
  }

  const token = getAccessToken(req);

  const idempotencyKey = crypto.randomUUID();
  const pledgedAmountMicroDollars = (BigInt(amount) * 1000000n).toString();

  const donationRequest = await fetch(
    `${getEndaomentUrls().api}/v1/donation-pledges/wire`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass the user's token in the Authorization header
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pledgedAmountMicroDollars,
        receivingFundId,
        idempotencyKey,
      }),
    }
  );

  const donation = await donationRequest.json();

  res.status(200);
  res.json(donation);
  res.end();
}
