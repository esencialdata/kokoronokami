const envBackendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL

const normalizedBackendUrl = envBackendUrl?.replace(/\/$/, "")

export const toAbsoluteImageUrl = (url?: string | null): string | undefined => {
  if (!url) {
    return undefined
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  if (url.startsWith("//")) {
    return `https:${url}`
  }

  if (!normalizedBackendUrl) {
    return url
  }

  return `${normalizedBackendUrl}/${url.replace(/^\//, "")}`
}
