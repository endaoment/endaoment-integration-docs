import { EnvironmentVariables } from './env'

export const getEndaomentUrls = () => {
  const env = EnvironmentVariables.ENDAOMENT_ENVIRONMENT()

  if (env === 'production') {
    return {
      auth: 'https://auth.endaoment.org',
      api: 'https://api.endaoment.org',
    }
  }

  if (env === 'local') {
    return {
      auth: 'http://localhost:3000',
      api: 'http://localhost:3333',
    }
  }

  return {
    auth: 'https://auth.dev.endaoment.org',
    api: 'https://api.dev.endaoment.org',
  }
}
