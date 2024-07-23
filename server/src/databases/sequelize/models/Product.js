const { Model, DataTypes } = require("sequelize");
const mongoose = require('mongoose');
const ProductMongo = require("../../denormalization/ProductMongo");
const notificationService = require("../../../services/notificationServices");

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Brand, { foreignKey: "brandId" });
      Product.belongsTo(models.Family, { foreignKey: "familyId" });
      Product.belongsToMany(models.Order, { through: models.ProductOrder });
    }

    static addHooks(models) {
      Product.addHook("afterCreate", async (product, options) => {
        const productId = new mongoose.Types.ObjectId(product.id);
        await ProductMongo(productId, models.Product, models.Brand, models.Family);

        await notificationService.notifyNewProduct(product.category);
      });

      Product.addHook("afterUpdate", async (product, options) => {
        const productId = new mongoose.Types.ObjectId(product.id);
        await ProductMongo(productId, models.Product, models.Brand, models.Family);

        if (product._previousDataValues.stock === 0 && product.stock > 0) {
          await notificationService.notifyRestock(product.id);
        }

        if (product._previousDataValues.price !== product.price) {
          await notificationService.notifyPriceChange(product.id);
        }
      });

      Product.addHook("beforeDestroy", async (product, options) => {
        const productId = new mongoose.Types.ObjectId(product.id);
        try {
          await ProductMongo(productId, models.Product, models.Brand, models.Family, true);
        } catch (error) {
          console.error("Error deleting MongoDB document for product:", product.id, error);
        }
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
