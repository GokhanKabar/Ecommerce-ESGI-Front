import Api from '@/services/Api';
import store from '../store/store';

const isAdmin = () => {
  const user = store.state.user;
  return user && user.role === 'admin';
};

export default {
  createFamily(familyData) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return Api().post('families', familyData);
  },
  getAllFamilies() {
    return Api().get('families');
  },
  getFamilyById(id) {
    return Api().get(`families/${id}`);
  },
  updateFamily(id, familyData) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return Api().put(`families/${id}`, familyData);
  },
  deleteFamily(id) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return Api().delete(`families/${id}`);
  }
};
