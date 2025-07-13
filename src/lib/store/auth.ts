import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth as authApi } from '@/lib/api'
import type { AuthResponse } from '@/lib/api'

interface User {
  id: string
  email: string
  username: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login({ email, password })
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message || 'Failed to login',
            isLoading: false,
          })
          throw error
        }
      },

      register: async (email: string, password: string, username: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.register({ email, password, username })
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message || 'Failed to register',
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        authApi.logout()
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 