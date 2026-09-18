import { useContext } from 'react'
import { AuthContext } from '../context/auth-context'

/**
 * Access the authentication context.
 *
 * @returns The auth state and actions from <AuthProvider>: the current user,
 * loading/ready flags, and the login, signup and logout callbacks.
 * @throws If called outside an <AuthProvider> subtree.
 */
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return value
}
