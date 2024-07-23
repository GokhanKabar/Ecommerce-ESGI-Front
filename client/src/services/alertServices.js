import Api from '@/services/Api';

export default {
  async getAlerts(userId) {
    try {
      const response = await Api().get(`alerts/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createAlert(alertData) {
    try {
      const response = await Api().post('alerts', alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateAlert(alertId, alertData) {
    try {
      const response = await Api().put(`alerts/${alertId}`, alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteAlert(alertId) {
    try {
      const response = await Api().delete(`alerts/${alertId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
