import Api from '@/services/Api'
import { isAdmin,isStoreKeeper } from '../store/roleManagement';

export default {
  createProduct(productData) {
    if (!isAdmin() && !isStoreKeeper()) throw new Error('Unauthorized')
    return Api().post('products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  async getAllProductsAdmin() {
    try {
      const response = await Api().get('/productsall')
      return response.data
    } catch (error) {
      console.error('Error fetching admin products:', error)
      throw error
    }
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
  async getAllProductsPromo() {
    try {
      const response = await Api().get('/promotionalProducts')
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },
  async getProductsByCategory(category){
    try {
      const response = await Api().get(`/products/category/${category}`);
      return response.data.map((product) => ({
        ...product,
        image: product.image ? `${product.image}` : null,
      }));
    } catch (error) {
      console.error('Error fetching products by category', error);
      throw error;
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
  async getProductsAdmin() {
    try {
      const response = await Api().get('/productsall')
      return response.data
    } catch (error) {
      console.error('Error fetching admin products:', error)
    }
  },
  async getLastProduct(category) {
    try {
      const response = await Api().get(`/products/category/${category}?sort=-createdAt&limit=1`)
      return response.data[0]
    } catch (error) {
      console.error('Error fetching last product:', error)
      throw error
    }
  },
  updateProduct(id, productData) {
    if (!isAdmin() && !isStoreKeeper()) throw new Error('Unauthorized')
    return Api().put(`products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteProduct(id) {
    if (!isAdmin() && !isStoreKeeper()) throw new Error('Unauthorized')
    return Api().delete(`products/${id}`)
  },
  async searchProducts(query) {
    try {
      const response = await Api().get(`/products/search?q=${query}`)
      return response.data
    } catch (error) {
      console.error('Error searching products:', error)
      throw error
    }
  }
}
