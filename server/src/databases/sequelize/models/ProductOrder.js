const { Model, DataTypes } = require('sequelize');
const Product = require('./Product');
const Order = require('./Order');

module.exports = (sequelize) => {
  class ProductOrder extends Model {
    static associate(models) {
        // Assuming foreign keys map to 'user_id' and 'payment_id' in the database
        ProductOrder.belongsTo(models.Product);
        ProductOrder.belongsTo(models.Order);
  
        
      }
  }

  ProductOrder.init({
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product, // Assuming 'Product' table exists for foreign key
        key: 'id'
      },
      validate: {
        notEmpty: true // Ensure a product is selected
      }
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order, // Assuming 'Order' table exists for foreign key
        key: 'id'
      },
      validate: {
        notEmpty: true // Ensure an order is associated
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true, // Ensure quantity is an integer
        min: 1 // Optional: Set a minimum quantity (adjust as needed)
      }
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true // Ensure a valid date is provided
      }
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true // Ensure a valid date is provided (if applicable)
      }
    },
    user_create: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assuming 'User' table exists for foreign key
        key: 'id'
      }
    },
    user_update: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assuming 'User' table exists for foreign key
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ProductOrder',
    timestamps: false, // Disable automatic timestamps if not needed
    underscored: true, // Use underscores for column names
    tableName: 'product_orders'
  });


  // Associations
   
  return ProductOrder;
};