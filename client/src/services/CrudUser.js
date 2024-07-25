import Api from '@/services/Api'

export default {
    getUsers() {
        return Api().get('users');
      },
      createUser(users){
       return Api().post('users', users)
      },
      getUserById(userId) {
        return Api().get(`users/${userId}`);
      },
      updateUser(userId, updatedUserData) {
        return Api().put(`users/${userId}`, updatedUserData);
      },
      deleteUser(userId) {
        return Api().delete(`users/${userId}`);
      }
  
}