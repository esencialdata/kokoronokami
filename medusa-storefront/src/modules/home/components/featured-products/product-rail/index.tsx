import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  console.log(`[ProductRail] Collection: ${collection.title} (${collection.id})`)
  console.log(`[ProductRail] Products found: ${pricedProducts ? pricedProducts.length : 0}`)

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="flex w-full group">
          <ul className="flex gap-x-6 animate-marquee group-hover:paused min-w-full flex-shrink-0 px-3">
            {pricedProducts &&
              pricedProducts.map((product) => (
                <li key={product.id} className="min-w-[280px] w-[280px]">
                  <ProductPreview product={product} region={region} isFeatured />
                </li>
              ))}
          </ul>
          {/* Duplicate for seamless loop */}
          <ul className="flex gap-x-6 animate-marquee group-hover:paused min-w-full flex-shrink-0 px-3" aria-hidden="true">
            {pricedProducts &&
              pricedProducts.map((product) => (
                <li key={`dup-${product.id}`} className="min-w-[280px] w-[280px]">
                  <ProductPreview product={product} region={region} isFeatured />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
