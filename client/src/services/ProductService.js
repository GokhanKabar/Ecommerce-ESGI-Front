import Api from '@/services/Api'
import store from '../store/store'

const isAdmin = () => {
  const user = store.state.user
  return user && user.role === 'admin'
}

export default {
  createProduct(productData) {
    if (!isAdmin()) throw new Error('Unauthorized')
    return Api().post('products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  async getAllProducts() {
    try {
      const response = await Api().get('/products')
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },
  async getMenProducts() {
    try {
      const response = await Api().get('/products/men')
      return response.data
    } catch (error) {
      console.error('Error fetching men products:', error)
      throw error
    }
  },
  async getWomenProducts() {
    try {
      const response = await Api().get('/products/women')
      return response.data
    } catch (error) {
      console.error('Error fetching women products:', error)
      throw error
    }
  },
  async getProductById(id) {
    try {
      const response = await Api().get(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching product by id ${id}:`, error)
      throw error
    }
  },
  async getProductsByFamilyId(familyId, limit = 4) {
    try {
      const response = await Api().get(`/products/family/${familyId}`, {
        params: { limit }
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching products by familyId ${familyId}:`, error)
      throw error
    }
  },
  updateProduct(id, productData) {
    if (!isAdmin()) throw new Error('Unauthorized')
    return Api().put(`products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteProduct(id) {
    if (!isAdmin()) throw new Error('Unauthorized')
    return Api().delete(`products/${id}`)
  }
}
