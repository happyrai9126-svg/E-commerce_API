import { AnimatePresence, motion } from 'framer-motion'
import { transitions } from '../../lib/motion'

/** Props for {@link SearchField}. */
type SearchFieldProps = {
  value: string
  onChange: (value: string) => void
  busy?: boolean
}

/**
 * Rounded search input with a magnifier icon, a spinner while a search is in
 * flight, and a Clear button once there is text.
 *
 * Fully controlled — it holds no state and reports every keystroke through
 * `onChange`; debouncing is the caller's concern.
 *
 * @param value - The current query text.
 * @param onChange - Called with the new query on every keystroke, and with "" when Clear is pressed.
 * @param busy - Shows the spinner while a request is in flight.
 */
export default function SearchField({ value, onChange, busy }: SearchFieldProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-faint"
      >
        <svg viewBox="0 0 20 20" fill="none" className="size-4.5">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="m13.5 13.5 3 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for anything — ceramics, sneakers, desks…"
        aria-label="Search products"
        // The native clear affordance would sit under our own controls.
        className="w-full rounded-full border border-line bg-surface py-3.5 pr-24 pl-11 text-[15px] text-ink shadow-[0_1px_2px_rgba(13,21,33,0.03)] transition-[border-color,box-shadow] duration-200 placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent-soft [&::-webkit-search-cancel-button]:appearance-none"
      />

      <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
        <AnimatePresence initial={false}>
          {busy && (
            <motion.span
              key="busy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={transitions.quick}
              className="size-4 animate-spin rounded-full border-2 border-accent-ring border-t-accent"
            />
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {value && (
            <motion.button
              key="clear"
              type="button"
              onClick={() => onChange('')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitions.quick}
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-muted transition-colors duration-200 hover:bg-accent-soft hover:text-accent"
            >
              Clear
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
