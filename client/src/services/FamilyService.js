import Api from '@/services/Api'
import store from '../store/store'

const isAdmin = () => {
  const user = store.state.user
  return user && user.role === 'ADMIN'
}

export default {
  createFamily(familyData) {
    if (!isAdmin()) throw new Error('Unauthorized')
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
    if (!isAdmin()) throw new Error('Unauthorized')
    return Api().put(`families/${id}`, familyData)
  },
  deleteFamily(id) {
    if (!isAdmin()) throw new Error('Unauthorized')
    return Api().delete(`families/${id}`)
  }
}
