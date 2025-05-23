import type { Request, Response } from 'express'
import { getAccessToken } from '../utils/access-token'
import { getEndaomentUrls } from '../utils/endaoment-urls'

export async function grant(req: Request, res: Response) {
  const amount = req.body['amount']
  const originFundId = req.body['fundId']
  const destinationOrgId = req.body['orgId']
  const purpose = req.body['purpose']

  if (!amount || !originFundId || !destinationOrgId || !purpose) {
    // Return an error response if any of the required fields are missing
    res.status(400)
    res.json({ error: 'Missing required fields' })
    res.end()
    return
  }

  const token = getAccessToken(req)

  const idempotencyKey = crypto.randomUUID()
  const requestedAmount = (BigInt(amount) * 1000000n).toString()

  // For more details about the data contract of the API, see the API reference:
  // https://docs.endaoment.org/developers/api/transfers/create-an-async-grant-request
  const grantRequest = await fetch(`${getEndaomentUrls().api}/v1/transfers/async-grants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Pass the user's token in the Authorization header
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      originFundId,
      destinationOrgId,
      requestedAmount,
      purpose,
      idempotencyKey,
    }),
  })

  const grantResult = await grantRequest.json()
  res.status(200)
  res.json(grantResult)
  res.end()
}
