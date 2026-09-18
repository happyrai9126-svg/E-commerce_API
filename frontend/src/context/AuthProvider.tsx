import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  api,
  clearToken,
  readToken,
  setSessionExpiredHandler,
  writeToken,
} from '../lib/api'
import type { SignupPayload, TokenResponse, User } from '../types/api'
import { AuthContext } from './auth-context'
import type { AuthStatus } from './auth-context'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() =>
    readToken() ? 'loading' : 'anonymous',
  )
  const [sessionExpired, setSessionExpired] = useState(false)
  const navigate = useNavigate()
  // The first /users/Ecommerce call is a passive session restore, not
  // something the user asked for — a failure there shouldn't hijack the page.
  const bootstrapped = useRef(false)

  const fetchCurrentUser = useCallback(async () => {
    const { data } = await api.get<User>('/users/Ecommerce')
    setUser(data)
    setStatus('authenticated')
    return data
  }, [])

  /* Restore the session from a stored token on first paint. */
  useEffect(() => {
    if (!readToken()) return

    let cancelled = false
    fetchCurrentUser()
      .catch(() => {
        // The 401 interceptor already cleared the token.
        if (!cancelled) {
          setUser(null)
          setStatus('anonymous')
        }
      })
      .finally(() => {
        bootstrapped.current = true
      })

    return () => {
      cancelled = true
    }
  }, [fetchCurrentUser])

  /* Keep context in sync when a token is rejected mid-session. */
  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null)
      setStatus('anonymous')

      // Only announce and redirect once the app is past its initial restore,
      // so an old token doesn't bounce someone off the homepage unprompted.
      if (bootstrapped.current) {
        setSessionExpired(true)
        navigate('/login', { replace: true })
      }
    })
    return () => setSessionExpiredHandler(null)
  }, [navigate])

  const dismissSessionExpired = useCallback(() => setSessionExpired(false), [])

  const login = useCallback(
    async (username: string, password: string) => {
      // POST /auth/login is backed by OAuth2PasswordRequestForm, so it expects
      // form-urlencoded fields — not JSON.
      const form = new URLSearchParams()
      form.set('username', username)
      form.set('password', password)

      const { data } = await api.post<TokenResponse>('/auth/login', form)
      writeToken(data.access_token)
      setSessionExpired(false)

      try {
        await fetchCurrentUser()
      } catch (error) {
        // Token is unusable — don't leave a half-open session behind.
        clearToken()
        setUser(null)
        setStatus('anonymous')
        throw error
      }
    },
    [fetchCurrentUser],
  )

  const signup = useCallback(
    async (payload: SignupPayload) => {
      // POST /users/Ecommerce returns the created user but no token, so sign
      // the new account in straight away.
      await api.post<User>('/users/Ecommerce', payload)
      await login(payload.username, payload.strong_password)
    },
    [login],
  )

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('anonymous')
    setSessionExpired(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      signup,
      logout,
      sessionExpired,
      dismissSessionExpired,
    }),
    [user, status, login, signup, logout, sessionExpired, dismissSessionExpired],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
