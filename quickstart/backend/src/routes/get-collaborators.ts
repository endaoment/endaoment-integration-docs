import type { Request, Response } from 'express'
import { getAccessToken } from '../utils/access-token'
import { getCollaboratorsForFund, CollaboratorListingDto } from '../utils/get-collaborators'

export const getCollaborators = async (req: Request, res: Response) => {
  const fundId = req.query['fundId'] as string // Changed from req.params['id'] to req.query['fundId']

  if (!fundId) {
    res.status(400).json({ message: 'Missing fundId in request query parameters' }) // Updated error message
    return
  }

  const token = getAccessToken(req)
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: Access token is missing or invalid' })
    return
  }

  try {
    console.log(`Attempting to fetch collaborators for fund ${fundId}`)
    const collaborators: CollaboratorListingDto[] = await getCollaboratorsForFund(fundId, token)
    console.log('Successfully fetched collaborators', collaborators)
    res.status(200).json(collaborators)
  } catch (error) {
    console.error('Error fetching collaborators:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    res.status(500).json({ message: 'Failed to fetch collaborators', error: message })
  }
}
