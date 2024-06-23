const ProductMongo = require("../../../databases/mongoose/Products");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
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
      hooks: {
        afterCreate: async (product, options) => {
          console.log("afterCreate hook called for product:", product.id);
          try {
            await ProductMongo.create({
              sequelizeId: product.id,
              name: product.name,
              description: product.description,
              category: product.category,
              price: product.price,
              stock: product.stock,
              concentration: product.concentration,
              promotion: product.promotion,
              image: product.image,
              dateAdded: product.dateAdded,
              dateUpdated: product.dateUpdated,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              brandId: product.brandId,
              familyId: product.familyId,
            });
            console.log("Product synced with MongoDB after creation.");
          } catch (error) {
            console.error(
              "Erreur lors de la synchronisation avec MongoDB après création:",
              error
            );
          }
        },
        afterUpdate: async (product, options) => {
          console.log("afterUpdate hook called for product:", product.id);
          try {
            const productMongo = await ProductMongo.findOne({
              sequelizeId: product.id,
            });
            if (productMongo) {
              productMongo.name = product.name;
              productMongo.description = product.description;
              productMongo.category = product.category;
              productMongo.price = product.price;
              productMongo.stock = product.stock;
              productMongo.concentration = product.concentration;
              productMongo.promotion = product.promotion;
              productMongo.image = product.image;
              productMongo.dateAdded = product.dateAdded;
              productMongo.dateUpdated = product.dateUpdated;
              productMongo.createdAt = product.createdAt;
              productMongo.updatedAt = product.updatedAt;
              productMongo.brandId = product.brandId;
              productMongo.familyId = product.familyId;
              await productMongo.save();
              console.log("Product synced with MongoDB after update.");
            }
          } catch (error) {
            console.error(
              "Erreur lors de la synchronisation avec MongoDB après mise à jour:",
              error
            );
          }
        },
        afterDestroy: async (product, options) => {
          console.log("afterDestroy hook called for product:", product.id);
          try {
            await ProductMongo.findOneAndDelete({ sequelizeId: product.id });
            console.log("Product deleted from MongoDB after destruction.");
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

  return Product;
};
