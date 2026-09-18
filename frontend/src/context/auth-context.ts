import { createContext } from 'react'
import type { SignupPayload, User } from '../types/api'

/**
 * Where the session currently stands: `loading` while a stored token is being
 * restored, then `authenticated` or `anonymous`.
 */
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

/** The auth state and actions <AuthProvider> exposes through useAuth(). */
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

/**
 * Auth context, `null` until an <AuthProvider> supplies a value — which is why
 * useAuth() throws when called outside the provider.
 */
export const AuthContext = createContext<AuthContextValue | null>(null)
