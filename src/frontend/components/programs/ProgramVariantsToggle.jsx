'use client'

import { Award, BookCopy, BookOpen, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react'
import { Link } from 'next-view-transitions'
import { useState } from 'react'
import ProgramItemWrapper from './ProgramItemWrapper'

const ProgramVariantsToggle = ({ variants, currentProgramID }) => {
    const [showAll, setShowAll] = useState(false)

    if (!variants || variants.length <= 1) return null

    const variantsCount = variants.length
    const hasMore = variantsCount > 3

    const getBaseSlug = (slug) => {
        return slug.replace(/-\d+$/, '')
    }

    const getVariantDifferences = (variant) => {
        const differences = []

        if (variant.location) {
            differences.push({
                icon: <MapPin size={16} />,
                label: 'Ubicación',
                value: variant.location
            })
        }

        if (variant.modality) {
            differences.push({
                icon: <BookOpen size={16} />,
                label: 'Modalidad',
                value: variant.modality
            })
        }

        if (variant.accreditation && variant.accreditation !== 'sin acreditación') {
            differences.push({
                icon: <Award size={16} />,
                label: 'Acreditación',
                value: variant.accreditation
            })
        }

        if (variant.duration) {
            differences.push({
                icon: <Clock size={16} />,
                label: 'Duración',
                value: variant.duration
            })
        }

        return differences
    }

    const formatPrice = (price) => {
        if (!price || price === 0) return 'Precio no disponible'
        return `$${price.toLocaleString('es-CO')}`
    }

    return (
        <ProgramItemWrapper
            icon={<BookCopy strokeWidth=".12em" size="2em" />}
            titleLine1='Elige cómo estudiar este programa'
            description='Selecciona la opción que mejor se adapte a ti'
            isFullWidth
        >
            <div className="flex flex-col items-center gap-8 w-full">
                <div
                    className="flex flex-wrap gap-[1.5em] w-full justify-center"
                    role="list"
                    aria-label="Lista de variantes del programa"
                >
                    {variants.map((variant, index) => {
                        const isCurrentVariant = variant.programID === currentProgramID
                        const baseSlug = getBaseSlug(variant.programSlug)
                        const variantUrl = `/${variant.instituteSlug}/programas/${baseSlug}?id=${variant.programID}`
                        const differences = getVariantDifferences(variant)

                        return (
                            <Link
                                href={variantUrl}
                                key={variant.programID}
                                aria-label={`${isCurrentVariant ? 'Opción actual: ' : 'Ver opción: '}${differences.map(d => `${d.label}: ${d.value}`).join(', ')}. Precio: ${formatPrice(variant.price)}`}
                                className={index >= 3 && !showAll ? 'hidden' : 'block'}
                            >
                                <article
                                    className={`relative rounded-xl p-[2em] pb-[1em] transition-all duration-300 border-[0.2em] h-full w-[18em] ${
                                        isCurrentVariant
                                            ? 'bg-(--transparent-yellow) border-(--yellow) shadow-[0_4px_15px_rgba(102,126,234,0.2)]'
                                            : 'bg-(--light-blue) border-gray-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[#667eea]'
                                    }`}
                                    aria-current={isCurrentVariant ? 'true' : undefined}
                                >
                                    {isCurrentVariant && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-(--yellow) text-(--dark-blue) py-[0.4em] px-[1em] rounded-full text-[0.65em] font-bold flex items-center gap-1">
                                            <span aria-label="Marca de verificación">✓</span>
                                            <span>Opción actual</span>
                                        </div>
                                    )}

                                    <ul
                                        className="grid place-items-center gap-6"
                                        role="list"
                                        aria-label="Características de esta opción"
                                    >
                                        {differences.map((diff, index) => (
                                            <li
                                                key={index}
                                                className="relative text-center rounded-2xl py-[0.2em] px-[1.5em] border-[0.1em] border-gray-300"
                                                role="listitem"
                                            >
                                                <span className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.6em] font-semibold uppercase tracking-wider ${isCurrentVariant ? 'bg-[#f2eacc]' : 'bg-(--light-blue)'} px-2 whitespace-nowrap`}>
                                                    {diff.label}
                                                </span>
                                                <span className="text-[0.8em] py-[0.3em] px-[0.5em] font-medium capitalize text-center block">
                                                    {diff.value}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <footer className="mt-4 pt-3 border-t border-gray-300 text-[0.9em] text-center font-semibold">
                                        <span className="sr-only">Precio: </span>
                                        {formatPrice(variant.price)}
                                    </footer>
                                </article>
                            </Link>
                        )
                    })}
                </div>

                {hasMore && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-2 px-6 py-3 bg-(--blue) text-white rounded-full font-bold transition-all hover:scale-105 hover:bg-(--dark-blue)"
                    >
                        {showAll ? 'Ver menos opciones' : `Ver ${variantsCount - 3} opciones más`}
                        {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                )}
            </div>
        </ProgramItemWrapper>
    )
}

export default ProgramVariantsToggle
