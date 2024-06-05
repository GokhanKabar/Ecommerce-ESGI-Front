import type { Product } from '@/types/products.types'
import type { Brand } from '@/types/brands.types'
import type { Family } from '@/types/families.types'

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`http://localhost:8000/products`)
  return response.json()
}

export const getMenProducts = async (): Promise<Product[]> => {
  const response = await fetch(`http://localhost:8000/products/men`)
  return response.json()
}

export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`http://localhost:8000/products/${id}`)
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du produit')
  }
  return response.json()
}

export const getBrandById = async (id: string): Promise<Brand> => {
  const response = await fetch(`http://localhost:8000/brands/${id}`)
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la marque')
  }
  return response.json()
}

export const getFamilyById = async (id: string): Promise<Family> => {
  const response = await fetch(`http://localhost:8000/families/${id}`)
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la famille')
  }
  return response.json()
}

export const getProductsByFamilyId = async (
  familyId: string,
  limit: number
): Promise<Product[]> => {
  const response = await fetch(`http://localhost:8000/products/family/${familyId}?limit=${limit}`)
  return response.json()
}
