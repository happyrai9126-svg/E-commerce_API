import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { transitions } from '../../lib/motion'

// HTMLMotionProps rather than ButtonHTMLAttributes: React's native drag and
// animation handlers collide with Framer Motion's props of the same name.
/** Props for {@link Button}; also accepts any motion <button> prop. */
type ButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  loading?: boolean
  fullWidth?: boolean
}

/** Per-variant colour and shadow classes. */
const styles = {
  primary:
    'bg-accent text-white shadow-[0_1px_2px_rgba(37,99,235,0.3),0_8px_24px_-14px_rgba(37,99,235,0.7)] hover:bg-accent-hover',
  secondary:
    'border border-line-strong bg-surface text-ink hover:border-accent-ring hover:text-accent',
}

/**
 * The app's pill-shaped button.
 *
 * Renders its children in a rounded button that lifts slightly on hover, with
 * an optional spinner in front of the label while `loading`. A loading button
 * is disabled, so it cannot be double-submitted.
 *
 * @param children - The button label.
 * @param variant - `primary` for the filled accent style, `secondary` for the outlined one.
 * @param loading - Shows a spinner and disables the button.
 * @param fullWidth - Stretches the button to fill its container.
 * @param disabled - Disables the button and suppresses its hover motion.
 * @param className - Extra classes appended after the variant styles.
 * @param props - Any remaining motion <button> props, spread onto the element.
 */
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      {...props}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { y: -1 }}
      whileTap={isDisabled ? undefined : { y: 0 }}
      transition={transitions.quick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
        styles[variant]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <motion.span
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
          className="size-3.5 rounded-full border-2 border-current border-t-transparent opacity-70"
        />
      )}
      {children}
    </motion.button>
  )
}
