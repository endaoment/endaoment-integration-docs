import { EnvironmentVariables } from './env'
import { getEndaomentUrls } from './endaoment-urls'
import { getWealthAdvisorForFund } from './get-advisor-for-fund'

interface CreateFundCollaboratorBody {
  /**
   * Company name of the collaborator
   */
  companyName: string

  /**
   * User id of the advisor
   */
  userId: string
}

/**
 * Adds a collaborator to a fund
 * @param fundId The ID of the fund
 * @param token The access token for authentication
 * @returns The response from the API
 */
export async function addCollaboratorToFund(fundId: string, token: string, overrideWealthAdvisorId?: string) {
  const userId = overrideWealthAdvisorId ?? (await getWealthAdvisorForFund(fundId)).endaomentId

  if (!userId) {
    throw new Error('No Endaoment ID found for wealth advisor')
  }

  const apiKey = EnvironmentVariables.ENDAOMENT_API_KEY()
  if (!apiKey) {
    throw new Error(
      'No Endaoment API key found on your environment variables. Please set the ENDAOMENT_API_KEY environment ' +
        'variable, with the API Key provided by Endaoment. This API Key is different from your client ID and secret ' +
        'used to issue access tokens.',
    )
  }

  const body: CreateFundCollaboratorBody = {
    companyName: 'Endaoment Wealth',
    userId,
  }

  // To see the full API documentation and data contract, visit https://api.dev.endaoment.org/oas#/Funds/FundsController_addFundCollaboratorTrust
  const addCollaboratorResponse = await fetch(`${getEndaomentUrls().api}/v1/funds/${fundId}/collaborators/trust`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  const response = await addCollaboratorResponse.json()
  if (!addCollaboratorResponse.ok) {
    console.error('Failed to add collaborator to fund', response)
  }

  console.log('Collaborator added to fund', response)
  return response
}
