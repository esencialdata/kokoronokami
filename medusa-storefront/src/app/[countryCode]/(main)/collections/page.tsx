import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listCollections } from "@lib/data/collections"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
    title: "Colecciones",
    description: "Explora todas nuestras colecciones.",
}

export default async function CollectionsPage() {
    const { collections } = await listCollections({
        limit: "100",
    })

    if (!collections) {
        notFound()
    }

    return (
        <div className="py-6 content-container">
            <div className="mb-8 text-2xl-semi">
                <h1>Colecciones</h1>
            </div>
            <ul className="grid grid-cols-1 gap-6 small:grid-cols-3">
                {collections.map((c: HttpTypes.StoreCollection) => (
                    <li key={c.id}>
                        <LocalizedClientLink
                            href={`/collections/${c.handle}`}
                            className="group"
                        >
                            <div className="p-8 bg-ui-bg-base border border-ui-border-base rounded-rounded shadow-none hover:shadow-md transition-shadow text-ui-fg-base h-full flex items-center justify-center text-center">
                                <h3 className="text-xl-semi">{c.title}</h3>
                            </div>
                        </LocalizedClientLink>
                    </li>
                ))}
            </ul>
        </div>
    )
}
