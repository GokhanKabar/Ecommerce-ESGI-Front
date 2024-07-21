const { Alert } = require('../databases/sequelize/models'); // Utilisez l'importation correcte pour votre structure de projet

exports.getAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    const alerts = await Alert.findOne({ where: { userId } });
    if (!alerts) {
      return res.status(404).json({ message: 'Alertes non trouvées' });
    }
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newProduct, restock, priceChange } = req.body;

    let alerts = await Alert.findOne({ where: { userId } });
    if (alerts) {
      alerts.newProduct = newProduct;
      alerts.restock = restock;
      alerts.priceChange = priceChange;
      await alerts.save();
    } else {
      alerts = await Alert.create({
        userId,
        newProduct,
        restock,
        priceChange
      });
    }

    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
