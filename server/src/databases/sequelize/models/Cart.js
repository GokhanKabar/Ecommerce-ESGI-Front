const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'userId' });
      Cart.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }

  Cart.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Cart',
    timestamps: false, 
    underscored: true, 
    tableName: 'carts', 
  });

  return Cart;
};
