import { create } from 'zustand'

export const useFavoritesStore = create((set, get) => ({
    userFavoritesList: [],
    hasFetched: false,
    isLoading: false,
    fetchFavorites: async ({ userEmail = '' }) => {
        if (get().hasFetched || !userEmail) return

        set({ isLoading: true })
        // transform userEmail to URL encoded
        const response = await fetch(`/api/mia/user/favorites?userEmail=${encodeURIComponent(userEmail)}`)
        if (response.status === 204) {
            set({
                isLoading: false,
                hasFetched: true
            })
        } else {
            const { userFavoritesList } = await response.json()
            if (!userFavoritesList) return

            set({
                userFavoritesList: userFavoritesList.reverse(),
                hasFetched: true,
                isLoading: false
            })
        }
    },
    addFavoriteToUser: async ({ userEmail, programID }) => {
        const params = new URLSearchParams()
        params.set('filters', JSON.stringify({
            program: [
                'programName',
                'programType',
                'programSlug',
                'instituteSlug'
            ],
            institute: [
                'instituteName',
                'urlImg'
            ]
        }
        ))

        const responseProgram = await fetch(`/api/programs/${programID}?${params.toString()}`)
        if (!responseProgram.ok) return

        const { data: program } = await responseProgram.json()
        console.log({ program })

        const response = await fetch(`/api/mia/user/favorites?userEmail=${userEmail}`, {
            method: 'POST',
            body: JSON.stringify({ program }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) return

        if (get().hasFetched) {
            set((state) => {
                return ({ userFavoritesList: [program, ...state.userFavoritesList] })
            })
        }
        return { program }
    },
    deleteFavoriteToUser: async ({ userEmail, program }) => {
        const response = await fetch(`/api/mia/user/favorites?userEmail=${userEmail}`, {
            method: 'DELETE',
            body: JSON.stringify({ program }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) return

        if (get().hasFetched) {
            set((state) => {
                return ({ userFavoritesList: state.userFavoritesList.filter(favorite => String(favorite.programID) !== program.programID) })
            })
        }
    }
}))
