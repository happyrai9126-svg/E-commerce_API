import { motion } from 'framer-motion'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import FormBanner from '../components/ui/FormBanner'
import TextField from '../components/ui/TextField'
import { useAuth } from '../hooks/useAuth'
import { parseApiError } from '../lib/errors'
import { hasErrors, validateLogin, validateLoginField } from '../lib/validation'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/**
 * Sign-in page at `/login`.
 *
 * Renders the username and password fields inside {@link AuthLayout}, with a
 * banner above them for server errors and for the "your session expired"
 * notice. Owns the form values, per-field errors and submitting state. On
 * success it returns the user to the page that sent them here, or home.
 * Takes no props.
 */
export default function Login() {
  useDocumentTitle('Sign in')

  const { login, sessionExpired, dismissSessionExpired } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [values, setValues] = useState({ username: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [banner, setBanner] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? '/'

  /** Record a keystroke and drop any error currently shown on that field. */
  function update(field: 'username' | 'password', value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  /** Validate as the user leaves a field, rather than only on submit. */
  function handleBlur(field: 'username' | 'password') {
    const message = validateLoginField(field, values[field])
    setFieldErrors((prev) => {
      const next = { ...prev }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  /**
   * Validate locally, then sign in and redirect.
   *
   * Local failures stop the submit and mark the fields; server failures fill
   * the banner and any field errors the API reported.
   */
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const localErrors = validateLogin(values.username, values.password)
    setFieldErrors(localErrors)
    setBanner(null)
    dismissSessionExpired()
    if (hasErrors(localErrors)) return

    setSubmitting(true)
    try {
      await login(values.username.trim(), values.password)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const { message, fieldErrors: apiFieldErrors } = parseApiError(
        error,
        'Could not sign you in. Please try again.',
      )
      setBanner(message)
      setFieldErrors(apiFieldErrors)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <>
          New here?{' '}
          <Link
            to="/signup"
            className="font-medium text-accent transition-opacity duration-200 hover:opacity-75"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {sessionExpired && !banner && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="mb-5 rounded-xl border border-accent-ring bg-accent-soft px-3.5 py-2.5 text-[13.5px] leading-snug text-accent"
          >
            Your session expired, please sign in again.
          </motion.p>
        )}

        <FormBanner message={banner} />

        <div className="flex flex-col gap-4">
          <TextField
            label="Username"
            name="username"
            autoComplete="username"
            placeholder="happy123"
            value={values.username}
            error={fieldErrors.username}
            onChange={(e) => update('username', e.target.value)}
            onBlur={() => handleBlur('username')}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            error={fieldErrors.password}
            onChange={(e) => update('password', e.target.value)}
            onBlur={() => handleBlur('password')}
          />
        </div>

        <Button type="submit" loading={submitting} fullWidth className="mt-6">
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  )
}
