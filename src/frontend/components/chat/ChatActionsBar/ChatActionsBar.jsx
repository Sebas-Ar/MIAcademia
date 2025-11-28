
import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { useAutosizeChatBar } from '@/frontend/hooks/useAutosizeTextArea'
import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'
import useLocalStorage from '@/frontend/hooks/useLocalStorage'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import ChatInput from './ChatInput'

import { createRoot } from 'react-dom/client'

// hooks
import { useChatBarStore } from '@/frontend/hooks/globalState/useChatBarStore'
import { useFavoritesStore } from '@/frontend/hooks/globalState/useFavoriteStore'
import { useHistoryStore } from '@/frontend/hooks/globalState/useHistoryStore'
import { useChatPagination } from '@/frontend/hooks/useChatPagination'
import LoadingPage from '../../loading/LoadingPage'
import FavoriteBtn from './FavoriteBtn'

const ActionsBar = ({
    location = '',
    userQuery = '',
    model = '',
    responseStored = null,
    isResponding,
    setIsResponding,
    textAreaRef,
    submitButtonRef,
    setIsSuggestinEnable,
    setLoading,
    setEnableAutoScroll,
    setRating,
    setResponse,
    response,
    chatID = '',
    setIsFilterActive,
    isChatEnabled,
    isSuggestinEnable,
    isFilterActive,
    programMode = false,
    animationOpacity = false,
    chat,
    suggestionList = [],
    activeSuggestion = () => { },
    programTypeRef = null,
    modalityRef = null,
    sectorRef = null,
    searchParams = {},
    setIsEnableAlert = () => { }
}) => {
    const addHistoryItem = useHistoryStore((state) => state.addHistoryItem)
    const fetchFavorites = useFavoritesStore(state => state.fetchFavorites)
    const resetFilterEnables = useChatBarStore((state) => state.resetFilterEnables)
    const toogleFilter = useChatBarStore((state) => state.toogleFilter)
    const filterEnables = useChatBarStore((state) => state.filterEnables)
    const modelSelected = useChatBarStore((state) => state.modelSelected)
    const setLastChatID = useHistoryStore((state) => state.setLastChatID)

    // Hook de paginación para cargar más programas
    const { loadSpecificPage, isLoadingMore } = useChatPagination(chatID)

    const { anonimousUserID, userEmail } = useIdentifyUser()
    const chatIDLocalStorage = useLocalStorage('chatID')
    const form = useRef(null)
    const buttonHandlerAttachedRef = useRef(false) // Evitar adjuntar el handler múltiples veces

    // local storage hook
    const questionStorage = useLocalStorage('question')
    const responseStorage = useLocalStorage('response')

    // next hooks
    const router = useRouter()
    const { replace } = useRouter()
    const params = useParams()
    const pathname = usePathname()

    // states
    const [loadingPage, setLoadingPage] = useState(false)
    const [programQueryParam, setProgramQueryParam] = useState('')
    // const [filterEnables, setFilterEnables] = useState({
    //     filterActive: 0,
    //     sector: false,
    //     modality: false,
    //     programType: false,
    //     academicType: false
    // })
    const [value, setValue] = useState('')

    const toggleSugestion = () => setIsSuggestinEnable(current => {
        return !current
    })

    useAutosizeChatBar(textAreaRef.current, value, isChatEnabled, programMode)

    const refIsResponding = useRef(false)
    const abortControllerRef = useRef(null)

    // useEffect(() => {
    //     const textoLimpio = limpiarBloquesCodigoMarkdown(response)
    //     console.log('se ejecuta limpiarBloquesCodigoMarkdown')
    //     setResponse(textoLimpio)
    // }, [response])

    useEffect(() => {
        if (refIsResponding.current) return
        refIsResponding.current = true

        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        // const isChatEnable = searchParams.has('chat')
        // setIsChatEnabled(isChatEnable)

        const responseChat = async () => {
            setIsFilterActive(false)
            setIsSuggestinEnable(false)
            setLoading(true)
            setEnableAutoScroll(true)
            setIsResponding(true)
            setRating(null)
            setResponse('')

            const miaResponse = await fetch('/api/mia/' + chatID, {
                method: 'PUT',
                signal,
                body: JSON.stringify({
                    userQuery,
                    model
                }),
                headers: { 'Content-Type': 'application/json' }
            })
            setLoading(false)

            if (!miaResponse.ok) {
                const responseOnError = 'Estamos teniendo problemas para responder, intenta consultar nuevamente'
                setResponse(responseOnError)
                localStorage.setItem('response', responseOnError)
                setIsResponding(false)
                return
            }

            const reader = miaResponse.body.getReader()
            const decoder = new TextDecoder()
            let done = false

            while (!done) {
                // if (signal.aborted) {
                //     break
                // }
                const { value, done: doneReading } = await reader.read()
                done = doneReading
                const chunk = decoder.decode(value, { stream: true })
                setResponse(prev => {
                    // localStorage.setItem('response', prev + chunk)
                    return prev + chunk
                })
            }
            setIsResponding(false)
            // router.push('/chats/' + chatID + '?chat=enable&responded=true')
            const params = new URLSearchParams(searchParams)
            params.set('responded', 'true')
            if (location === 'chat') {
                replace(`${pathname}?${params.toString()}`)
            }
        }

        if (!responseStored && location === 'chat' && isChatEnabled && form?.current) {
            responseChat()
        }

        return () => {
            // abortControllerRef.current.abort()
        }
    }, [])

    useEffect(() => {
        if (programQueryParam) {
            submitButtonRef.current.disabled = false
            textAreaRef.current.value = searchParams.get('program')
            const programType = searchParams.get('programType')
            if (programType) {
                // programTypeRef.current.value = programType
                toogleFilter({ filterName: 'programType', value: programType })
            }
            submitButtonRef.current.click()
            textAreaRef.current.value = ''
            submitButtonRef.current.disabled = true
        }
    }, [programQueryParam])

    useEffect(() => {
        const isProgramExist = searchParams.has('program')
        const programQuery = searchParams.get('program')
        const programType = searchParams.get('programType')
        if (isProgramExist && programQuery && (questionStorage && questionStorage !== programQuery) && programType) {
            setProgramQueryParam(searchParams.get('program'))
        }

        // if (programQuery && questionStorage === programQuery) {
        //     setIsChatEnabled(true)
        // }
    }, [params, searchParams, questionStorage])

    // set question and response from local storage
    useEffect(() => {
        if (!userQuery?.consulta && !response) {
            // setQuestion(questionStorage)
            setResponse(responseStorage)
            setTimeout(() => {
                chat.current?.scrollTo(0, 0)
            }, 10)
        }
    }, [setResponse, questionStorage, responseStorage])

    useEffect(() => {
        if (location === 'chat') fetchFavorites({ userEmail })
    }, [userEmail])

    // Restaurar programas paginados cuando hay un query param "pagination"
    useEffect(() => {
        const currentPagination = parseInt(searchParams.get('pagination')) || 1

        // Si pagination <= 1, no hay nada que restaurar
        if (currentPagination <= 1) {
            return
        }

        if (location !== 'chat' || !chatID || isResponding || !response) {
            return
        }

        let cancelled = false

        const loadMissingPrograms = async () => {
            // Esperar a que el botón esté en el DOM
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Si se canceló (cleanup ejecutado), salir
            if (cancelled) return

            const loadMoreButton = document.querySelector('.load-more-programs-btn')
            if (!loadMoreButton) return

            const programList = document.querySelector('.program-list')
            const buttonWrapper = loadMoreButton.closest('.load-more-btn-wrapper') || loadMoreButton.parentElement

            if (!programList || !buttonWrapper) return

            // Calcular cuántos programas hay por bloque
            const initialPrograms = document.querySelectorAll('.program-wrapper').length
            const programsPerBlock = initialPrograms > 0 ? initialPrograms : 8

            if (!loadMoreButton.initialProgramCount) {
                loadMoreButton.initialProgramCount = programsPerBlock
            }

            // Cargar bloques desde el 2 hasta el actual
            for (let block = 2; block <= currentPagination; block++) {
                if (cancelled) return // Verificar cancelación en cada iteración

                const result = await loadSpecificPage(block, programsPerBlock)

                if (cancelled) return // Verificar después del await

                if (result && result.limit && !loadMoreButton.programsPerBlockFromAPI) {
                    loadMoreButton.programsPerBlockFromAPI = result.limit
                }

                if (result && result.programs && result.programs.length > 0) {
                    result.programs.forEach((program) => {
                        const li = document.createElement('li')
                        li.className = 'program-wrapper'
                        li.innerHTML = `
                            <div class="program" id="${program.programID || ''}" data-program-slug="${program.programSlug || ''}" data-institute-slug="${program.instituteSlug || ''}">
                                <img src="${program.urlImg || '/logo-not-found.webp'}" alt="logo de ${program.instituteName || 'Institución'}">
                                <div class="program-info">
                                    <h3>${program.instituteName || 'Institución'}</h3>
                                    <h2>${program.programName || 'Programa'}</h2>
                                    <ul>
                                        ${program.programType ? `<li><strong>Tipo de programa:</strong> ${program.programType}</li>` : ''}
                                        ${program.modality ? `<li><strong>Modalidad:</strong> ${program.modality}</li>` : ''}
                                        ${program.duration ? `<li><strong>Duración:</strong> ${program.duration}</li>` : ''}
                                        ${program.location ? `<li><strong>Ubicación:</strong> ${program.location}</li>` : ''}
                                        ${program.price ? `<li><strong>Precio:</strong> ${program.price}</li>` : ''}
                                    </ul>
                                    <div class="ver">
                                        Ver Más
                                    </div>
                                </div>
                            </div>
                        `
                        programList.insertBefore(li, buttonWrapper)
                    })

                    if (!result.hasMore) {
                        buttonWrapper.remove()
                    }
                }
            }
        }

        loadMissingPrograms()

        // Función de cleanup para cancelar la segunda ejecución de Strict Mode
        return () => {
            cancelled = true
        }
    }, [])

    // Resetear bandera cuando cambia el chatID (nueva consulta)
    useEffect(() => {
        buttonHandlerAttachedRef.current = false
    }, [chatID])

    // useEffect separado SOLO para el botón "Ver más programas"
    useEffect(() => {
        if (isResponding || !chatID) return
        if (buttonHandlerAttachedRef.current) return

        const loadMoreButton = document.querySelector('.load-more-programs-btn')
        if (!loadMoreButton) return

        buttonHandlerAttachedRef.current = true

        // Guardar el número de programas iniciales para calcular programas por bloque
        if (!loadMoreButton.initialProgramCount) {
            loadMoreButton.initialProgramCount = document.querySelectorAll('.program-wrapper').length
        }

        loadMoreButton.onclick = async () => {
            if (isLoadingMore) {
                return
            }

            // Deshabilitar el botón mientras carga
            loadMoreButton.disabled = true
            loadMoreButton.textContent = 'Cargando...'

            try {
                // Usar el valor de la API si existe, sino el inicial del DOM
                const programsPerBlock = loadMoreButton.programsPerBlockFromAPI || loadMoreButton.initialProgramCount || 8

                // Calcular cuántos bloques ya se han cargado
                const currentPrograms = document.querySelectorAll('.program-wrapper').length
                const blocksLoaded = Math.floor(currentPrograms / programsPerBlock)

                // La siguiente página a cargar es bloques + 1
                const nextPage = blocksLoaded + 1

                const result = await loadSpecificPage(nextPage, programsPerBlock)

                // Guardar el limit real de la API para futuras cargas
                if (result && result.limit && !loadMoreButton.programsPerBlockFromAPI) {
                    loadMoreButton.programsPerBlockFromAPI = result.limit
                }

                if (result && result.programs && result.programs.length > 0) {
                    // Encontrar la lista de programas en el DOM
                    const programList = document.querySelector('.program-list')

                    // Encontrar el elemento padre del botón (el <li> wrapper)
                    const buttonWrapper = loadMoreButton.closest('.load-more-btn-wrapper') || loadMoreButton.parentElement

                    if (programList && buttonWrapper) {
                        // Renderizar cada programa nuevo
                        result.programs.forEach((program) => {
                            const li = document.createElement('li')
                            li.className = 'program-wrapper'
                            li.innerHTML = `
                                <div class="program" id="${program.programID || ''}" data-program-slug="${program.programSlug || ''}" data-institute-slug="${program.instituteSlug || ''}">
                                    <img src="${program.urlImg || '/logo-not-found.webp'}" alt="logo de ${program.instituteName || 'Institución'}">
                                    <div class="program-info">
                                        <h3>${program.instituteName || 'Institución'}</h3>
                                        <h2>${program.programName || 'Programa'}</h2>
                                        <ul>
                                            ${program.programType ? `<li><strong>Tipo de programa:</strong> ${program.programType}</li>` : ''}
                                            ${program.modality ? `<li><strong>Modalidad:</strong> ${program.modality}</li>` : ''}
                                            ${program.duration ? `<li><strong>Duración:</strong> ${program.duration}</li>` : ''}
                                            ${program.location ? `<li><strong>Ubicación:</strong> ${program.location}</li>` : ''}
                                            ${program.price ? `<li><strong>Precio:</strong> ${program.price}</li>` : ''}
                                        </ul>
                                        <div class="ver">
                                            Ver Más
                                        </div>
                                    </div>
                                </div>
                            `
                            programList.insertBefore(li, buttonWrapper)
                        })

                        // Si no hay más programas, ocultar el botón
                        if (!result.hasMore) {
                            buttonWrapper.remove()
                        } else {
                            // Actualizar URL basándose en cuántos bloques se han cargado
                            const totalProgramsNow = document.querySelectorAll('.program-wrapper').length
                            const blocksLoaded = Math.ceil(totalProgramsNow / programsPerBlock)

                            const params = new URLSearchParams(window.location.search)
                            params.set('pagination', blocksLoaded.toString())
                            router.replace(`${pathname}?${params.toString()}`, { scroll: false })

                            loadMoreButton.disabled = false
                            loadMoreButton.textContent = 'Ver más programas'
                        }
                    } else {
                        loadMoreButton.disabled = false
                        loadMoreButton.textContent = 'Error. Intentar de nuevo'
                    }
                } else {
                    // No hay más programas, ocultar el botón
                    const buttonWrapper = loadMoreButton.closest('.load-more-btn-wrapper') || loadMoreButton.parentElement
                    if (buttonWrapper) buttonWrapper.remove()
                }
            } catch (error) {
                console.error('Error loading more programs:', error)
                loadMoreButton.disabled = false
                loadMoreButton.textContent = 'Error. Intentar de nuevo'
            }
        }
    }, [isResponding, chatID, router, pathname])

    // Add img not found if program img is not found
    // and add click event to show alert if program is clicked while writing
    // and add click event to navigate to a program
    useEffect(() => {
        const programsTags = [].slice.call(document.getElementsByClassName('program'))
        if (!programsTags) {
            return
        }

        programsTags.forEach((program = <></>) => {
            // avoid img error if program img has error
            if (!program.isCatchImgError) {
                const img = program?.children[0]
                if (img) {
                    // Asignar el handler onerror ANTES de manipular el src
                    img.onerror = () => {
                        img.src = '/logo-not-found.webp'
                    }

                    // Si no tiene src o ya intentó cargar y falló, se reemplaza por el logo por defecto
                    if (!img.src || (img.complete && img.naturalWidth === 0)) {
                        img.src = '/logo-not-found.webp'
                    }

                    program.isCatchImgError = true
                }
            }

            if (!program.isFavoriteAdded && program?.children[1] && (userEmail || anonimousUserID)) {
                program.isFavoriteAdded = true
                const container = document.createElement('div')
                container.className = 'favorite-btn-program-chat'
                const root = createRoot(container)
                root.render(<FavoriteBtn
                    programID={program.id}
                    userEmail={userEmail}
                    anonimousUserID={anonimousUserID}
                />)
                program.before(container)
            }

            // show alert if program is clicked while writing
            if (!program.isReadWhileWriting && isResponding) {
                program.isReadWhileWriting = true
                program.onclick = () => {
                    setIsEnableAlert(true)
                }
            }

            // change program onclick to redirect to program page
            // when response is finished
            if (!program.isReadAfterFinish && !isResponding) {
                program.isReadAfterFinish = true
                console.log({ program })
                program.onclick = async () => {
                    setLoadingPage(true)
                    console.log({ 'program.dataset': program.dataset })
                    // Usar formato: /{instituteSlug}/programas/{programSlug}?id={programID}
                    const programSlug = program.dataset.programSlug
                    const instituteSlug = program.dataset.instituteSlug
                    const programUrl = `${instituteSlug}/programas/${programSlug}?id=${program.id}`
                    triggerEvent(eventCategories.CHAT, eventNames.SELECT_PROGRAM, { programID: program.id })
                    if (chatID || chatIDLocalStorage) {
                        await fetch(`/api/mia/${chatID || chatIDLocalStorage}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                programID: program.id
                            })
                        })
                    }
                    router.push(`/${programUrl}`)
                    setLoadingPage(false)
                }
            }
        })
    })

    const initializeChat = async (e) => {
        e.preventDefault()

        const date = new Date()

        setIsResponding(true)
        submitButtonRef.current.disabled = true
        localStorage.removeItem('rating')
        localStorage.removeItem('question')
        localStorage.removeItem('response')
        if (!programMode && !isChatEnabled) {
            // toogleChatMode()
        }
        setIsFilterActive(false)
        setIsSuggestinEnable(false)
        setRating(null)

        const formData = Object.fromEntries(new FormData(e.target))
        console.log({ formData })

        localStorage.setItem('question', formData.question)

        if (textAreaRef.current) {
            textAreaRef.current.style.height = '2.75em'
            textAreaRef.current.value = ''
            textAreaRef.current.blur()
            formData.suggestionID = textAreaRef.current.suggestionID
            textAreaRef.current.suggestionID = null
        }

        const testID = searchParams.get('testID')

        const filters = {}
        console.log({ filterEnables })
        const { programType, academicType, modality, sector } = filterEnables
        if (programType && programType !== 'disable') filters.programType = programType
        if (academicType && academicType !== 'disable') filters.academicType = academicType
        if (modality && modality !== 'disable') filters.modality = modality
        if (sector && sector !== 'disable') filters.sector = sector

        const programTypeParam = searchParams.get('programType')
        if (programTypeParam && !filters?.programType) filters.programType = programTypeParam

        try {
            const initialChatData = {
                date,
                anonimousUserID,
                userEmail,
                testID,
                navigator: navigator.userAgent,
                filters,
                model: modelSelected,
                ...formData
            }

            let from = 'user'
            if (testID) from = 'vocational-test'
            if (formData.suggestionID) from = 'suggestion'
            triggerEvent(eventCategories.CHAT, eventNames.SEND_QUESTION, {
                question: formData.question,
                from
            })

            const response = await fetch('/api/mia', {
                method: 'POST',
                body: JSON.stringify(initialChatData),
                headers: { 'Content-Type': 'application/json' }
            })

            const { chatID } = await response.json()

            addHistoryItem({
                _id: chatID,
                date: new Date(date.toISOString().replace('Z', '+05:00')).toISOString(),
                userQuery: {
                    consulta: formData.question,
                    filtros: filters
                }
            })

            setLastChatID({ lastChatID: chatID })

            setTimeout(() => {
                router.push('/chats/' + chatID)
            }, 350)
            // localStorage.setItem('chatID', chatID)
        } catch (error) {
            console.log({ error })
        } finally {
            if (textAreaRef?.current?.value) submitButtonRef.current.disabled = false
        }
    }

    const onChangeForm = (e) => {
        toogleFilter({ filterName: e.target.name, value: e.target.value })
    }

    const cleanFilter = () => {
        triggerEvent(eventCategories.CHAT, eventNames.CLEAR_FILTERS)
        resetFilterEnables()

        programTypeRef.current.value = 'disable'
        modalityRef.current.value = 'disable'
        sectorRef.current.value = 'disable'
    }

    return <form id="action-bar" ref={form} onSubmit={initializeChat} onChange={onChangeForm} >
        <LoadingPage isLoading={loadingPage} />

        <ChatInput
            textAreaRef={textAreaRef}
            submitButtonRef={submitButtonRef}
            value={value}
            setValue={setValue}
            isResponding={isResponding}
            setIsFilterActive={setIsFilterActive}
            filterEnables={filterEnables}
            isChatEnabled={isChatEnabled}
            programMode={programMode}
            activeSuggestion={activeSuggestion}
            isSuggestinEnable={isSuggestinEnable}
            toggleSugestion={toggleSugestion}
            suggestionList={suggestionList}
            isFilterActive={isFilterActive}
            programTypeRef={programTypeRef}
            modalityRef={modalityRef}
            sectorRef={sectorRef}
            cleanFilter={cleanFilter}
        />

        <style jsx>{`
            form {
                width: 100%;
                z-index: 111111111;
                position: absolute;
            }

            @keyframes show {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }
        `}</style>

        <style jsx>{`
            form {
                animation: ${animationOpacity ? 'show' : ''} 1s linear forwards;
                left: ${isChatEnabled || !programMode ? '0' : '-100%'};
            }
        `}</style>
    </form>
}

export default ActionsBar
