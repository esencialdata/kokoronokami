import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import EditorialSplitSection from "@modules/home/components/editorial-split"
import EditorialHighlight from "@modules/home/components/editorial-highlight"
import EditorialProductGrid from "@modules/home/components/editorial-product-grid"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Esencial Commerce",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  const { response: { products } } = await listProducts({
    countryCode,
    queryParams: { limit: 4 }
  })

  console.log(`[Home] Region: ${region?.id}, Collections: ${collections?.length}`)

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />

      {/* 1. Carousel (Nuevas Llegadas) */}
      <div className="py-12 border-b border-[#F0F0F0]">
        <div className="content-container mb-6">
          <h2 className="text-xl font-serif text-[#6B5B4A]">Nuevas Llegadas</h2>
        </div>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>

      {/* 2. Narrative Section (Nuestro Proceso) */}
      <EditorialSplitSection
        mediaImage="/nuestro-proceso.png"
        eyebrow="Nuestro Proceso"
        body="Cada pieza nace de una hoja de papel intacta. Sin cortes, solo pliegues precisos que dan forma a una visión. Es un diálogo silencioso entre el artesano y la materia."
        ctaLabel="Leer Historia"
        ctaHref="/about"
        reverse={false}
      />

      {/* 4. The Origami Series (Editorial Highlight) */}
      <div className="mb-24 small:mb-32">
        <EditorialHighlight
          mediaImage="/coleccion-papeleria.jpg"
          collectionName="The Origami Series"
          price="Desde $450 MXN"
          description="Una exploración de la geometría sagrada a través del papel. Descubre piezas que capturan la luz y la transforman en arte portable."
          ctaHref="/store"
        />
      </div>

      {/* 5. Curated Selection (Editorial Product Grid) */}
      <EditorialProductGrid
        products={products}
        region={region}
        sideImage="/La-Esencia-del-Detalle.png"
        sideEyebrow="Curated Selection"
        sideTitle="La Esencia del Detalle"
        sideCtaLabel="Ver Colección"
        sideCtaHref="/collections/destacados"
      />
    </>
  )
}
