import { EnvironmentVariables } from './env'
import { getEndaomentUrls } from './endaoment-urls'

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

interface WealthAdvisor {
  /**
   * ID of the advisor in the Endaoment system
   */
  endaomentId: string | undefined

  /**
   * ID of the advisor in my system
   */
  id: string
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

const getWealthAdvisorForFund = async (fundId: string): Promise<WealthAdvisor> => {
  // This function simulates fetching who is the wealth advisor for a fund
  // In a real application, this would be a database query or an API call to
  // an external service your platform uses to store advisor information for a given
  // fund or client.
  return {
    // To properly simulate the flow, create a user at app.dev.endaoment.org and use their ID here. Make sure their
    // ID is different than the ID of the user that owns the fund "fundId".
    endaomentId: EnvironmentVariables.ENDAOMENT_WEALTH_ADVISOR_ID(),
    id: '123456',
  }
}
