/**
 * Placeholder card matching ProductCard's shape, so the grid doesn't jump.
 *
 * Renders pulsing blocks in place of the image, title and price while a search
 * is in flight. Takes no props.
 */
export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="aspect-4/5 animate-pulse bg-tint" />
      <div className="flex items-start justify-between gap-3 px-4 py-4">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-tint" />
          <div className="h-3 w-2/5 animate-pulse rounded-full bg-tint" />
        </div>
        <div className="h-3 w-12 shrink-0 animate-pulse rounded-full bg-tint" />
      </div>
    </div>
  )
}
