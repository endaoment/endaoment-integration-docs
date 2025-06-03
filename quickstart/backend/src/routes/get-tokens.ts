import type { Request, Response } from 'express'
import { getEndaomentUrls } from '../utils/endaoment-urls'

export async function getTokens(req: Request, res: Response) {
  try {
    // For more details about the data contract of the API, see the API reference:
    // https://docs.endaoment.org/developers/api/tokens/get-tokens-supported-by-endaoment
    const tokensResponse = await fetch(`${getEndaomentUrls().api}/v2/tokens`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const tokens = await tokensResponse.json()

    res.status(200)
    res.json(tokens)
    res.end()
  } catch (error) {
    console.error(error)
    res.status(500)
    res.json({ error: 'An error occurred while fetching tokens' })
    res.end()
  }
}
