/**
 * Values in VITE_* variables are embedded in the client bundle. Keep this
 * limited to public URLs and never place credentials or private keys here.
 */
export interface PublicEnvironmentConfig {
  readonly contactEndpoint: string | undefined
  readonly cmsApiBaseUrl: string | undefined
  readonly heroVideoUrl: string | undefined
  readonly demoMode: boolean
}

function readOptionalPublicValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

export const environment: Readonly<PublicEnvironmentConfig> = Object.freeze({
  contactEndpoint: readOptionalPublicValue(import.meta.env.VITE_CONTACT_ENDPOINT),
  cmsApiBaseUrl: readOptionalPublicValue(import.meta.env.VITE_CMS_API_BASE_URL),
  heroVideoUrl: readOptionalPublicValue(import.meta.env.VITE_HERO_VIDEO_URL),
  demoMode: import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === "true",
})
