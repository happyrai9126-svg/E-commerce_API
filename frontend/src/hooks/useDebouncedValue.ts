import { useEffect, useState } from 'react'

/**
 * Returns `value` only after it has stopped changing for `delay` ms.
 *
 * Holds the last settled value in state and restarts a timer on every change,
 * so a fast-changing input (a search box) yields one value per pause.
 *
 * @param value - The rapidly changing value to debounce.
 * @param delay - Quiet period in milliseconds before the value is published.
 * @returns The most recent value that has held steady for `delay` ms.
 */
export function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])

  return debounced
}
