import Api from '@/services/Api'
import store from '../store/store'

const isAdmin = () => {
  const user = store.state.user
  return user && user.role === 'ADMIN'
}

export default {
  createBrand(brandData) {
    if (!isAdmin()) throw new Error('Unauthorized')
    return Api().post('brands', brandData)
  },
  async getAllBrands() {
    try {
      const response = await Api().get('brands')
      return response.data
    } catch (error) {
      console.error('Error fetching brands:', error)
      throw error
    }
  },
  getBrandById(id) {
    return Api().get(`brands/${id}`)
  },
  updateBrand(id, brandData) {
    if (!isAdmin()) throw new Error('Unauthorized')
    return Api().put(`brands/${id}`, brandData)
  },
  deleteBrand(id) {
    if (!isAdmin()) throw new Error('Unauthorized')
    return Api().delete(`brands/${id}`)
  }
}
