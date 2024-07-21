import Api from '@/services/Api'
import store from '../store/store'

export default {
  async getAlerts(userId) {
    try {
      const response = await Api().get(`alerts/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async updateAlerts(userId, alerts) {
    try {
      const response = await Api().put(`alerts/${userId}`, alerts)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
