'use client'

// react
import { useEffect, useRef, useState } from 'react'
// next
import { useSearchParams } from 'next/navigation'
// database
// components
import ActionsBar from '@/frontend/components/chat/ChatActionsBar/ChatActionsBar'
import ChatContent from '@/frontend/components/chat/ChatContent/ChatContent'
import Footer from '@/frontend/components/footer/Footer'
import Header from '@/frontend/components/header/Header'
// cookies
import SelectModel from '@/frontend/components/chat/ChatActionsBar/SelectModel'
import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import useLocalStorage from '@/frontend/hooks/useLocalStorage'

import CounselingBanner from '../counseling/CounselingBanner'
import Circles from '../decoration/Circles'
import AsideMenu from '../navigation/AsideMenu'
import MenuMain from '../navigation/MainMenu'
import ShareModal from '../navigation/ShareModal'
import ToolsNavModal from '../navigation/ToolsNavModal'
import UpcomingFeaturesModal from '../navigation/UpcomingFeaturesModal'
import VocationalBanner from '../vocationalTest/VocationalBanner'
import SliderWrapper from '../wrappers/SliderWrapper'

const ChatPage = ({
    suggestions = {},
    responseStored = null,
    chatID = '',
    userQuery = '',
    model = '',
    location = '',
    isChatEnabled = false,
    chatRate = null,
    children = null
}) => {
    // localStorage
    // - autoShowSuggestion
    const autoShowSuggestionLocalStorage = useLocalStorage('autoShowSuggestion')
    // - isMIAMessageActive
    const isMIAMessageActiveLocalStorage = useLocalStorage('isMIAMessageActive')

    // next hooks
    const searchParams = useSearchParams()

    // refs
    const textAreaRef = useRef(null)
    const chat = useRef(null)
    const responseWrapper = useRef(null)
    const submitButtonRef = useRef(null)
    const programTypeRef = useRef(null)
    const modalityRef = useRef(null)
    const sectorRef = useRef(null)

    // states
    const [response, setResponse] = useState(responseStored)
    const [loading, setLoading] = useState(false)
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [enableAutoScroll, setEnableAutoScroll] = useState(true)
    const [rating, setRating] = useState(chatRate)
    const [isSuggestinEnable, setIsSuggestinEnable] = useState(false)
    const [isResponding, setIsResponding] = useState(false)
    const [suggestionList, setSuggestionList] = useState(suggestions)
    // const [suggestionList, setSuggestionList] = useState([])
    const [isEnableAlert, setIsEnableAlert] = useState(false)
    const [isMIAMessageActive, setIsMIAMessageActive] = useState(false)
    const [isSuggestNavigators, setIsSuggestNavigators] = useState(false)

    useEffect(() => {
        console.log({ rating })
    }, [rating])

    // effects
    useEffect(() => {
        if (enableAutoScroll && !responseStored) {
            chat.current?.scrollTo(0, responseWrapper?.current.offsetHeight)
        }
    }, [response, enableAutoScroll])

    useEffect(() => {
        if (autoShowSuggestionLocalStorage && autoShowSuggestionLocalStorage !== 'false') {
            setTimeout(() => {
                setIsSuggestinEnable(true)
                localStorage.setItem('autoShowSuggestion', 'false')
            }, 10000)
        }

        if (isMIAMessageActiveLocalStorage && isMIAMessageActiveLocalStorage !== 'false') {
            setTimeout(() => {
                setIsMIAMessageActive(true)
                localStorage.setItem('isMIAMessageActive', 'false')
            }, 5000)
        }
    }, [autoShowSuggestionLocalStorage, isMIAMessageActiveLocalStorage])

    const activeSuggestion = async ({ suggestion = '', from = 'action-bar' }) => {
        triggerEvent(eventCategories.CHAT, from === 'action-bar' ? eventNames.SELECT_SUGGESTION : eventNames.SELECT_SUGGESTION_ON_RESPONSE, suggestion)
        textAreaRef.current.value = suggestion.text
        textAreaRef.current.suggestionID = suggestion._id
        setIsSuggestinEnable(false)
        const response = await fetch('/api/suggestions', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ suggestionID: suggestion._id })
        })
        const { suggestions } = await response.json()
        setSuggestionList(suggestions)
    }

    const slidersList = [
        {
            title: 'Test Vocacional',
            component: <VocationalBanner key="vocational" />
        },
        {
            title: 'Asesoría Vocacional',
            component: <CounselingBanner key="counseling" />
        }
    ]

    return <div className="page">
        <Circles
            hideCircles={isChatEnabled}
            ciclesColor='var(--white)'
        />

        <MenuMain
            backgroundColor="var(--yellow)"
        />

        <div>
            <Header
                hideCircles={isChatEnabled}
                isChatEnabled={isChatEnabled}
                isMIAMessageActive={isMIAMessageActive}
                showSideMenu
                disableBackground={!isChatEnabled}
            />

            <SelectModel />
            <ToolsNavModal />
            {
                location === 'chat' &&
                <ShareModal title="chat" />
            }
            <UpcomingFeaturesModal />

            <ActionsBar
                location={location}
                userQuery={userQuery}
                model={model}
                responseStored={responseStored}
                isResponding={isResponding}
                setIsResponding={setIsResponding}
                isChatEnabled={isChatEnabled}
                chatID={chatID}
                setEnableAutoScroll={setEnableAutoScroll}
                setIsFilterActive={setIsFilterActive}
                setIsSuggestinEnable={setIsSuggestinEnable}
                setLoading={setLoading}
                loading={loading}
                setRating={setRating}
                setResponse={setResponse}
                response={response}
                textAreaRef={textAreaRef}
                submitButtonRef={submitButtonRef}
                isSuggestinEnable={isSuggestinEnable}
                isFilterActive={isFilterActive}
                rating={rating}
                chat={chat}
                suggestionList={suggestionList}
                activeSuggestion={activeSuggestion}
                programTypeRef={programTypeRef}
                modalityRef={modalityRef}
                sectorRef={sectorRef}
                searchParams={searchParams}
                setIsEnableAlert={setIsEnableAlert}
                setIsSuggestNavigators={setIsSuggestNavigators}
            />

        </div>
        {
            location === 'index' &&
                <div className="yellow">
                    <SliderWrapper slidersList={slidersList} />
                </div>
        }
        {
            location === 'chat' &&
                <>
                    <ChatContent
                        setEnableAutoScroll={setEnableAutoScroll}
                        chat={chat}
                        userQuery={userQuery}
                        responseWrapper={responseWrapper}
                        loading={loading}
                        response={response}
                        chatID={chatID}
                        setRating={setRating}
                        isChatEnabled={isChatEnabled}
                        isFilterActive={isFilterActive}
                        textAreaRef={textAreaRef}
                        rating={rating}
                        isSuggestinEnable={isSuggestinEnable}
                        submitButtonRef={submitButtonRef}
                        isResponding={isResponding}
                        suggestionList={suggestionList}
                        activeSuggestion={activeSuggestion}
                        isEnableAlert={isEnableAlert}
                        setIsEnableAlert={setIsEnableAlert}
                        isSuggestNavigators={isSuggestNavigators}
                        chatRate={chatRate}
                    />
                    <AsideMenu
                        hideMIA
                    />
                </>
        }

        {
            location === 'program' &&
            <>
                {
                    children
                }
                <AsideMenu hideMIA/>
                <ShareModal title="programa" />
            </>
        }

        <Footer />

        <style jsx>{`
            .page {
                min-height: 100dvh;
                display: grid;
                grid-template-rows: auto 1fr auto;
                background: var(--yellow);
            }
        `}</style>
    </div>
}

export default ChatPage
