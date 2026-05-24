import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
  setStatus: (status) => set({ status }),
  reset: () => set({ user: null, status: 'unauthenticated' }),
}))

export default useAuthStore
