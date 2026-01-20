import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="h-[90vh] w-full border-b border-ui-border-base relative overflow-hidden bg-ui-bg-subtle">
      {/* Background Image with Grain */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_origami.png"
          alt="Editorial Perfume Jewelry"
          fill
          className="object-cover"
          priority
        />
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* Content Overlay (Right Aligned) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-end text-right p-8 small:p-32">
        <div className="max-w-xl animate-fade-in-right">
          <h1 className="text-4xl small:text-6xl font-sans font-bold uppercase text-white tracking-wider mb-4 drop-shadow-md">
            Plegamos papel. Creamos piezas eternas.
          </h1>
          <h2 className="text-xl small:text-3xl font-serif italic text-white/90 mb-10 font-light drop-shadow-md">
            Joyería, papelería y empaques con alma de origami.
          </h2>
          <LocalizedClientLink
            href="/store"
            className="inline-block text-sm uppercase tracking-[0.2em] text-white border-b border-white pb-1 hover:text-khaki hover:border-khaki transition-all duration-300"
          >
            Descubrir Colección
          </LocalizedClientLink>
        </div>
      </div>

      {/* Floating Promo Badge (Bottom Left) */}
      <div className="absolute bottom-10 left-10 z-20 animate-fade-in-top delay-500">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 bg-khaki rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
            <span className="text-white font-serif text-center text-[10px] leading-tight uppercase tracking-widest px-2">
              10%<br />de bienvenida
            </span>
          </div>
          {/* Close button mock */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-taupe text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
            ✕
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
