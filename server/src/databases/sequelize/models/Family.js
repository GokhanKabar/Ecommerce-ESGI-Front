//const FamilyMongo = require('../../../databases/mongoose/Families');

module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define(
    "Family",
    {
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
    },
    {
      hooks: {
        afterCreate: async (family, options) => {
          console.log("afterCreate hook called for family:", family.id);
          try {
            await FamilyMongo.create({
              sequelizeId: family.id,
              name: family.name,
              createdAt: family.createdAt,
              updatedAt: family.updatedAt,
            });
            console.log("Family synced with MongoDB after creation.");
          } catch (error) {
            console.error(
              "Erreur lors de la synchronisation avec MongoDB après création:",
              error
            );
          }
        },
        afterUpdate: async (family, options) => {
          console.log("afterUpdate hook called for family:", family.id);
          try {
            const familyMongo = await FamilyMongo.findOne({
              sequelizeId: family.id,
            });
            if (familyMongo) {
              familyMongo.name = family.name;
              familyMongo.updatedAt = family.updatedAt;
              await familyMongo.save();
              console.log("Family synced with MongoDB after update.");
            }
          } catch (error) {
            console.error(
              "Erreur lors de la synchronisation avec MongoDB après mise à jour:",
              error
            );
          }
        },
        afterDestroy: async (family, options) => {
          console.log("afterDestroy hook called for family:", family.id);
          try {
            await FamilyMongo.findOneAndDelete({ sequelizeId: family.id });
            console.log("Family deleted from MongoDB after destruction.");
          } catch (error) {
            console.error(
              "Erreur lors de la synchronisation avec MongoDB après suppression:",
              error
            );
          }
        },
      },
    }
  );

  Family.associate = (models) => {
    Family.hasMany(models.Product, { foreignKey: "familyId" });
  };

  return Family;
};
