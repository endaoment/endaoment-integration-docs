export const getEnvOrThrow = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

export class EnvironmentVariables {
  static ENDAOMENT_CLIENT_ID = () => getEnvOrThrow('ENDAOMENT_CLIENT_ID')
  static ENDAOMENT_CLIENT_SECRET = () => getEnvOrThrow('ENDAOMENT_CLIENT_SECRET')
  static ENDAOMENT_REDIRECT_URI = () => getEnvOrThrow('ENDAOMENT_REDIRECT_URI')
  static FRONTEND_URL = () => getEnvOrThrow('FRONTEND_URL')
  static PORT = () => process.env.PORT || 5454
  static ENDAOMENT_ENVIRONMENT = () => getEnvOrThrow('ENDAOMENT_ENVIRONMENT')
  static ENDAOMENT_WEALTH_ADVISOR_ID = (): string | undefined => process.env['ENDAOMENT_WEALTH_ADVISOR_ID']
  static ENDAOMENT_API_KEY = (): string | undefined => process.env['ENDAOMENT_API_KEY']
}
