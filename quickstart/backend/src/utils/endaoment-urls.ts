import { EnvironmentVariables } from './env'

export const getEndaomentUrls = () => {
  const env = EnvironmentVariables.ENDAOMENT_ENVIRONMENT()

  if (env === 'production') {
    return {
      auth: 'https://auth.endaoment.org',
      api: 'https://api.endaoment.org',
    }
  }

  return {
    auth: 'https://auth.dev.endaoment.org',
    api: 'https://api.dev.endaoment.org',
  }
}
