const envBackendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL

const normalizedBackendUrl = envBackendUrl?.replace(/\/$/, "")
const backendOrigin = (() => {
  if (!normalizedBackendUrl) {
    return undefined
  }

  try {
    return new URL(normalizedBackendUrl).origin
  } catch {
    return undefined
  }
})()

const isLoopbackHost = (host: string) =>
  host === "127.0.0.1" || host === "localhost" || host === "::1"

export const toAbsoluteImageUrl = (url?: string | null): string | undefined => {
  if (!url) {
    return undefined
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (!backendOrigin) {
      return url
    }

    try {
      const parsed = new URL(url)

      // Rewrite local/loopback URLs saved in DB to the public backend URL.
      if (isLoopbackHost(parsed.hostname)) {
        return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`
      }
    } catch {
      return url
    }

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
