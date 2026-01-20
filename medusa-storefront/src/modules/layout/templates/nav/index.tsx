import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-20 mx-auto bg-white transition-colors duration-200">
        <nav className="content-container flex items-center justify-between w-full h-full text-taupe">
          {/* Left: Logo */}
          <div className="flex items-center h-full flex-1 basis-0">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <Image
                src="/logo-kokoro.svg"
                alt="Kokoro no Kami"
                width={180}
                height={52}
                className="h-[52px] w-auto object-contain"
                priority
              />
            </LocalizedClientLink>
          </div>

          {/* Center: Editorial Navigation */}
          <div className="hidden large:flex items-center justify-center gap-x-12 h-full font-serif text-sm uppercase tracking-widest flex-1 basis-0">
            <LocalizedClientLink href="/store" className="hover:text-khaki transition-colors">
              Joyería
            </LocalizedClientLink>
            <LocalizedClientLink href="/collections" className="hover:text-khaki transition-colors">
              Colecciones
            </LocalizedClientLink>
            <LocalizedClientLink href="/about" className="hover:text-khaki transition-colors">
              Historia
            </LocalizedClientLink>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {/* Account Icon */}
              <LocalizedClientLink
                className="hover:text-khaki transition-colors"
                href="/account"
                data-testid="nav-account-link"
              >
                <span className="sr-only">Cuenta</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </LocalizedClientLink>
            </div>
            {/* Cart Icon */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-khaki transition-colors flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <span className="text-xs align-top">(0)</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            {/* Mobile Menu Trigger (replaces SideMenu for mobile but keeping it simple for now, relying on responsive hidden) */}
            <div className="large:hidden">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
