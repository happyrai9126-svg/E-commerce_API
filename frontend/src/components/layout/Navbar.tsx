import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { transitions } from '../../lib/motion'

/** Every entry must resolve to a real route — anything else lands on the 404. */
const publicLinks = [{ label: 'Shop', to: '/shop' }]
const signedInLinks = [{ label: 'Orders', to: '/orders' }]

function initialOf(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function firstNameOf(name: string) {
  return name.trim().split(/\s+/)[0] || name
}


/** Cart icon with a live item-count badge. */
function CartLink({ count, onClick }: { count: number; onClick?: () => void }) {
  return (
    <Link
      to="/cart"
      onClick={onClick}
      aria-label={count > 0 ? `Cart, ${count} items` : 'Cart'}
      className="relative grid size-9 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-accent-soft hover:text-accent"
    >
      <svg viewBox="0 0 20 20" fill="none" className="size-4.5">
        <path
          d="M3 4h2l1.6 8.2a1.5 1.5 0 0 0 1.5 1.2h6.1a1.5 1.5 0 0 0 1.5-1.2L17 7H6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="16.5" r="1" fill="currentColor" />
        <circle cx="14.5" cy="16.5" r="1" fill="currentColor" />
      </svg>

      <AnimatePresence initial={false}>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={transitions.quick}
            className="absolute -top-0.5 -right-0.5 grid min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[10.5px] leading-4.5 font-semibold text-white tabular-nums"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}


const accountLinks = [
  { label: 'Orders', to: '/orders' },
  { label: 'Profile', to: '/profile' },
]

/** Avatar + name that opens a small account menu. */
function AccountMenu({
  fullName,
  initial,
  onSignOut,
}: {
  fullName: string
  initial: string
  onSignOut: () => void
}) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 transition-colors duration-200 hover:bg-accent-soft"
      >
        <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent">
          {initial}
        </span>
        <span className="text-[14.5px] font-medium text-ink">{fullName}</span>
        <motion.svg
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={transitions.quick}
          className="size-3 text-faint"
        >
          <path
            d="m3 4.5 3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={transitions.quick}
            className="absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-[0_1px_2px_rgba(13,21,33,0.04),0_16px_40px_-24px_rgba(13,21,33,0.28)]"
          >
            {accountLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-[14px] font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-accent-soft text-accent'
                      : 'text-muted hover:bg-tint hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="my-1 h-px bg-line" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onSignOut()
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-[14px] font-medium text-muted transition-colors duration-200 hover:bg-tint hover:text-ink"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const { user, status, logout } = useAuth()
  const { count } = useCart()

  const links = user ? [...publicLinks, ...signedInLinks] : publicLinks
  const navigate = useNavigate()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  function handleSignOut() {
    logout()
    setMenuOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitions.soft}
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-b border-line bg-surface/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="shell flex h-18 items-center justify-between gap-8">
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid size-7 place-items-center rounded-[9px] bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
            <span className="size-2 rounded-full bg-white" />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-ink">
            Noor
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className="group relative text-[14.5px] font-medium"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-colors duration-200 ${
                        isActive
                          ? 'text-accent'
                          : 'text-muted group-hover:text-ink'
                      }`}
                    >
                      {link.label}
                    </span>
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop account area */}
        <div className="hidden h-9 items-center gap-2 md:flex">
          <CartLink count={count} />
          <AnimatePresence mode="wait" initial={false}>
            {status === 'loading' ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transitions.quick}
                className="size-4 animate-spin rounded-full border-2 border-line-strong border-t-accent"
              />
            ) : user ? (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={transitions.quick}
                className="flex items-center gap-3"
              >
                <AccountMenu
                  fullName={firstNameOf(user.full_name)}
                  initial={initialOf(user.full_name)}
                  onSignOut={handleSignOut}
                />
              </motion.div>
            ) : (
              <motion.div
                key="guest"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={transitions.quick}
                className="flex items-center gap-2"
              >
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-[14.5px] font-medium text-muted transition-colors duration-200 hover:bg-accent-soft hover:text-accent"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-accent px-4.5 py-2 text-[14.5px] font-medium text-white shadow-[0_1px_2px_rgba(37,99,235,0.28)] transition-colors duration-200 hover:bg-accent-hover"
                >
                  Create account
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <CartLink count={count} onClick={() => setMenuOpen(false)} />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex size-9 flex-col items-center justify-center gap-1.5 rounded-full transition-colors duration-200 hover:bg-accent-soft md:hidden"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            transition={transitions.quick}
            className="block h-px w-4.5 bg-ink"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            transition={transitions.quick}
            className="block h-px w-4.5 bg-ink"
          />
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transitions.quick}
            className="overflow-hidden border-t border-line bg-surface md:hidden"
          >
            <ul className="shell flex flex-col gap-1 py-4">
              {publicLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-2 py-2.5 text-[15px] font-medium text-muted transition-colors hover:bg-tint hover:text-ink"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}

              {user &&
                accountLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-2 py-2.5 text-[15px] font-medium text-muted transition-colors hover:bg-tint hover:text-ink"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}

              {user ? (
                <li className="mt-2 flex items-center justify-between gap-3 border-t border-line px-2 pt-4">
                  <span className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent">
                      {initialOf(user.full_name)}
                    </span>
                    <span className="text-[15px] font-medium text-ink">
                      {firstNameOf(user.full_name)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-full border border-line-strong px-4 py-2 text-[14.5px] font-medium text-ink"
                  >
                    Sign out
                  </button>
                </li>
              ) : (
                <li className="mt-2 flex gap-2 border-t border-line px-2 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-full border border-line-strong py-2.5 text-center text-[15px] font-medium text-ink"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-full bg-accent py-2.5 text-center text-[15px] font-medium text-white"
                  >
                    Create account
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
