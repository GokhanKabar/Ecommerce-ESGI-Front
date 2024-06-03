// models/payment.js
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      amount: DataTypes.FLOAT,
      method: DataTypes.STRING,
      status: DataTypes.STRING,
      date: DataTypes.DATE
    });
  
    Payment.associate = models => {
      Payment.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Payment;
  };
  