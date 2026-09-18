import Hero from '../sections/Hero'
import PinnedStory from '../sections/PinnedStory'
import RevealShowcase from '../sections/RevealShowcase'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

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
