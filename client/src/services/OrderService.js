import Api from '@/services/Api'
import store from '../store/store'


const isAdmin = () => {
  const user = store.state.user
  return user && user.role === 'ADMIN'
}

export default {
async getOrderByUser(user_id) {
    try {
      const response = await Api().get(`getOrderByUser/${user_id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching Orders by user:', error)
      throw error
    }
  },
  async getAllOrders() {
    try {
      const response = await Api().get(`getAllOrders`)
      return response.data
    } catch (error) {
      console.error('Error fetching Orders by user:', error)
      throw error
    }
  }
}

