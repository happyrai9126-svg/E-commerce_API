import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Booting() {
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <span className="size-5 animate-spin rounded-full border-2 border-accent-ring border-t-accent" />
    </div>
  )
}

/** Sends signed-out visitors to /login, remembering where they were headed. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <Booting />
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

/** Keeps signed-in users off the login and signup pages. */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { status } = useAuth()

  if (status === 'loading') return <Booting />
  if (status === 'authenticated') return <Navigate to="/" replace />
  return <>{children}</>
}
