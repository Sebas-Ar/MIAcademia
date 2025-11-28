import { create } from 'zustand'

export const useNavigationStore = create((set, get) => ({
    isNavigationModalEnable: false,
    isUpcomingFeaturesModalEnable: false,
    upconimgFeatureName: 'programas',
    isMoreOptionsFeaturesEnable: false,
    isShareModalEnable: false,
    toogleShareModal: () => {
        set({ isShareModalEnable: !get().isShareModalEnable })
    },
    toogleNavigationModal: () => {
        set({ isNavigationModalEnable: !get().isNavigationModalEnable })
    },
    toogleUpcomingFeaturesModal: () => {
        set({ isUpcomingFeaturesModalEnable: !get().isUpcomingFeaturesModalEnable })
    },
    setUpcomingFeaturesModalName: (name) => {
        set({ upconimgFeatureName: name })
    },
    toogleisMoreOptionsFeaturesEnable: () => {
        set({ isMoreOptionsFeaturesEnable: !get().isMoreOptionsFeaturesEnable })
    }
}))
