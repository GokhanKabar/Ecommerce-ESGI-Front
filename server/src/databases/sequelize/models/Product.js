const { Model, DataTypes } = require("sequelize");
const ProductMongo = require("../../denormalization/ProductMongo");

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Brand, { foreignKey: "brandId" });
      Product.belongsTo(models.Family, { foreignKey: "familyId" });
    }

    static addHooks(db) {
      Product.addHook("afterCreate", async (product) => {
        console.log("afterCreate hook triggered for product:", product);
        await ProductMongo(product.id, db.Product, db.Brand, db.Family);
      });

      Product.addHook("afterUpdate", async (product) => {
        console.log("afterUpdate hook triggered for product:", product);
        await ProductMongo(product.id, db.Product, db.Brand, db.Family);
      });
    }
  }

  Product.init(
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
      description: DataTypes.TEXT,
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      concentration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      promotion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: DataTypes.STRING,
      dateAdded: DataTypes.DATE,
      dateUpdated: DataTypes.DATE,
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
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      familyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      timestamps: true,
      underscored: true,
      tableName: "products",
    }
  );

  return Product;
};
