const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Promotion extends Model {
    static associate(models) {
      Promotion.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
  }

  Promotion.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    productCategory: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products', 
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'promotions',
    timestamps: true,
    underscored: true
  });

  return Promotion;
};
