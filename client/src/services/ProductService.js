import Api from '@/services/Api';
import store from '../store/store';

const isAdmin = () => {
  const user = store.state.user;
  return user && user.role === 'admin';
};

export default {
  createProduct(productData) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return Api().post('products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getAllProducts() {
    return Api().get('products');
  },
  getMenProducts() {
    return Api().get('products/men');
  },
  getWomenProducts() {
    return Api().get('products/women');
  },
  getProductById(id) {
    return Api().get(`products/${id}`);
  },
  getProductsByFamilyId(familyId, limit = 4) {
    return Api().get(`products/family/${familyId}`, {
      params: { limit }
    });
  },
  updateProduct(id, productData) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return Api().put(`products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteProduct(id) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return Api().delete(`products/${id}`);
  }
};
