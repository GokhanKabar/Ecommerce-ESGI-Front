import axios from 'axios'
import  store  from '@/store/store';
export default () => {
  return axios.create({
    baseURL: `https://parfums-esgi.store/api`,
    
    headers: {
      'Access-Control-Allow-Origin': 'https://parfums-esgi.store',
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
