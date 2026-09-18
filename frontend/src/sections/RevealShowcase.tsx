import ScrollReveal from '../components/ScrollReveal'

/**
 * Example usage of the reusable word-by-word reveal. The same <ScrollReveal>
 * drops onto any headline or paragraph on Shop, Cart, Collections, Journal —
 * no per-page setup.
 */
export default function RevealShowcase() {
  return (
    <section className="shell py-28 md:py-36">
      <div className="mx-auto max-w-2xl text-center">
        <ScrollReveal
          as="p"
          className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase"
        >
          How it works
        </ScrollReveal>

        <ScrollReveal
          as="h2"
          className="mt-5 text-[2rem] leading-[1.12] font-semibold md:text-[2.75rem]"
        >
          Search first. Everything else follows.
        </ScrollReveal>

        <ScrollReveal
          as="p"
          className="mt-6 text-[17px] leading-relaxed text-muted text-pretty"
        >
          Type what you are after and the catalogue answers as you go — no
          filters to configure, no categories to drill through. Add what you
          like to a cart that remembers it, or buy it outright in a single tap.
          Nothing here is trying to keep you on the page longer than you meant
          to stay.
        </ScrollReveal>
      </div>
    </section>
  )
}
