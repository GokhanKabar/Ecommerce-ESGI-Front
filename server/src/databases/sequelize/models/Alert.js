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
    newProduct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    restock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    priceChange: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Alert',
    timestamps: false,
    underscored: true,
    tableName: 'alerts'
  });

  return Alert;
};
