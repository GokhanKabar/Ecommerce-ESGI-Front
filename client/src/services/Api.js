import axios from 'axios'
import  store  from '@/store/store';
export default () => {
  return axios.create({
    baseURL: `http://localhost:8000/`,
    
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      Authorization: `Bearer ${store.state.token}`
    }
  })
}