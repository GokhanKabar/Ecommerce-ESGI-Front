import Api from '@/services/Api';
import { isAdmin ,isStoreKeeper} from '../store/roleManagement';
export default {
    getStatistics() {
      if (!isAdmin() && !isStoreKeeper() ) {
        throw new Error('Access denied:Unauthorized');
      }
      return Api().get('Totals');
    },
    
  };