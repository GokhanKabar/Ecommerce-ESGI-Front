// models/promotion.js
module.exports = (sequelize, DataTypes) => {
    const Promotion = sequelize.define('Promotion', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      code: DataTypes.STRING,
      expirationDate: DataTypes.DATE,
      productCategory: DataTypes.STRING,
      productId: DataTypes.INTEGER
    });
  
    Promotion.associate = models => {
      Promotion.belongsTo(models.Product, { foreignKey: 'productId' });
    };
  
    return Promotion;
  };
  