import Api from '@/services/Api';
import { isAdmin,isUser,isStoreKeeper } from '../store/roleManagement';

export default {
  getUsers() {
    if (!isAdmin()) {
      throw new Error('Access denied:Unauthorized');
    }
    return Api().get('users');
  },
  
  createUser(users) {
    if (!isAdmin())throw new Error('Access denied: Unauthorized');
    return Api().post('users', users);
  },
  
  getUserById(userId) {
    if (!isAdmin()) throw new Error('Access denied: Unauthorized');
    
    return Api().get(`users/${userId}`);
  },
  
  updateUser(userId, updatedUserData) {
    if (!isAdmin() && !isUser() && !isStoreKeeper()) throw new Error('Access denied:Unauthorized ');
     return Api().put(`users/${userId}`, updatedUserData);
  }, 
  
  deleteUser(userId) {
    if (!isAdmin() && !isUser() && !isStoreKeeper()) throw new Error('Access denied: Unauthorized');
     return Api().delete(`users/${userId}`);
  }
};
