
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Nuestra Historia | Esencial Commerce",
    description: "Nacimos de una obsesión: convertir el papel en algo que se siente eterno.",
}

export default function AboutPage() {
    return (
        <div className="bg-[#FAF8F5] min-h-screen">
            <div className="content-container py-12 md:py-24">
                <div className="max-w-[800px] mx-auto">
                    <h1 className="font-serif text-4xl md:text-5xl text-[#6B5B4A] mb-12 text-center italic">
                        Nuestra Historia
                    </h1>

                    <div className="flex flex-col gap-y-10 text-[#5A5A5A] leading-relaxed text-lg font-light tracking-wide">
                        <p>
                            <span className="font-serif text-2xl text-[#6B5B4A] mr-2">N</span>
                            acimos de una obsesión: convertir el papel en algo que se siente eterno. En nuestro taller, el origami dejó de ser solo una técnica y se volvió un lenguaje. Un lenguaje para diseñar joyería ligera y precisa, crear papelería que se guarda como recuerdo y desarrollar empaques que no se tiran: se conservan.
                        </p>

                        <p>
                            Cada pieza parte de un mismo principio: la belleza está en el pliegue. En la paciencia de doblar, en la geometría que ordena, en la textura que atrapa la luz. Por eso trabajamos con procesos artesanales y acabados limpios, cuidando proporciones, cortes y detalles para que todo —desde una figura hasta un empaque— tenga intención y presencia.
                        </p>

                        <p>
                            Con el tiempo, esa visión se volvió un universo completo: joyería inspirada en formas origami, papelería elegante para momentos importantes y empaques diseñados como parte de la experiencia. No hacemos “cosas de papel”. Diseñamos objetos que cuentan una historia: la tuya y la nuestra, unidas por un gesto simple que transforma todo—un pliegue.
                        </p>
                    </div>

                    <div className="mt-20 border-t border-[#E5E5E5] pt-12 text-center">
                        <p className="font-serif italic text-[#A07C4B] text-xl">
                            "La belleza está en el pliegue."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
