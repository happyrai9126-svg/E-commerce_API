import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Centred spinner shown while the auth status is still `loading`, so a guard
 * never flashes the wrong screen during session restore.
 */
function Booting() {
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <span className="size-5 animate-spin rounded-full border-2 border-accent-ring border-t-accent" />
    </div>
  )
}

/**
 * Route guard that sends signed-out visitors to /login, remembering where they
 * were headed so the login page can send them back.
 *
 * Renders a spinner while the session is being restored, and otherwise renders
 * the protected page.
 *
 * @param children - The protected page to render for signed-in users.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <Booting />
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

/**
 * Route guard that keeps signed-in users off the login and signup pages by
 * sending them home.
 *
 * Renders a spinner while the session is being restored, and otherwise renders
 * the auth page.
 *
 * @param children - The login or signup page to render for signed-out visitors.
 */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { status } = useAuth()

  if (status === 'loading') return <Booting />
  if (status === 'authenticated') return <Navigate to="/" replace />
  return <>{children}</>
}
