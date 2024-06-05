module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define("Family", {
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
  });

  Family.associate = (models) => {
    Family.hasMany(models.Product, { foreignKey: "familyId" });
  };

  return Family;
};
