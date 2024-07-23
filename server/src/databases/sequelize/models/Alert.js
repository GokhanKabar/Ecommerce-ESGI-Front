const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Alert extends Model {
    static associate(models) {
      Alert.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Alert.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    newProductCategories: {
      type: DataTypes.JSON,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('newProductCategories must be an array');
          }
        }
      }
    },
    restockProductIds: {
      type: DataTypes.JSON,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('restockProductIds must be an array');
          }
        }
      }
    },
    priceChangeProductIds: {
      type: DataTypes.JSON,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('priceChangeProductIds must be an array');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Alert',
    timestamps: true,  // Enable timestamps if needed
    underscored: true,
    tableName: 'alerts',
  });

  return Alert;
};
