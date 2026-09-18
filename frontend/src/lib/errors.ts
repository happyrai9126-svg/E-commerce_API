/**
 * Normalises axios/FastAPI errors into a single shape the forms can render.
 */
import { isAxiosError } from 'axios'

export type ApiError = {
  /** Message safe to show in a banner. */
  message: string
  /** Field-name → message, keyed to match the backend's schema field names. */
  fieldErrors: Record<string, string>
}

/** Pydantic v2 prefixes custom validator failures; the prefix is noise here. */
function tidy(msg: string) {
  return msg.replace(/^Value error,\s*/i, '').trim()
}

/**
 * FastAPI reports failures two ways:
 *   - HTTPException  → { detail: "Username or email already taken." }
 *   - 422 validation → { detail: [{ loc: ["body", "email"], msg, type }, ...] }
 * Both are flattened into one shape the forms can consume.
 */
export function parseApiError(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): ApiError {
  if (!isAxiosError(error)) {
    return { message: fallback, fieldErrors: {} }
  }

  if (!error.response) {
    return {
      message:
        'Could not reach the server. Check that the API is running, then try again.',
      fieldErrors: {},
    }
  }

  const detail = error.response.data?.detail

  if (typeof detail === 'string' && detail.trim()) {
    return { message: tidy(detail), fieldErrors: {} }
  }

  if (Array.isArray(detail)) {
    const fieldErrors: Record<string, string> = {}

    for (const item of detail) {
      // loc looks like ["body", "email"]; the last entry is the field name.
      const field = Array.isArray(item?.loc) ? String(item.loc.at(-1)) : ''
      const msg = tidy(String(item?.msg ?? ''))
      if (field && msg && !fieldErrors[field]) {
        fieldErrors[field] = msg
      }
    }

    const first = Object.values(fieldErrors)[0]
    return {
      message: first ?? 'Please check the highlighted fields.',
      fieldErrors,
    }
  }

  return { message: fallback, fieldErrors: {} }
}
