import type { SignupPayload } from '../types/api'

/**
 * Mirrors app/schemas/users.py so mistakes surface before a round trip.
 * The backend stays the authority — anything that slips past here comes back
 * as a 422 and renders through the same field-error path.
 *
 * One deliberate divergence: the schema allows a 5-character password
 * (`strong_password` is `min_length=5`), but we require 8. Stricter than the
 * server is safe — it can never cause a false rejection.
 */

const ALLOWED_EMAIL_DOMAINS = ['@gmail.com', '@outlook.com']

export const PASSWORD_MIN_LENGTH = 8

export type SignupField = keyof SignupPayload
export type FieldErrors = Partial<Record<SignupField, string>>

/** Validates one field, so errors can appear on blur rather than on submit. */
export function validateSignupField(
  field: SignupField,
  value: string,
): string | undefined {
  const trimmed = value.trim()

  switch (field) {
    case 'username':
      if (!trimmed) return 'Choose a username.'
      if (trimmed.length < 3 || trimmed.length > 15)
        return 'Between 3 and 15 characters.'
      return undefined

    case 'email':
      if (!trimmed) return 'Enter your email address.'
      if (!ALLOWED_EMAIL_DOMAINS.some((d) => trimmed.toLowerCase().endsWith(d)))
        return 'Must end with @gmail.com or @outlook.com.'
      return undefined

    case 'full_name':
      if (!trimmed) return 'Enter your full name.'
      if (trimmed.length < 3 || trimmed.length > 25)
        return 'Between 3 and 25 characters.'
      return undefined

    case 'phone_number':
      if (!trimmed) return 'Enter your phone number.'
      if (!/^\d+$/.test(trimmed)) return 'Digits only — no spaces or symbols.'
      if (trimmed.length < 10 || trimmed.length > 12)
        return 'Must be 10 to 12 digits.'
      return undefined

    case 'strong_password':
      if (!value) return 'Choose a password.'
      if (value.length < PASSWORD_MIN_LENGTH)
        return `At least ${PASSWORD_MIN_LENGTH} characters.`
      return undefined

    default:
      return undefined
  }
}

/**
 * Validate every field of a signup form at once, for submit-time checks.
 *
 * @param values - The full signup payload as currently typed.
 * @returns A map of field name to error message; empty when the form is valid.
 */
export function validateSignup(values: SignupPayload): FieldErrors {
  const errors: FieldErrors = {}
  for (const field of Object.keys(values) as SignupField[]) {
    const message = validateSignupField(field, values[field])
    if (message) errors[field] = message
  }
  return errors
}

/**
 * Validate one login field, so errors can appear on blur rather than on submit.
 *
 * @param field - Which login field to check.
 * @param value - The field's current value.
 * @returns An error message, or `undefined` when the field is acceptable.
 */
export function validateLoginField(
  field: 'username' | 'password',
  value: string,
): string | undefined {
  if (field === 'username' && !value.trim()) return 'Enter your username.'
  if (field === 'password' && !value) return 'Enter your password.'
  return undefined
}

/**
 * Validate both login fields at once, for submit-time checks.
 *
 * Only presence is checked here — credentials are the server's call, and a
 * wrong password comes back as a 401 rendered through the same banner.
 *
 * @param username - The username as typed.
 * @param password - The password as typed.
 * @returns A map of field name to error message; empty when both are filled in.
 */
export function validateLogin(username: string, password: string) {
  const errors: { username?: string; password?: string } = {}
  const u = validateLoginField('username', username)
  const p = validateLoginField('password', password)
  if (u) errors.username = u
  if (p) errors.password = p
  return errors
}

/**
 * Whether a field-errors object holds any entries.
 *
 * @param errors - A field-errors map from one of the validators above.
 * @returns `true` when at least one field failed validation.
 */
export const hasErrors = (errors: object) => Object.keys(errors).length > 0
