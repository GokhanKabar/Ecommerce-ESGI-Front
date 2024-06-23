const { DataTypes, Model } = require('sequelize');
const FamilyMongo = require("../../denormalization/FamilyMongo"); // Assurez-vous que ce fichier existe et gère la logique de MongoDB

module.exports = (sequelize) => {
  class Family extends Model {
    static associate(models) {
      Family.hasMany(models.Product, { foreignKey: 'familyId' });
    }

    static addHooks(db) {
      Family.addHook("afterCreate", async (family) => {
        console.log("afterCreate hook triggered for family:", family);
        await FamilyMongo(family.id, db.Family, db.Product);
      });

      Family.addHook("afterUpdate", async (family) => {
        console.log("afterUpdate hook triggered for family:", family);
        await FamilyMongo(family.id, db.Family, db.Product, true);
      });
    }
  }

  Family.init({
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
    modelName: 'Family',
  });

  return Family;
};
