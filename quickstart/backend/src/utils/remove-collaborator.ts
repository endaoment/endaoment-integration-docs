import { getEndaomentUrls } from './endaoment-urls'
import { getWealthAdvisorForFund } from './get-advisor-for-fund'

/**
 * Removes a collaborator from a fund
 * @param fundId The ID of the fund
 * @param token The access token for authentication
 * @param userId The ID of the user to remove
 * @returns The response from the API
 */
export async function removeCollaboratorFromFund(fundId: string, token: string, userIdToRemove?: string) {
  const userId = userIdToRemove ?? (await getWealthAdvisorForFund(fundId)).endaomentId

  if (!userId) {
    throw new Error('No Endaoment ID found for wealth advisor to remove')
  }

  // To see the full API documentation and data contract, visit https://api.dev.endaoment.org/oas#/Funds/FundsController_deleteFundCollaborator
  const removeCollaboratorResponse = await fetch(
    `${getEndaomentUrls().api}/v1/funds/${fundId}/collaborators/${userId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!removeCollaboratorResponse.ok) {
    const response = await removeCollaboratorResponse.json()
    console.error('Failed to remove collaborator from fund', response)
    throw new Error('Failed to remove collaborator from fund')
  }

  console.log('Collaborator removed from fund')
  // For a DELETE request, there might not be a JSON body in the success response,
  // or it might be an empty object or just a status.
  // We'll return the status text or an indication of success.
  return { status: removeCollaboratorResponse.status, statusText: removeCollaboratorResponse.statusText }
}
