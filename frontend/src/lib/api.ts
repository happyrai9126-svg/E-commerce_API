import axios from 'axios'

const TOKEN_KEY = 'noor.token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
})

/* --- Token storage -------------------------------------------------------
   Wrapped in try/catch: localStorage throws outright in some privacy modes. */

export function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function writeToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* Session-only auth is an acceptable fallback. */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* no-op */
  }
}

/* --- Interceptors -------------------------------------------------------- */

let onSessionExpired: (() => void) | null = null

/** Lets AuthProvider react when the backend rejects a stored token. */
export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler
}

api.interceptors.request.use((config) => {
  const token = readToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const url: string = error?.config?.url ?? ''

    // A 401 from the login endpoint means "wrong credentials", not "session
    // expired" — let the form surface it instead of tearing down the session.
    const isLoginAttempt = url.includes('/auth/login')

    if (status === 401 && !isLoginAttempt && readToken()) {
      clearToken()
      onSessionExpired?.()
    }
    return Promise.reject(error)
  },
)
