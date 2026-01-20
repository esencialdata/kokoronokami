import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { Metadata } from "next"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">Página no encontrada</h1>
      <p className="text-small-regular text-ui-fg-base">
        La página que intentas acceder no existe.
      </p>
      <LocalizedClientLink
        href="/"
        className="mt-4 underline text-base-regular text-ui-fg-base"
      >
        Ir a la página principal
      </LocalizedClientLink>
    </div>
  )
}
