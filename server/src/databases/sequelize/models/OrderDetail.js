const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OrderDetail extends Model {
    static associate(models) {
      OrderDetail.belongsTo(models.Order, { foreignKey: 'orderId' });
    }
  }

  OrderDetail.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderDetail',
    timestamps: false, 
    underscored: true,
    tableName: 'order_details' 
  });

  return OrderDetail;
};
