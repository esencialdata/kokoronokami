import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

type EditorialProductGridProps = {
    products: HttpTypes.StoreProduct[]
    region: HttpTypes.StoreRegion
    sideImage: string
    sideEyebrow: string
    sideTitle: string
    sideCtaLabel: string
    sideCtaHref: string
}

const EditorialProductGrid: React.FC<EditorialProductGridProps> = ({
    products,
    region,
    sideImage,
    sideEyebrow,
    sideTitle,
    sideCtaLabel,
    sideCtaHref,
}) => {
    return (
        <section className="w-full bg-white">
            <div className="flex flex-col md:flex-row h-full">
                {/* Left Column: Product Grid */}
                <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-24 flex items-center justify-center">
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-12 w-full max-w-[600px]">
                        {products.slice(0, 4).map((product) => (
                            <li key={product.id}>
                                <ProductPreview product={product} region={region} isFeatured />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Column: Editorial Image */}
                <div className="w-full md:w-1/2 relative min-h-[600px] md:h-auto md:sticky md:top-0">
                    <div className="absolute inset-0">
                        <Image
                            src={sideImage}
                            alt={sideTitle}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Subtle Overlay */}
                        <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 text-white">
                        <Text className="text-xs uppercase tracking-[0.2em] mb-4 opacity-90 font-medium">
                            {sideEyebrow}
                        </Text>
                        <Text className="font-serif text-3xl md:text-4xl italic mb-8 max-w-[300px] leading-tight">
                            {sideTitle}
                        </Text>
                        <LocalizedClientLink
                            href={sideCtaHref}
                            className="inline-block border-b border-white/60 pb-1 text-sm uppercase tracking-widest hover:border-white transition-colors"
                        >
                            {sideCtaLabel}
                        </LocalizedClientLink>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EditorialProductGrid
