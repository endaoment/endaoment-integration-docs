import { EnvironmentVariables } from './env'

export interface WealthAdvisor {
  /**
   * ID of the advisor in the Endaoment system
   */
  endaomentId: string | undefined

  /**
   * ID of the advisor in my system
   */
  id: string
}

export const getWealthAdvisorForFund = async (fundId: string): Promise<WealthAdvisor> => {
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
