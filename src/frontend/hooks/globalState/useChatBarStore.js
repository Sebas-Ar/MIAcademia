import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useChatBarStore = create(persist(
    (set, get) => ({
        filterEnables: {
            filterActive: 0,
            sector: 'disable',
            modality: 'disable',
            programType: 'disable',
            academicType: 'disable'
        },
        isModalModelSelectEnable: false,
        modelSelected: 'gemini',
        toogleFilter: ({ filterName, value }) => {
            set((state) => {
                return ({ filterEnables: { ...state.filterEnables, [filterName]: value } })
            })

            set((state) => {
            // filterActive: validateFilters(state.filterEnables)
                return ({ filterEnables: { ...state.filterEnables, filterActive: validateFilters(state.filterEnables) } })
            })
        },
        resetFilterEnables: () => {
            set({
                filterEnables: {
                    filterActive: 0,
                    sector: 'disable',
                    modality: 'disable',
                    programType: 'disable',
                    academicType: 'disable'
                }
            })
        },
        selectModel: ({ modelSelected }) => {
            set({ modelSelected })
        },
        toogleModalModelSelectEnable: () => {
            const isModalModelSelectEnable = get().isModalModelSelectEnable
            set({ isModalModelSelectEnable: !isModalModelSelectEnable })
        }
    }),
    {
        name: 'chatBarStorage',
        storage: createJSONStorage(() => sessionStorage)
    }
))

const validateFilters = (filters) => {
    let filterActive = 0
    if (filters.modality !== 'disable') filterActive++
    if (filters.sector !== 'disable') filterActive++
    if (filters.programType !== 'disable') filterActive++
    return filterActive
}
