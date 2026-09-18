import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import { useAuth } from '../hooks/useAuth'
import { formatDate } from '../lib/format'
import { fadeUp, stagger, transitions } from '../lib/motion'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/**
 * Account details page at `/profile`.
 *
 * Renders the signed-in user's name, username, email, phone number and join
 * date as a read-only list — there is no update endpoint to edit them through.
 * Reads straight from the auth context rather than re-fetching, and falls back
 * to a sign-in prompt in the case <RequireAuth> should already prevent. Takes
 * no props.
 */
export default function Profile() {
  useDocumentTitle('Profile')

  // RequireAuth guarantees a user here, and AuthProvider already holds the
  // exact GET /users/Ecommerce payload this page needs — no second request.
  const { user } = useAuth()

  // RequireAuth should make this unreachable; render something rather than a
  // blank screen if it ever isn't.
  if (!user) {
    return (
      <div className="shell grid min-h-[60dvh] place-items-center text-center">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">
            Couldn't load your profile
          </h1>
          <Link
            to="/login"
            className="mt-4 inline-flex rounded-full bg-accent px-5 py-2.5 text-[14.5px] font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
          >
            Sign in again
          </Link>
        </div>
      </div>
    )
  }

  // The read-only rows rendered in the details card, in display order.
  const fields = [
    { label: 'Full name', value: user.full_name },
    { label: 'Username', value: user.username },
    { label: 'Email', value: user.email },
    { label: 'Phone number', value: user.phone_number },
    { label: 'Member since', value: formatDate(user.created_at) },
  ]

  return (
    <section className="relative overflow-hidden">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transitions.soft}
        className="pointer-events-none absolute inset-x-0 -top-44 h-[26rem] bg-[radial-gradient(55%_55%_at_50%_0%,var(--color-accent-soft)_0%,transparent_70%)]"
      />

      <div className="shell relative pt-20 pb-28 md:pt-24">
        <header className="mx-auto max-w-2xl text-center">
          <ScrollReveal
            as="p"
            className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase"
          >
            Profile
          </ScrollReveal>
          <ScrollReveal
            as="h1"
            className="mt-4 text-[2.25rem] leading-[1.1] font-semibold md:text-[3rem]"
          >
            Your account.
          </ScrollReveal>
        </header>

        <motion.div
          variants={stagger(0.07, 0.05)}
          initial="hidden"
          animate="show"
          className="mx-auto mt-12 max-w-xl"
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-6"
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-accent-soft text-[20px] font-semibold text-accent">
              {user.full_name.trim().charAt(0).toUpperCase() || '?'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[18px] font-semibold text-ink">
                {user.full_name}
              </p>
              <p className="mt-0.5 truncate text-[14px] text-muted">
                @{user.username}
              </p>
            </div>

            <span
              className={`ml-auto shrink-0 rounded-full px-3 py-1 text-[12.5px] font-medium ${
                user.is_active
                  ? 'bg-accent-soft text-accent'
                  : 'bg-tint text-faint'
              }`}
            >
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface"
          >
            {fields.map((field, i) => (
              <div
                key={field.label}
                className={`flex items-baseline justify-between gap-6 px-6 py-4 ${
                  i > 0 ? 'border-t border-line' : ''
                }`}
              >
                <dt className="shrink-0 text-[13.5px] text-faint">
                  {field.label}
                </dt>
                <dd className="min-w-0 truncate text-right text-[14.5px] font-medium text-ink">
                  {field.value}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-center text-[12.5px] text-faint"
          >
            Editing your details isn't available yet.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex gap-2">
            <Link
              to="/orders"
              className="flex-1 rounded-full bg-accent py-2.5 text-center text-[14.5px] font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              View orders
            </Link>
            <Link
              to="/cart"
              className="flex-1 rounded-full border border-line-strong py-2.5 text-center text-[14.5px] font-medium text-ink transition-colors duration-200 hover:border-accent-ring hover:text-accent"
            >
              View cart
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
