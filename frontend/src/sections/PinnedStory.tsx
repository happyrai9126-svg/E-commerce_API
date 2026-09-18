import { useReducedMotion } from 'framer-motion'
import { Fragment, useEffect, useRef } from 'react'
import { ScrollTrigger, gsap, token, useGSAP } from '../lib/gsap'

const PHRASES = [
  'Fewer things, chosen well.',
  'Search that actually finds it.',
  'One tap from cart to done.',
  'Then it simply arrives.',
]

/** Scroll distance, per phrase, that the section stays pinned for. */
const SCROLL_PER_PHRASE = 100

export default function PinnedStory() {
  const root = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const phrases = useRef<(HTMLParagraphElement | null)[]>([])
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return

      const els = phrases.current.filter(Boolean) as HTMLParagraphElement[]
      if (els.length === 0 || !panel.current) return

      const fromColor = token('--color-faint', '#98a3b3')
      const toColor = token('--color-accent', '#2563eb')

      // Everything after the first phrase starts hidden.
      gsap.set(els.slice(1), { autoAlpha: 0, y: 28 })
      gsap.set(els[0], { autoAlpha: 1, y: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${els.length * SCROLL_PER_PHRASE}%`,
          pin: panel.current,
          // A little scrub smoothing keeps the colour sweep from feeling
          // twitchy on trackpads without decoupling it from the scrollbar.
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      els.forEach((el, i) => {
        const words = el.querySelectorAll<HTMLElement>('[data-word]')
        const at = i

        if (i > 0) {
          tl.to(el, { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power2.out' }, at)
        }

        // The scroll-tied part: words warm from muted grey to blue in sequence.
        tl.fromTo(
          words,
          { color: fromColor },
          {
            color: toColor,
            duration: 0.5,
            ease: 'none',
            stagger: { amount: 0.34 },
          },
          at + 0.12,
        )

        if (i < els.length - 1) {
          tl.to(
            el,
            { autoAlpha: 0, y: -28, duration: 0.28, ease: 'power2.in' },
            at + 0.74,
          )
        }
      })

      // Progress rule spans the full pin, so it has to be added last — once
      // the timeline's total duration is known.
      if (bar.current) {
        tl.fromTo(
          bar.current,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none', duration: tl.duration() },
          0,
        )
      }
    },
    { scope: root, dependencies: [reduced] },
  )

  // The page-transition wrapper animates a transform on mount, which can throw
  // off pin measurements taken mid-flight. One refresh after it settles.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 450)
    return () => window.clearTimeout(id)
  }, [])

  /* Reduced motion: no pin, no scrub — the phrases just stack and read. */
  if (reduced) {
    return (
      <section className="shell flex flex-col gap-10 py-28 text-center">
        {PHRASES.map((phrase) => (
          <p
            key={phrase}
            className="mx-auto max-w-3xl text-[2rem] leading-[1.1] font-semibold text-ink md:text-[2.75rem]"
          >
            {phrase}
          </p>
        ))}
      </section>
    )
  }

  return (
    <section ref={root} className="relative">
      <div
        ref={panel}
        className="relative flex h-dvh items-center justify-center overflow-hidden bg-base"
      >
        {/* Stays put while the phrases move through it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_50%_45%,var(--color-tint)_0%,transparent_72%)]"
        />

        <div className="shell relative grid place-items-center">
          {PHRASES.map((phrase, i) => (
            <p
              key={phrase}
              ref={(el) => {
                phrases.current[i] = el
              }}
              className="col-start-1 row-start-1 max-w-4xl text-center text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-balance md:text-[4rem]"
            >
              {phrase.split(' ').map((word, w) => (
                // The separating space sits outside the span: a trailing space
                // inside an inline-block collapses and words run together.
                <Fragment key={`${word}-${w}`}>
                  {w > 0 && ' '}
                  <span
                    data-word
                    className="inline-block text-faint will-change-[color,transform]"
                  >
                    {word}
                  </span>
                </Fragment>
              ))}
            </p>
          ))}
        </div>

        {/* Progress rule */}
        <div
          aria-hidden
          className="absolute bottom-14 h-px w-32 overflow-hidden bg-line"
        >
          <div ref={bar} className="h-full w-full origin-left bg-accent" />
        </div>
      </div>
    </section>
  )
}
