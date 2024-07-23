import axios from 'axios'
import  store  from '@/store/store';
export default () => {
  return axios.create({
    baseURL: `http://parfums-esgi.store/api`,    
    headers: {
      'Access-Control-Allow-Origin': 'http://parfums-esgi.store',
      Authorization: `Bearer ${store.state.token}`
    }
  })
}