import Api from '@/services/Api'
import store from '../store/store'

const isAdmin = () => {
  const user = store.state.user
  return user && user.role === 'ADMIN'
}

export default {
  async createOrder(orderData) {
    try {
      const response = await Api().post(`createOrder`, orderData)
      return response.data
    } catch (error) {
      console.error('Error creating Order:', error)
      throw error
    }
  },
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
  },
  async getOrderDetails(order_id) {
    try {
      const response = await Api().get(`getOrderDetails/${order_id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching Orders by user:', error)
      throw error
    }
  },
  async refundOrder(orderId) {
    try {
      // Fetch order details to get the paymentIntentId
      const response = await Api().get(`getOrder/${orderId}`)
      const order = response.data
      const payment_intent_id = order.payment_intent_id

      if (!payment_intent_id) {
        throw new Error('No payment intent ID found for this order.')
      }

      // Send refund request
      const refundResponse = await Api().post('/stripe/refund', {
        payment_intent_id
      })

      console.log('Refund successful:', refundResponse.data)
    } catch (error) {
      console.error('Erreur lors du remboursement :', error)
      throw error
    }
  },

  async updateOrder(orderId, orderData) {
    console.log('orderId:', orderId)
    console.log('orderData:', orderData)
    try {
      const response = await Api().put(`updateOrder/${orderId}`, orderData)
      return response.data
    } catch (error) {
      console.error('Error updating Order:', error)
      throw error
    }
  }
}
