// models/alert.js
module.exports = (sequelize, DataTypes) => {
    const Alert = sequelize.define('Alert', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: DataTypes.STRING,
      status: DataTypes.BOOLEAN
    });
  
    Alert.associate = models => {
      Alert.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Alert;
  };
  