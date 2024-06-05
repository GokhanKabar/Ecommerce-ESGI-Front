import type { Family } from '@/types/families.types'

export const getFamilies = async (): Promise<Family[]> => {
  const response = await fetch(`http://localhost:8000/families`)
  return response.json()
}
