// models/pickupPoint.js
module.exports = (sequelize, DataTypes) => {
    const PickupPoint = sequelize.define('PickupPoint', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT
    });
  
    return PickupPoint;
  };
  