export const formatDuration = (duration) => {
    if (duration) {
        const durationSplited = duration.split('X')
        const typeTime = durationSplited[1]
        let info = ''
        switch (typeTime) {
            case ' semestral':
                durationSplited[1] = 'semestres'
                info = 'Es el sistema tradicional y más popular en Colombia. El año se divide en dos semestres de aproximadamente 16 a 18 semanas cada uno. Te matricularás y pagarás dos veces al año'
                break
            case ' periodos':
                durationSplited[1] = 'periodos'
                info = 'Término genérico que usan algunas instituciones para describir una estructura propia que no es ni semestral ni trimestral. Puede referirse a módulos, ciclos o bloques temáticos'
                break
            case ' anual':
                durationSplited[1] = 'años'
                info = ' Cursas un solo gran periodo académico que dura todo el año. Las materias tienen una mayor duración y solo te matriculas una vez'
                break
            case ' sin definir':
                durationSplited[1] = 'no definido'
                info = 'la información no está disponible en la fuente de datos'
                break
            case ' trimestral':
                durationSplited[1] = 'trímestres'
                info = 'Es un modelo más intensivo donde el año se divide en cuatro periodos de tres meses, te matricularás cuatro veces al año'
                break
            case ' cuatrimestral':
                durationSplited[1] = 'cuatrimestres'
                info = 'El año se divide en tres periodos de cuatro meses cada uno. Este modelo permite un ritmo un poco más ágil que el semestral y te matricularás tres veces al año'
                break
            case ' por cohorte':
                durationSplited[1] = 'cohortes'
                info = 'ingresas con un grupo de estudiantes y todos avanzan juntos a través del programa, siguiendo un plan de estudios idéntico y sin desviaciones. No eliges qué materias ver; sigues una ruta fija desde el principio hasta el fin. Es muy común en maestrías (MBA) y doctorados. Fomenta un fuerte networking, pero ofrece poca flexibilidad'
                break
            case ' mensual':
                durationSplited[1] = 'meses'
                info = 'Son periodos súper cortos e intensivos de uno o dos meses. No son comunes para carreras universitarias, sino para cursos de extensión, idiomas o diplomados'
                break
            case ' bimensual':
                durationSplited[1] = 'bimensual'
                info = 'Son periodos súper cortos e intensivos de uno o dos meses. No son comunes para carreras universitarias, sino para cursos de extensión, idiomas o diplomados'
                break
            default:
                info = 'la información no está disponible en la fuente de datos'
                durationSplited[1] = 'n/a'
        }

        const durationFormated = durationSplited.join(' ')
        return { durationFormated, info }
    }

    return 'n/a'
}

export const formatLocation = (location) => {
    if (location === 'bogotá, d.c. - bogotá, d.c.') {
        return 'bogotá d.c'
    }
    return location
}
