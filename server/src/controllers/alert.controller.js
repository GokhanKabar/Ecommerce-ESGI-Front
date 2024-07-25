const { Alert } = require('../databases/sequelize/models');

class AlertController {
  // Créer une nouvelle alerte
  async createAlert(req, res) {
    try {
      const alert = await Alert.create(req.body);
      return res.status(201).json(alert);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Obtenir toutes les alertes pour un utilisateur
  async getAlerts(req, res) {
    try {
      const alerts = await Alert.findAll({ where: { userId: req.params.userId } });
      return res.status(200).json(alerts);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Mettre à jour une alerte
  async updateAlert(req, res) {
    try {
      const { id } = req.params;
      await Alert.update(req.body, { where: { id } });
      const updatedAlert = await Alert.findByPk(id);
      return res.status(200).json(updatedAlert);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Supprimer une alerte
  async deleteAlert(req, res) {
    try {
      const { id } = req.params;
      await Alert.destroy({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AlertController();
