/**
 * The API serialises datetimes without a timezone offset (e.g.
 * "2026-08-31T19:58:34"), which JavaScript parses as local time. That matches
 * a server running in the same zone as the viewer; it will drift otherwise.
 */
function toDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

/** "31 August 2026" */
export function formatDate(value: string) {
  const date = toDate(value)
  return date ? dateFormatter.format(date) : '—'
}

/** "31 August 2026 at 7:58 PM" */
export function formatDateTime(value: string) {
  const date = toDate(value)
  if (!date) return '—'
  return `${dateFormatter.format(date)} at ${timeFormatter.format(date)}`
}
