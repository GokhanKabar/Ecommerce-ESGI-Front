const { Model, DataTypes } = require('sequelize');
const Product = require('./Product');
const Order = require('./Order');

module.exports = (sequelize) => {
  class ProductOrder extends Model {
    static associate(models) {
        ProductOrder.belongsTo(models.Product);
        ProductOrder.belongsTo(models.Order);
  
        
      }
  }

  ProductOrder.init({
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products', 
        key: 'id'
      },
      validate: {
        notEmpty: true 
      }
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Order',
        key: 'id'
      },
      validate: {
        notEmpty: true 
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true, 
        min: 1 
      }
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true 
      }
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true 
      }
    },
    user_create: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', 
        key: 'id'
      }
    },
    user_update: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', 
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ProductOrder',
    timestamps: false, 
    underscored: true, 
    tableName: 'product_orders'
  });



   
  return ProductOrder;
};