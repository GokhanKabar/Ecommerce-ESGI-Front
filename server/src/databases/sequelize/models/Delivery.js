const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Delivery extends Model {
    static associate(models) {
      Delivery.belongsTo(models.Order, { foreignKey: 'orderId' });
    }
  }

  Delivery.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    address: DataTypes.STRING,
    mode: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Delivery',
    timestamps: false, 
    underscored: true,
    tableName: 'deliveries', 
  });

  return Delivery;
};
