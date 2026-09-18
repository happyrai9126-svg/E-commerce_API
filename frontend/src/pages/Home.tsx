import Hero from '../sections/Hero'
import PinnedStory from '../sections/PinnedStory'
import RevealShowcase from '../sections/RevealShowcase'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/**
 * Landing page at `/`.
 *
 * Stacks the {@link Hero}, {@link PinnedStory} and {@link RevealShowcase}
 * sections and sets the default document title. Takes no props.
 */
export default function Home() {
  useDocumentTitle()

  return (
    <>
      <Hero />
      <PinnedStory />
      <RevealShowcase />
    </>
  )
}
