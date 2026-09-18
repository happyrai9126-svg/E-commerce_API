import { useRef } from 'react'
import { useBatchReveal } from '../../hooks/useBatchReveal'
import type { Product } from '../../types/api'
import ProductCard from './ProductCard'

/** Shared responsive grid classes, reused by the loading skeleton grid. */
export const GRID_CLASSES =
  'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4'

/**
 * Renders a responsive grid of {@link ProductCard}s.
 *
 * Cards reveal one at a time as they scroll into view via
 * {@link useBatchReveal}. Keys combine image URL and index because the search
 * endpoint returns no ids and can repeat an image.
 *
 * @param products - The products to lay out in the grid.
 */
export default function ProductGrid({ products }: { products: Product[] }) {
  const grid = useRef<HTMLUListElement>(null)
  useBatchReveal(grid, '[data-card]', [products])

  return (
    <ul ref={grid} className={GRID_CLASSES}>
      {products.map((product, i) => (
        <li key={`${product.image_url}-${i}`} data-card>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
