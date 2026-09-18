import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { transitions } from '../../lib/motion'

// HTMLMotionProps rather than ButtonHTMLAttributes: React's native drag and
// animation handlers collide with Framer Motion's props of the same name.
type ButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  loading?: boolean
  fullWidth?: boolean
}

const styles = {
  primary:
    'bg-accent text-white shadow-[0_1px_2px_rgba(37,99,235,0.3),0_8px_24px_-14px_rgba(37,99,235,0.7)] hover:bg-accent-hover',
  secondary:
    'border border-line-strong bg-surface text-ink hover:border-accent-ring hover:text-accent',
}

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
