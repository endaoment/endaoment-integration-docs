import type { Request, Response } from 'express'
import { getAccessToken } from '../utils/access-token'
import { getEndaomentUrls } from '../utils/endaoment-urls'

export const createDaf = async (req: Request, res: Response) => {
  const newFundName = req.body['name'] as string
  const newFundDescription = req.body['description'] as string
  const newFundAdvisor = req.body['fundAdvisor'] as string

  if (!newFundName || !newFundDescription || !newFundAdvisor) {
    res.status(400)
    res.end()
    return
  }

  const token = getAccessToken(req)

  // For more details about the data contract of the API, see the API reference:
  // https://docs.endaoment.org/developers/api/funds/create-a-new-fund
  const fundCreationResponse = await fetch(`${getEndaomentUrls().api}/v1/funds`, {
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
  })

  const response = await fundCreationResponse.json()
  if (!fundCreationResponse.ok) {
    console.error('Failed to create fund', response)
    res.status(500)
    res.json(response)
    res.end()
    return
  }

  console.log('Fund creation response', response)

  res.status(200)
  res.json(response)
  res.end()
}
