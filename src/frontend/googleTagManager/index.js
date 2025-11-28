const { sendGTMEvent } = require('@next/third-parties/google')

export const eventType = {
    buttonClicked: 'buttonClicked',
    buttonHover: 'buttonHover',
    linkClicked: 'linkClicked',
    inputText: 'inputText',
    submitRequest: 'submitRequest'
}

export const eventCategories = {
    GENERAL_INTERACTIONS: 'GENERAL_INTERACTIONS',
    CHAT: 'CHAT',
    TEST_VOCACIONAL: 'TEST_VOCACIONAL',
    GUIDE_VOCACIONAL: 'GUIDE_VOCACIONAL',
    CAT: 'CAT'
}

export const eventValues = {
    // GENERAL_INTERACTIONS
    LOGIN_ATTEMPT: 'loginAttempt',
    LOGO_CLICK: 'logoClick',
    NAVIGATION: 'navigation',
    CLOSE_SESSION: 'closeSession',
    // CHAT
    OPEN_COUNTRY_SELECTOR: 'openCountrySelector',
    SELECT_COUNTRY: 'selectCountry',
    // FILTERS
    OPEN_FILTERS: 'openFilters',
    CHANGE_FILTER: 'changeFilter',
    CLEAR_FILTERS: 'clearFilters',
    APPLY_FILTERS: 'applyFilters',
    // SUGGESTIONS
    OPEN_SUGGESTIONS: 'openSuggestions',
    CLOSE_SUGGESTIONS: 'closeSuggestions',
    SELECT_SUGGESTION: 'selectSuggestion',
    SELECT_SUGGESTION_ON_RESPONSE: 'selectSuggestionOnResponse',
    // BANNER
    CHANGE_BANNER_VIEW: 'changeBannerView',
    // QUESTION
    WRITE_QUESTION: 'writeQuestion',
    SEND_QUESTION: 'sendQuestion',
    REPEAT_QUESTION: 'repeatQuestion',
    EDIT_QUESTION: 'editQuestion',
    // MENU NAVIGATION
    OPEN_MENU_NAVIGATION: 'openMenuNavigation',
    // RATING
    RATE_RESPONSE: 'rateResponse',
    // RESPONSE
    SELECT_PROGRAM: 'selectProgram',
    OPEN_PROPERTY_INFO: 'openPropertyInfo',
    SELECT_SITE_WEB: 'selectSiteWeb',
    // TEST
    START_TEST: 'startTest',
    ANSWER: 'answerQuestion',
    BACK_TO_PREVIOUS_QUESTION: 'backToPreviousQuestion',
    PASS_TO_NEXT_QUESTION: 'passToNextQuestion',
    FINISH_TEST: 'finishTest',
    CHANGE_PROGRAM_TYPE_RECOMMENDED: 'changeProgramTypeRecommended',
    SELECT_PROGRAM_RECOMMENDED: 'selectProgramRecommended',
    EXIT_TEST: 'exitTest',
    OPEN_TEST_IN_PROGRESS: 'openTestInProgress',
    OPEN_RESULT: 'openResult',
    // GUIDE
    OPEN_PLAN_INFO: 'openPlanInfo',
    INPUT_FORM: 'inputForm',
    SUBMIT_FORM: 'submitForm',
    // CAT
    INTERACT: 'interact'
}

export const eventNames = {
    // GENERAL_INTERACTIONS
    LOGIN_ATTEMPT: 'LOGIN_ATTEMPT',
    LOGO_CLICK: 'LOGO_CLICK',
    NAVIGATION: 'NAVIGATION',
    CLOSE_SESSION: 'CLOSE_SESSION',
    // CHAT
    OPEN_COUNTRY_SELECTOR: 'OPEN_COUNTRY_SELECTOR',
    SELECT_COUNTRY: 'SELECT_COUNTRY',
    // FILTERS
    OPEN_FILTERS: 'OPEN_FILTERS',
    CHANGE_FILTER: 'CHANGE_FILTER',
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    APPLY_FILTERS: 'APPLY_FILTERS',
    // SUGGESTIONS
    OPEN_SUGGESTIONS: 'OPEN_SUGGESTIONS',
    CLOSE_SUGGESTIONS: 'CLOSE_SUGGESTIONS',
    SELECT_SUGGESTION: 'SELECT_SUGGESTION',
    SELECT_SUGGESTION_ON_RESPONSE: 'SELECT_SUGGESTION_ON_RESPONSE',
    // BANNER
    CHANGE_BANNER_VIEW: 'CHANGE_BANNER_VIEW',
    // QUESTION
    WRITE_QUESTION: 'WRITE_QUESTION',
    SEND_QUESTION: 'SEND_QUESTION',
    REPEAT_QUESTION: 'REPEAT_QUESTION',
    EDIT_QUESTION: 'EDIT_QUESTION',
    // MENU NAVIGATION
    OPEN_MENU_NAVIGATION: 'OPEN_MENU_NAVIGATION',
    // RATING
    RATE_RESPONSE: 'RATE_RESPONSE',
    // RESPONSE
    SELECT_PROGRAM: 'SELECT_PROGRAM',
    OPEN_PROPERTY_INFO: 'OPEN_PROPERTY_INFO',
    SELECT_SITE_WEB: 'SELECT_SITE_WEB',
    // TEST
    START_TEST: 'START_TEST',
    ANSWER: 'ANSWER',
    BACK_TO_PREVIOUS_QUESTION: 'BACK_TO_PREVIOUS_QUESTION',
    PASS_TO_NEXT_QUESTION: 'PASS_TO_NEXT_QUESTION',
    FINISH_TEST: 'FINISH_TEST',
    CHANGE_PROGRAM_TYPE_RECOMMENDED: 'CHANGE_PROGRAM_TYPE_RECOMMENDED',
    SELECT_PROGRAM_RECOMMENDED: 'SELECT_PROGRAM_RECOMMENDED',
    EXIT_TEST: 'EXIT_TEST',
    OPEN_TEST_IN_PROGRESS: 'OPEN_TEST_IN_PROGRESS',
    OPEN_RESULT: 'OPEN_RESULT',
    // GUIDE
    OPEN_PLAN_INFO: 'OPEN_PLAN_INFO',
    INPUT_FORM: 'INPUT_FORM',
    SUBMIT_FORM: 'SUBMIT_FORM',
    // CAT
    INTERACT: 'INTERACT'
}

const GTM_EVENTS = {
    [eventCategories.GENERAL_INTERACTIONS]: {
        [eventNames.LOGIN_ATTEMPT]: { event: eventType.buttonClicked, value: eventValues.LOGIN_ATTEMPT },
        [eventNames.LOGO_CLICK]: { event: eventType.buttonClicked, value: eventValues.LOGO_CLICK },
        [eventNames.NAVIGATION]: { event: eventType.linkClicked, value: eventValues.NAVIGATION },
        [eventNames.CLOSE_SESSION]: { event: eventType.buttonClicked, value: eventValues.CLOSE_SESSION }
    },
    [eventCategories.CHAT]: {
        // COUNTRY SELECTOR
        [eventNames.OPEN_COUNTRY_SELECTOR]: { event: eventType.buttonHover, value: eventValues.OPEN_COUNTRY_SELECTOR },
        [eventNames.SELECT_COUNTRY]: { event: eventType.buttonClicked, value: eventValues.SELECT_COUNTRY },
        // FILTERS
        [eventNames.OPEN_FILTERS]: { event: eventType.buttonClicked, value: eventValues.OPEN_FILTERS },
        [eventNames.CHANGE_FILTER]: { event: eventType.buttonClicked, value: eventValues.CHANGE_FILTER },
        [eventNames.CLEAR_FILTERS]: { event: eventType.buttonClicked, value: eventValues.CLEAR_FILTERS },
        [eventNames.APPLY_FILTERS]: { event: eventType.buttonClicked, value: eventValues.APPLY_FILTERS },
        // SUGGESTIONS
        [eventNames.OPEN_SUGGESTIONS]: { event: eventType.buttonClicked, value: eventValues.OPEN_SUGGESTIONS },
        [eventNames.CLOSE_SUGGESTIONS]: { event: eventType.buttonClicked, value: eventValues.CLOSE_SUGGESTIONS },
        [eventNames.SELECT_SUGGESTION]: { event: eventType.buttonClicked, value: eventValues.SELECT_SUGGESTION },
        [eventNames.SELECT_SUGGESTION_ON_RESPONSE]: { event: eventType.buttonClicked, value: eventValues.SELECT_SUGGESTION_ON_RESPONSE },
        // BANNER
        [eventNames.CHANGE_BANNER_VIEW]: { event: eventType.buttonClicked, value: eventValues.CHANGE_BANNER_VIEW },
        // QUESTION
        [eventNames.WRITE_QUESTION]: { event: eventType.inputText, value: eventValues.WRITE_QUESTION },
        [eventNames.SEND_QUESTION]: { event: eventType.submitRequest, value: eventValues.SEND_QUESTION },
        [eventNames.REPEAT_QUESTION]: { event: eventType.buttonClicked, value: eventValues.REPEAT_QUESTION },
        [eventNames.EDIT_QUESTION]: { event: eventType.buttonClicked, value: eventValues.EDIT_QUESTION },
        // MENU NAVIGATION
        [eventNames.OPEN_MENU_NAVIGATION]: { event: eventType.buttonHover, value: eventValues.OPEN_MENU_NAVIGATION },
        // RATING
        [eventNames.RATE_RESPONSE]: { event: eventType.buttonClicked, value: eventValues.RATE_RESPONSE },
        // RESPONSE
        [eventNames.SELECT_PROGRAM]: { event: eventType.buttonClicked, value: eventValues.SELECT_PROGRAM },
        [eventNames.OPEN_PROPERTY_INFO]: { event: eventType.buttonHover, value: eventValues.OPEN_PROPERTY_INFO },
        [eventNames.SELECT_SITE_WEB]: { event: eventType.buttonClicked, value: eventValues.SELECT_SITE_WEB }
    },
    [eventCategories.TEST_VOCACIONAL]: {
        // TEST
        [eventNames.START_TEST]: { event: eventType.buttonClicked, value: eventValues.START_TEST },
        [eventNames.ANSWER]: { event: eventType.buttonClicked, value: eventValues.ANSWER },
        [eventNames.BACK_TO_PREVIOUS_QUESTION]: { event: eventType.buttonClicked, value: eventValues.BACK_TO_PREVIOUS_QUESTION },
        [eventNames.PASS_TO_NEXT_QUESTION]: { event: eventType.buttonClicked, value: eventValues.PASS_TO_NEXT_QUESTION },
        [eventNames.FINISH_TEST]: { event: eventType.buttonClicked, value: eventValues.FINISH_TEST },
        [eventNames.CHANGE_PROGRAM_TYPE_RECOMMENDED]: { event: eventType.buttonClicked, value: eventValues.CHANGE_PROGRAM_TYPE_RECOMMENDED },
        [eventNames.SELECT_PROGRAM_RECOMMENDED]: { event: eventType.buttonClicked, value: eventValues.SELECT_PROGRAM_RECOMMENDED },
        [eventNames.EXIT_TEST]: { event: eventType.buttonClicked, value: eventValues.EXIT_TEST },
        [eventNames.OPEN_TEST_IN_PROGRESS]: { event: eventType.buttonClicked, value: eventValues.OPEN_TEST_IN_PROGRESS },
        [eventNames.OPEN_RESULT]: { event: eventType.buttonClicked, value: eventValues.OPEN_RESULT }
    },
    [eventCategories.GUIDE_VOCACIONAL]: {
        // GUIDE
        [eventNames.OPEN_PLAN_INFO]: { event: eventType.buttonClicked, value: eventValues.OPEN_PLAN_INFO },
        [eventNames.INPUT_FORM]: { event: eventType.inputText, value: eventValues.INPUT_FORM },
        [eventNames.SUBMIT_FORM]: { event: eventType.submitRequest, value: eventValues.SUBMIT_FORM }
    },
    [eventCategories.CAT]: {
        [eventNames.INTERACT]: { event: eventType.buttonClicked, value: eventValues.INTERACT }
    }
}

export const triggerEvent = (
    eventCategory = '',
    eventName = '',
    additionalData = {}
) => {
    if (GTM_EVENTS[eventCategory] && GTM_EVENTS[eventCategory][eventName]) {
        const eventData = { ...GTM_EVENTS[eventCategory][eventName], ...additionalData }
        sendGTMEvent(eventData)
    } else {
        console.warn(`Evento no encontrado: ${eventCategory} - ${eventName}`)
    }
}
