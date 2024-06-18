const BrandMongo = require('../../../databases/mongoose/Brands');

module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define("Brand", {
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
    hooks: {
      afterCreate: async (brand, options) => {
        console.log('afterCreate hook called for brand:', brand.id);
        try {
          await BrandMongo.create({
            sequelizeId: brand.id,
            name: brand.name,
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt,
          });
          console.log('Brand synced with MongoDB after creation.');
        } catch (error) {
          console.error('Erreur lors de la synchronisation avec MongoDB après création:', error);
        }
      },
      afterUpdate: async (brand, options) => {
        console.log('afterUpdate hook called for brand:', brand.id);
        try {
          const brandMongo = await BrandMongo.findOne({ sequelizeId: brand.id });
          if (brandMongo) {
            brandMongo.name = brand.name;
            brandMongo.updatedAt = brand.updatedAt;
            await brandMongo.save();
            console.log('Brand synced with MongoDB after update.');
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation avec MongoDB après mise à jour:', error);
        }
      },
      afterDestroy: async (brand, options) => {
        console.log('afterDestroy hook called for brand:', brand.id);
        try {
          await BrandMongo.findOneAndDelete({ sequelizeId: brand.id });
          console.log('Brand deleted from MongoDB after destruction.');
        } catch (error) {
          console.error('Erreur lors de la synchronisation avec MongoDB après suppression:', error);
        }
      },
    },
  });

  Brand.associate = (models) => {
    Brand.hasMany(models.Product, { foreignKey: "brandId" });
  };

  return Brand;
};
