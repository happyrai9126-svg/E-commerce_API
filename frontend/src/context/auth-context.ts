import { createContext } from 'react'
import type { SignupPayload, User } from '../types/api'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export type AuthContextValue = {
  user: User | null
  status: AuthStatus
  login: (username: string, password: string) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  logout: () => void
  /** True when a stored token was rejected mid-session. */
  sessionExpired: boolean
  dismissSessionExpired: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
