import { create } from 'zustand'

export const useHistoryStore = create((set, get) => ({
    historyList: [],
    hasFetchedHistory: false,
    hasFetchedLastChat: false,
    isLoadingHistory: false,
    isLoadingLastChat: false,
    lastChatID: '',
    fetchHistory: async ({ userEmail, anonimousUserID }) => {
        if (get().hasFetchedHistory || (!userEmail && !anonimousUserID)) return

        set({ isLoadingHistory: true })

        const params = new URLSearchParams()
        if (userEmail) params.set('userEmail', userEmail)
        if (anonimousUserID) params.set('anonimousUserID', anonimousUserID)

        const response = await fetch(`/api/mia/user/chats?${params.toString()}`)
        if (response.status === 204) {
            set({
                hasFetchedHistory: true,
                isLoadingHistory: false
            })
        } else {
            const { userChatsList } = await response.json()
            if (!userChatsList) return

            // REMOVE: this is junst necesary to filter chats with no query
            // when pass to DB is producction this can be removed
            const userChatsListFiltered = userChatsList?.filter(chat => {
                if (chat?.userQuery?.consulta) return true
                return false
            })

            set({
                historyList: userChatsListFiltered?.reverse(),
                hasFetchedHistory: true,
                isLoadingHistory: false
            })
        }
    },
    fetchLastChat: async ({ userEmail, anonimousUserID }) => {
        if (get().hasFetchedLastChat || (!userEmail && !anonimousUserID)) return

        set({ isLoadingLastChat: true })

        const params = new URLSearchParams()
        if (userEmail) params.set('userEmail', userEmail)
        if (anonimousUserID) params.set('anonimousUserID', anonimousUserID)

        const response = await fetch(`/api/mia/user/chats/last?${params.toString()}`)
        if (response.status === 204) {
            set({
                hasFetchedLastChat: true,
                isLoadingLastChat: false
            })
        } else {
            const { userChatsList } = await response.json()
            if (!userChatsList) return

            set({
                lastChatID: userChatsList[0]?._id,
                hasFetchedLastChat: true,
                isLoadingLastChat: false
            })
        }
    },
    addHistoryItem: (item) => {
        if (!get().hasFetchedHistory) return
        set((state) => {
            console.log({ item })
            return ({ historyList: [item, ...state.historyList] })
        })
    },
    setLastChatID: ({ lastChatID }) => set({ lastChatID })
}))
