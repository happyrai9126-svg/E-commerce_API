import { useRef } from 'react'
import { useBatchReveal } from '../../hooks/useBatchReveal'
import type { Product } from '../../types/api'
import ProductCard from './ProductCard'

export const GRID_CLASSES =
  'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4'

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
