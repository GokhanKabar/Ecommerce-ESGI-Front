import Api from '@/services/Api'

export default {
  register (credentials) {
    return Api().post('register', credentials)
  },
  login (credentials) {
    return Api().post('login', credentials)
  }
  ,
  forgotPassword(credentials) {
    return Api().post('forgotPassword',credentials)
  },
  resetPassword(credentials) {
    return Api().post('resetPassword',credentials)

  }
  
}
