import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { revealViewport, transitions } from '../lib/motion'

const variants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...transitions.soft, delay },
  }),
}

type RevealProps = {
  children: ReactNode
  /** Seconds to hold before the reveal starts. */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}

/**
 * Reveals its children once they scroll into view. Use for anything below
 * the fold; above-the-fold entrances animate on mount instead.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: RevealProps) {
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      custom={delay}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
    >
      {children}
    </Tag>
  )
}
