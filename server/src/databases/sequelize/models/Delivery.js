// models/delivery.js
module.exports = (sequelize, DataTypes) => {
    const Delivery = sequelize.define('Delivery', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      address: DataTypes.STRING,
      mode: DataTypes.STRING,
      status: DataTypes.STRING
    });
  
    Delivery.associate = models => {
      Delivery.belongsTo(models.Order, { foreignKey: 'orderId' });
    };
  
    return Delivery;
  };
  