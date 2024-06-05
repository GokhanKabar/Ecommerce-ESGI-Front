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
  });

  Brand.associate = (models) => {
    Brand.hasMany(models.Product, { foreignKey: "brandId" });
  };

  return Brand;
};
