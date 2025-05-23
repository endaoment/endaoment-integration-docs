import type { Request, Response } from 'express'
import { getAccessToken } from '../utils/access-token'
import { getEndaomentUrls } from '../utils/endaoment-urls'

export async function getDafs(req: Request, res: Response) {
  const token = getAccessToken(req)

  try {
    // For more details about the data contract of the API, see the API reference:
    // https://docs.endaoment.org/developers/api/funds/get-all-funds-managed-by-the-authenticated-user
    const usersDafListResponse = await fetch(`${getEndaomentUrls().api}/v1/funds/mine`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Pass the user's token in the Authorization header
        Authorization: `Bearer ${token}`,
      },
    })
    const usersDafList = await usersDafListResponse.json()

    res.status(200)
    res.json(usersDafList)
    res.end()
  } catch (error) {
    console.error(error)
    res.status(500)
    res.json({ error: 'An error occurred while fetching DAFs' })
    res.end()
  }
}
