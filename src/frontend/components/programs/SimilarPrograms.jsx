'use client'

import { Award, BookOpen, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react'
import { Link } from 'next-view-transitions'
import { useState } from 'react'

const SimilarPrograms = ({ programs = [] }) => {
    const [showAll, setShowAll] = useState(false)

    if (!programs || programs.length === 0) return null

    const formatPrice = (price) => {
        if (!price || price === 0) return 'Precio no disponible'
        return `$${price.toLocaleString('es-CO')}`
    }

    const hasMore = programs.length > 3

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 max-w-[1200px] mx-auto w-full"
                role="list"
                aria-label="Lista de programas similares"
            >
                {programs.map((program, index) => (
                    <Link
                        key={program.programID}
                        href={`/${program.instituteSlug}/programas/${program.programSlug}`}
                        aria-label={`Ver detalles de ${program.programName} en ${program.instituteName}`}
                        className={index >= 3 && !showAll ? 'hidden' : 'block'}
                    >
                        <article
                            className="shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col gap-4 bg-white p-8 md:p-6 rounded-2xl hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] h-full"
                            role="listitem"
                        >
                            {/* Header con logo e institución */}
                            <header className="grid justify-items-center gap-2 pb-4 border-b border-gray-200">
                                <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                                    {program.urlImg
                                        ? (
                                            <img
                                                src={program.urlImg}
                                                alt={`Logo de ${program.instituteName}`}
                                                loading="lazy"
                                                className="w-full h-full object-contain"
                                                width={48}
                                                height={48}
                                            />
                                        )
                                        : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <GraduationCap size={24} aria-hidden="true" />
                                            </div>
                                        )}
                                </div>
                                <div className="text-[0.85em] text-gray-600 font-medium leading-tight flex-1 uppercase text-center">
                                    {program.instituteName}
                                </div>
                            </header>

                            {/* Cuerpo con información del programa */}
                            <div className="grid justify-center gap-3 flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 text-center capitalize">
                                    {program.programName}
                                </h3>

                                <div className="flex flex-wrap justify-center gap-2" role="list" aria-label="Características del programa">
                                    <span
                                        className="inline-flex items-center gap-1 py-1 px-3 rounded-md text-xs font-medium capitalize bg-blue-50 text-blue-700"
                                        role="listitem"
                                        aria-label={`Tipo de programa: ${program.programType}`}
                                    >
                                        <BookOpen size={14} aria-hidden="true" />
                                        {program.programType}
                                    </span>
                                    <span
                                        className="inline-flex items-center gap-1 py-1 px-3 rounded-md text-xs font-medium capitalize bg-purple-50 text-purple-700"
                                        role="listitem"
                                        aria-label={`Modalidad: ${program.modality}`}
                                    >
                                        {program.modality}
                                    </span>
                                    {program.accreditation === 'alta calidad' && (
                                        <span
                                            className="inline-flex items-center gap-1 py-1 px-3 rounded-md text-xs font-medium capitalize bg-orange-50 text-orange-700"
                                            role="listitem"
                                            aria-label="Acreditación: Alta calidad"
                                        >
                                            <Award size={14} aria-hidden="true" />
                                        Alta calidad
                                        </span>
                                    )}
                                </div>

                                <div className="text-center text-base font-semibold text-gray-900">
                                    <span aria-label={`Precio: ${formatPrice(program.price)}`}>
                                        {formatPrice(program.price)}
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center gap-2 px-6 py-3 bg-(--blue) text-white rounded-full font-bold transition-all hover:scale-105 hover:bg-(--dark-blue)"
                >
                    {showAll ? 'Ver menos' : 'Ver más programas'}
                    {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            )}
        </div>
    )
}

export default SimilarPrograms
