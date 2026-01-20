import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@medusajs/ui"

type EditorialSplitProps = {
    mediaImage: string
    eyebrow: string
    body: string
    ctaLabel: string
    ctaHref: string
    reverse?: boolean
}

const EditorialSplitSection: React.FC<EditorialSplitProps> = ({
    mediaImage,
    eyebrow,
    body,
    ctaLabel,
    ctaHref,
    reverse = false,
}) => {
    return (
        <section className="w-full bg-white py-24 small:py-32">
            <div className="content-container flex flex-col small:grid small:grid-cols-12 gap-y-12 small:gap-x-12 items-center">
                {/* Image Column */}
                <div
                    className={clx("w-full h-full relative small:col-span-8", {
                        "order-last": reverse,
                    })}
                >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] shadow-sm">
                        <Image
                            src={mediaImage}
                            alt={eyebrow}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 70vw"
                        />
                    </div>
                </div>

                {/* Text Column */}
                <div className="w-full flex flex-col items-center justify-center text-center small:col-span-4 small:px-6">

                    {/* Eyebrow */}
                    <Text className="text-[12px] uppercase tracking-[0.18em] text-[#A07C4B] mb-6 font-medium">
                        {eyebrow}
                    </Text>

                    {/* Body */}
                    <Text
                        className="font-serif text-[16px] leading-[1.8] text-[#6B5B4A] mb-8 max-w-[380px]"
                        style={{ fontFamily: "Playfair Display, serif" }}
                    >
                        {body}
                    </Text>

                    {/* CTA */}
                    <LocalizedClientLink
                        href={ctaHref}
                        className="group relative inline-block text-[14px] text-[#887457] hover:text-[#5e4b35] transition-colors duration-200 uppercase tracking-widest font-sans"
                    >
                        <span className="relative z-10 border-b border-[#887457] pb-1 group-hover:border-[#5e4b35] transition-colors duration-200">
                            {ctaLabel}
                        </span>
                    </LocalizedClientLink>
                </div>
            </div>
        </section>
    )
}

export default EditorialSplitSection
