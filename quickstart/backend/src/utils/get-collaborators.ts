import { getEndaomentUrls } from './endaoment-urls'

export interface CollaboratorListingDto {
  id: string
  email: string
  firstName: string
  lastName: string
  collaboratorUserId: string
  fundId: string
}

/**
 * Fetches collaborators for a given fund.
 * @param fundId The ID of the fund.
 * @param token The access token for authentication.
 * @returns A promise that resolves to an array of collaborator DTOs.
 */
export async function getCollaboratorsForFund(fundId: string, token: string): Promise<CollaboratorListingDto[]> {
  const apiUrl = `${getEndaomentUrls().api}/v1/funds/${fundId}/collaborators`

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Failed to fetch collaborators', response.status, errorData)
    throw new Error(`Failed to fetch collaborators: ${response.statusText}`)
  }

  return response.json() as Promise<CollaboratorListingDto[]>
}
