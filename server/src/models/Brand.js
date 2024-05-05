// models/brand.js
module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brand', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING
    });
  
    Brand.associate = models => {
      Brand.hasMany(models.Product, { foreignKey: 'brandId' });
    };
  
    return Brand;
  };
  