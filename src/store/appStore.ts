import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark'
  user: {
    name: string
    email: string
  } | null
  isLoading: boolean
}

interface AppActions {
  setTheme: (theme: 'light' | 'dark') => void
  setUser: (user: { name: string; email: string } | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

type AppStore = AppState & AppActions

const initialState: AppState = {
  theme: 'light',
  user: null,
  isLoading: false,
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setTheme: (theme) => set({ theme }),
        setUser: (user) => set({ user }),
        setLoading: (isLoading) => set({ isLoading }),
        reset: () => set(initialState),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          theme: state.theme,
          user: state.user,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
)