'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

const AdsMain = () => {
    const [showMainAds, setShowMainAds] = useState(process.env.NEXT_PUBLIC_ENABLE_ADS === 'true')
    const closeAds = () => setShowMainAds(false)

    if (!showMainAds) return null

    return (
        <aside
            className={`z-10 relative bg-gray-400 w-full max-w-[40em] transition-all duration-300 ${
                showMainAds
                    ? 'h-[10em] opacity-100'
                    : 'h-0 opacity-0'
            }`}
            role="complementary"
            aria-label="Publicidad"
        >
            <button
                onClick={closeAds}
                className={`absolute top-0 right-[1em] -translate-y-[40%] bg-white border-[0.2em] border-gray-400 rounded-full h-[1.2em] w-[1.2em] grid place-items-center transition-all duration-300 hover:scale-110 hover:-translate-y-[40%] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                    showMainAds ? 'grid' : 'hidden'
                }`}
                aria-label="Cerrar publicidad"
                type="button"
            >
                <X className="text-gray-400 h-[0.7em] w-[0.7em]" strokeWidth={3} aria-hidden="true" />
            </button>

            {/* Contenedor para el anuncio real */}
            <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                <span className="sr-only">Espacio publicitario</span>
                {/* Aquí se insertaría el contenido del anuncio real */}
            </div>
        </aside>
    )
}

export default AdsMain
