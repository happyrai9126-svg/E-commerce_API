import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { transitions } from '../../lib/motion'

/** Props for {@link TextField}; also accepts any native <input> prop but `id`. */
type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  /** Quiet helper text; hidden while an error is showing. */
  hint?: string
  error?: string
}

/**
 * Labelled text input used by every form in the app.
 *
 * Renders a label, the input, and a note line beneath that cross-fades between
 * the hint and the error. Password fields also get a Show/Hide toggle, whose
 * revealed state is the only state this component owns. Ids are generated with
 * useId so the label and note stay wired up without the caller supplying one.
 *
 * @param label - Text shown above the input.
 * @param hint - Quiet helper text; hidden while an error is showing.
 * @param error - Error message; also switches the input to its invalid styling.
 * @param type - Input type; `password` enables the reveal toggle.
 * @param className - Classes applied to the wrapping element, not the input.
 * @param props - Any remaining native <input> props, spread onto the input.
 */
export default function TextField({
  label,
  hint,
  error,
  type = 'text',
  className = '',
  ...props
}: TextFieldProps) {
  const id = useId()
  const [revealed, setRevealed] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && revealed ? 'text' : type

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13.5px] font-medium text-ink"
      >
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          id={id}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${id}-note` : undefined}
          className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-[15px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-faint focus:ring-4 ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
              : 'border-line focus:border-accent focus:ring-accent-soft'
          } ${isPassword ? 'pr-16' : ''}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md px-1.5 py-1 text-[12.5px] font-medium text-faint transition-colors duration-200 hover:text-accent"
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {(error || hint) && (
          <motion.p
            key={error ? 'error' : 'hint'}
            id={`${id}-note`}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={transitions.quick}
            className={`mt-1.5 text-[12.5px] leading-snug ${
              error ? 'text-red-600' : 'text-faint'
            }`}
          >
            {error || hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
