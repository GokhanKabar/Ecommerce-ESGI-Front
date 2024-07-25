import Api from '@/services/Api'
import { isAdmin,isStoreKeeper } from '../store/roleManagement';


export default {
  createBrand(brandData) {
    if (!isAdmin() && !isStoreKeeper()) throw new Error('Unauthorized')
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
  async getAllBrandsAdmin() {
    try {
      const response = await Api().get('brandsall')
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
    if (!isAdmin() && !isStoreKeeper()) throw new Error('Unauthorized')
    return Api().put(`brands/${id}`, brandData)
  },
  deleteBrand(id) {
    if (!isAdmin() && !isStoreKeeper()) throw new Error('Unauthorized')
    return Api().delete(`brands/${id}`)
  }
}
