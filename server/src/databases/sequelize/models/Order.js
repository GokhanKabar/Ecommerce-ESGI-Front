const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      // Assuming foreign keys map to 'user_id' and 'payment_id' in the database
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.belongsTo(models.Payment, { foreignKey: 'payment_id' });      // Consider using hasMany or belongsToMany for product_orders
    }
  }

  Order.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    delivery_status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    date_order: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: false,
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
    order_status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User', // Assuming 'User' table exists for foreign key
        key: 'id'
      }
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Payment', // Assuming 'Payment' table exists for foreign key
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: "Order",
    timestamps: true,
    underscored: true,
    tableName: "Order",
  });

  return Order;
};