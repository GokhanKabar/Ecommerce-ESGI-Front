// models/order.js
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      status: DataTypes.STRING,
      totalAmount: DataTypes.FLOAT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });
  
    Order.associate = models => {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
      Order.hasMany(models.OrderDetail, { foreignKey: 'orderId' });
    };
  
    return Order;
  };
  