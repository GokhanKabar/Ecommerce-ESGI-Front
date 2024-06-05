import type { Brand } from '@/types/brands.types'

export const getBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`http://localhost:8000/brands`)
  return response.json()
}
