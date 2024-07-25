const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PickupPoint extends Model {}

  PickupPoint.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'PickupPoint',
    timestamps: false, 
    underscored: true, 
    tableName: 'pickup_points' 
  });

  return PickupPoint;
};
