const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      
      Order.belongsToMany(models.Product, { through: models.ProductOrder });
      Order.belongsTo(models.User);
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
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true
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
    }
  }, {
    sequelize,
    modelName: "Order",
    timestamps: true,
    underscored: true,
    tableName: "Order",
  });

  // Associations

  return Order;
};