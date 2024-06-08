import Api from '@/services/Api';
import store from '../store/store';

const isAdmin = () => {
  const user = store.state.user;
  return user && user.role === 'admin';
};

export default {
  createBrand(brandData) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return Api().post('brands', brandData);
  },
  getAllBrands() {
    return Api().get('brands');
  },
  getBrandById(id) {
    return Api().get(`brands/${id}`);
  },
  updateBrand(id, brandData) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return Api().put(`brands/${id}`, brandData);
  },
  deleteBrand(id) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return Api().delete(`brands/${id}`);
  }
};
