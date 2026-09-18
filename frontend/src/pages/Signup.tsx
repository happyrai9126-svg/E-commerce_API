import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import FormBanner from '../components/ui/FormBanner'
import TextField from '../components/ui/TextField'
import { useAuth } from '../hooks/useAuth'
import { parseApiError } from '../lib/errors'
import {
  PASSWORD_MIN_LENGTH,
  hasErrors,
  validateSignup,
  validateSignupField,
} from '../lib/validation'
import type { SignupPayload } from '../types/api'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/** Blank form state; also fixes the order the fields are rendered in. */
const EMPTY: SignupPayload = {
  full_name: '',
  username: '',
  email: '',
  phone_number: '',
  strong_password: '',
}

/**
 * Account creation page at `/signup`.
 *
 * Renders the full signup form inside {@link AuthLayout}, with a banner above
 * the fields for server errors. Owns the form values, per-field errors and
 * submitting state; validation mirrors the backend schema so most mistakes
 * surface before a round trip. A successful signup also signs the user in and
 * sends them home. Takes no props.
 */
export default function Signup() {
  useDocumentTitle('Create account')

  const { signup } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState<SignupPayload>(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [banner, setBanner] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  /**
   * Record a keystroke, re-checking the field live once it is showing an error
   * so the message clears as soon as the input becomes valid.
   */
  function update(field: keyof SignupPayload, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))

    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      // Once a field is showing an error, re-check on every keystroke so the
      // message clears the moment it's fixed.
      const message = validateSignupField(field, value)
      const next = { ...prev }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  /** Validate as the user leaves a field, rather than only on submit. */
  function handleBlur(field: keyof SignupPayload) {
    const message = validateSignupField(field, values[field])
    setFieldErrors((prev) => {
      const next = { ...prev }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  /**
   * Validate locally, then create the account and redirect home.
   *
   * Values are trimmed before being sent (the password deliberately is not).
   * Local failures stop the submit; server failures fill the banner and any
   * field errors the API reported.
   */
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const localErrors = validateSignup(values)
    setFieldErrors(localErrors as Record<string, string>)
    setBanner(null)
    if (hasErrors(localErrors)) return

    setSubmitting(true)
    try {
      await signup({
        full_name: values.full_name.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        phone_number: values.phone_number.trim(),
        strong_password: values.strong_password,
      })
      navigate('/', { replace: true })
    } catch (error) {
      const { message, fieldErrors: apiFieldErrors } = parseApiError(
        error,
        'Could not create your account. Please try again.',
      )
      setBanner(message)
      setFieldErrors(apiFieldErrors)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="A few details and you're browsing."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-accent transition-opacity duration-200 hover:opacity-75"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormBanner message={banner} />

        <div className="flex flex-col gap-4">
          <TextField
            label="Full name"
            name="full_name"
            autoComplete="name"
            placeholder="Happy Rai"
            value={values.full_name}
            error={fieldErrors.full_name}
            onChange={(e) => update('full_name', e.target.value)}
            onBlur={() => handleBlur('full_name')}
          />

          <TextField
            label="Username"
            name="username"
            autoComplete="username"
            placeholder="happy123"
            hint="3–15 characters."
            value={values.username}
            error={fieldErrors.username}
            onChange={(e) => update('username', e.target.value)}
            onBlur={() => handleBlur('username')}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="happy@gmail.com"
            hint="Must end with @gmail.com or @outlook.com."
            value={values.email}
            error={fieldErrors.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={() => handleBlur('email')}
          />

          <TextField
            label="Phone number"
            name="phone_number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9812345678"
            hint="Digits only, 10–12 of them."
            value={values.phone_number}
            error={fieldErrors.phone_number}
            onChange={(e) => update('phone_number', e.target.value)}
            onBlur={() => handleBlur('phone_number')}
          />

          <TextField
            label="Password"
            name="strong_password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
            value={values.strong_password}
            error={fieldErrors.strong_password}
            onChange={(e) => update('strong_password', e.target.value)}
            onBlur={() => handleBlur('strong_password')}
          />
        </div>

        <Button type="submit" loading={submitting} fullWidth className="mt-6">
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
