import type { Product } from '@/types/products.types'

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`http://localhost:8000/products`)
  return response.json()
}
