import { Link } from 'react-router-dom'

/** The three link columns rendered on the right-hand side of the footer. */
const columns = [
  {
    heading: 'Shop',
    links: [
      { label: 'All products', to: '/shop' },
      { label: 'Your cart', to: '/cart' },
      { label: 'Your orders', to: '/orders' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/careers' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'Returns', to: '/returns' },
    ],
  },
]

/**
 * Site-wide footer.
 *
 * Renders the brand mark and tagline alongside the Shop, Company and Legal
 * link columns, with a copyright line beneath. Takes no props.
 */
export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="shell py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-[9px] bg-accent">
                <span className="size-2 rounded-full bg-white" />
              </span>
              <span className="text-[17px] font-semibold tracking-tight text-ink">
                Noor
              </span>
            </Link>
            <p className="mt-3.5 text-[13.5px] leading-relaxed text-muted">
              A small, considered catalogue of things for the home.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-14">
            {columns.map((column) => (
              <div key={column.heading}>
                <h2 className="text-[12.5px] font-semibold tracking-[0.08em] text-ink uppercase">
                  {column.heading}
                </h2>
                <ul className="mt-3.5 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-[13.5px] text-muted transition-colors duration-200 hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-[12.5px] text-faint">
            © {new Date().getFullYear()} Noor. Placeholder storefront built on
            the E-Commerce API.
          </p>
        </div>
      </div>
    </footer>
  )
}
