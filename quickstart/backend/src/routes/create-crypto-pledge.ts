import type { Request, Response } from 'express'
import { getAccessToken } from '../utils/access-token'
import { getEndaomentUrls } from '../utils/endaoment-urls'

export async function createCryptoPledge(req: Request, res: Response) {
  const { tokenId, inputAmount, otcDonationTransactionHash, receivingFundId, receivingEntityType } = req.body

  if (!tokenId || !inputAmount || !otcDonationTransactionHash || !receivingFundId || !receivingEntityType) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  const token = getAccessToken(req)
  if (!token) {
    res.status(401).json({ message: 'User not authenticated' })
    return
  }

  const payload = {
    cryptoGiven: {
      tokenId: Number(tokenId),
      inputAmount: String(inputAmount),
    },
    otcDonationTransactionHash,
    receivingEntityType,
    receivingEntityId: receivingFundId,
  }

  try {
    // API Reference: https://api.dev.endaoment.org/oas#/Donation%20Pledges/DonationPledgesController_createCryptoPledge
    const apiResponse = await fetch(`${getEndaomentUrls().api}/v1/donation-pledges/crypto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const responseData = await apiResponse.json()

    if (!apiResponse.ok) {
      console.error('Failed to create crypto pledge on Endaoment API', responseData)
      res.status(apiResponse.status).json(responseData)
      return
    }

    console.log('Crypto pledge creation successful on Endaoment API', responseData)
    res.status(200).json(responseData)
  } catch (error) {
    console.error('Error calling Endaoment API for crypto pledge:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
