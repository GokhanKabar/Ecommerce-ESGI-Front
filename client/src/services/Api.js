import axios from 'axios'
import  store  from '@/store/store';
export default () => {
  return axios.create({
    baseURL: `http://sensvinylo.tech/api`,
    
    headers: {
      'Access-Control-Allow-Origin': 'http://sensvinylo.tech',
      Authorization: `Bearer ${store.state.token}`
    }
  })
}