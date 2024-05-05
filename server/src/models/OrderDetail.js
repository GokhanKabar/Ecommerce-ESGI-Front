// models/orderDetail.js
module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quantity: DataTypes.INTEGER,
      unitPrice: DataTypes.FLOAT
    });
  
    OrderDetail.associate = models => {
      OrderDetail.belongsTo(models.Order, { foreignKey: 'orderId' });
    };
  
    return OrderDetail;
  };
  