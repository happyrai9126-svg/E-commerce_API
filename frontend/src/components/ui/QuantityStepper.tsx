import { AnimatePresence, motion } from 'framer-motion'
import { transitions } from '../../lib/motion'

/** Props for {@link QuantityStepper}. */
type QuantityStepperProps = {
  value: number
  onChange: (next: number) => void
  /** Called instead of onChange when "-" is pressed at 1. */
  onDecrementBelowMin?: () => void
  size?: 'sm' | 'md'
  disabled?: boolean
  busy?: boolean
  label?: string
}

/** Per-size height and track widths for the wrapper, buttons and value. */
const sizes = {
  sm: { wrap: 'h-9', button: 'w-8 text-[15px]', value: 'w-6 text-[13.5px]' },
  md: { wrap: 'h-10', button: 'w-9 text-[16px]', value: 'w-8 text-[14.5px]' },
}

/**
 * Rounded "− n +" control for picking a quantity.
 *
 * Renders a decrement button, the current value (which slides as it changes),
 * and an increment button. The value is fully controlled by the caller; this
 * component keeps no state of its own.
 *
 * @param value - The current quantity to display.
 * @param onChange - Called with the new quantity when either button is pressed.
 * @param onDecrementBelowMin - Called instead of onChange when "−" is pressed at 1;
 *   without it, 1 is the floor and "−" is disabled there.
 * @param size - `sm` or `md` sizing preset.
 * @param disabled - Dims the control and blocks both buttons.
 * @param busy - Blocks both buttons while a change is in flight, without dimming.
 * @param label - Accessible group label; defaults to "Quantity".
 */
export default function QuantityStepper({
  value,
  onChange,
  onDecrementBelowMin,
  size = 'sm',
  disabled = false,
  busy = false,
  label = 'Quantity',
}: QuantityStepperProps) {
  const s = sizes[size]
  // At 1 the "-" is only pressable if the caller has somewhere for it to go
  // (the cart removes the row); otherwise 1 is the floor.
  const canDecrement = !disabled && (value > 1 || Boolean(onDecrementBelowMin))

  /** Step down by one, or hand off to the caller when already at the floor. */
  function decrement() {
    if (value > 1) onChange(value - 1)
    else onDecrementBelowMin?.()
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex ${s.wrap} shrink-0 items-center rounded-full border border-line bg-surface ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={!canDecrement || busy}
        aria-label="Decrease quantity"
        className={`${s.button} grid h-full place-items-center rounded-l-full text-muted transition-colors duration-200 hover:text-accent disabled:cursor-not-allowed disabled:text-faint disabled:hover:text-faint`}
      >
        −
      </button>

      <span
        aria-live="polite"
        className={`${s.value} grid place-items-center text-center font-medium text-ink tabular-nums`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={transitions.quick}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || busy}
        aria-label="Increase quantity"
        className={`${s.button} grid h-full place-items-center rounded-r-full text-muted transition-colors duration-200 hover:text-accent disabled:cursor-not-allowed disabled:text-faint disabled:hover:text-faint`}
      >
        +
      </button>
    </div>
  )
}
