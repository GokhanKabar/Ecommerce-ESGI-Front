const { DataTypes, Model } = require('sequelize');
//const BrandMongo = require('../../denormalization/BrandMongo');

module.exports = (sequelize) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.Product, { foreignKey: 'brandId' });
    }

    static addHooks(db) {
      Brand.addHook("afterCreate", async (brand) => {
        console.log("afterCreate hook triggered for brand:", brand);
        await BrandMongo(brand.id, db.Brand, db.Product);
      });

      Brand.addHook("afterUpdate", async (brand) => {
        console.log("afterUpdate hook triggered for brand:", brand);
        await BrandMongo(brand.id, db.Brand, db.Product);
      });
    }
  }

  Brand.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Brand',
  });

  return Brand;
};
