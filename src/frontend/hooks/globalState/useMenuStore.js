import { create } from 'zustand'

export const useMenuStore = create((set, get) => ({
    isMenuActive: false,
    optionSelected: 0,
    toogleMenu: () => set({ isMenuActive: !get().isMenuActive }),
    selectOpion: (opt) => set({ optionSelected: opt })
}))
