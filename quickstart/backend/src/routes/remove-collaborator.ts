import type { Request, Response } from 'express'
import { getAccessToken } from '../utils/access-token'
import { removeCollaboratorFromFund } from '../utils/remove-collaborator'

export const removeCollaborator = async (req: Request, res: Response) => {
  const fundId = req.params['fundId'] as string
  const userId = req.params['userId'] as string

  if (!fundId || !userId) {
    res.status(400).json({ message: 'Missing fundId or userId in request parameters' })
    return
  }

  const token = getAccessToken(req)
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: Access token is missing or invalid' })
    return
  }

  try {
    console.log(`Attempting to remove collaborator ${userId} from fund ${fundId}`)
    const removalResponse = await removeCollaboratorFromFund(fundId, token, userId)
    console.log('Successfully removed collaborator', removalResponse)
    res.status(removalResponse.status).json(removalResponse)
  } catch (error) {
    console.error('Error removing collaborator:', error)
    // Check if error is an instance of Error to safely access message property
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    res.status(500).json({ message: 'Failed to remove collaborator', error: message })
  }
}
