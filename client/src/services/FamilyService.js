import Api from '@/services/Api'
import { isAdmin,isStoreKeeper } from '../store/roleManagement';


export default {
  createFamily(familyData) {
    if (!isAdmin() && !isStoreKeeper()) throw new Error('Unauthorized')
    return Api().post('families', familyData)
  },
  async getAllFamilies() {
    try {
      const response = await Api().get('families')
      return response.data
    } catch (error) {
      console.error('Error fetching families:', error)
      throw error
    }
  },
  async getAllFamiliesAdmin() {
    try {
      const response = await Api().get('familiesall')
      return response.data
    } catch (error) {
      console.error('Error fetching families:', error)
      throw error
    }
  },
  getFamilyById(id) {
    return Api().get(`families/${id}`)
  },
  updateFamily(id, familyData) {
    if (!isAdmin() && !isStoreKeeper()) throw new Error('Unauthorized')
    return Api().put(`families/${id}`, familyData)
  },
  deleteFamily(id) {
    if (!isAdmin() && !isStoreKeeper()) throw new Error('Unauthorized')
    return Api().delete(`families/${id}`)
  }
}
