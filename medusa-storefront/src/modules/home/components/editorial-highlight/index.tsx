import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@medusajs/ui"

type EditorialHighlightProps = {
    mediaImage: string
    collectionName: string
    price?: string
    description: string
    ctaLabel?: string
    ctaHref: string
}

const EditorialHighlight: React.FC<EditorialHighlightProps> = ({
    mediaImage,
    collectionName,
    price,
    description,
    ctaLabel = "Explorar",
    ctaHref,
}) => {
    return (
        <section className="relative w-full h-[60vh] small:h-[70vh] overflow-hidden">
            {/* Background Image */}
            <Image
                src={mediaImage}
                alt={collectionName}
                fill
                className="object-cover"
                sizes="100vw"
                priority={false}
            />

            {/* Floating Card */}
            <div className="absolute inset-0 content-container flex items-end small:items-center justify-center small:justify-end pb-8 small:pb-0 pointer-events-none">
                <div className="w-[340px] bg-[#FAF8F5] p-8 md:p-10 shadow-sm pointer-events-auto transition-transform hover:-translate-y-1 duration-500 ease-out">
                    <div className="flex flex-col gap-y-4">
                        <div className="flex justify-between items-baseline border-b border-[#E5E5E5] pb-3 mb-1">
                            <Text className="font-serif uppercase tracking-[0.1em] text-sm text-[#A07C4B]">
                                {collectionName}
                            </Text>
                            {price && (
                                <Text className="font-sans text-xs text-[#6B5B4A]/80">
                                    {price}
                                </Text>
                            )}
                        </div>

                        <Text className="font-serif text-[15px] leading-relaxed text-[#5A5A5A] italic">
                            {description}
                        </Text>

                        <div className="pt-4 flex justify-end">
                            <LocalizedClientLink
                                href={ctaHref}
                                className="group flex items-center gap-x-2 text-[#887457] hover:text-[#685038] transition-colors"
                            >
                                <span className="text-xs uppercase tracking-widest font-medium border-b border-transparent group-hover:border-[#685038] transition-all">
                                    {ctaLabel}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </LocalizedClientLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EditorialHighlight
