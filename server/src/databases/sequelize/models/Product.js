const { Model, DataTypes } = require("sequelize");
const ProductMongo = require("../../denormalization/ProductMongo");
const Alert = require("./Alert");
const notificationService = require("../../../services/notificationServices");


module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Brand, { foreignKey: "brandId" });
      Product.belongsTo(models.Family, { foreignKey: "familyId" });
      Product.belongsToMany(models.Order, { through: models.ProductOrder });
    }

    static addHooks(db) {
      Product.addHook("afterCreate", async (product) => {
        await ProductMongo(product.id, db.Product, db.Brand, db.Family);

        const alerts = await db.Alert.findAll({ where: { newProduct: true } });
        notificationService.notifyUsers(alerts, 'Nouveau produit', `Un nouveau produit à été ajouté dans la catégorie ${product.category}.`);
      });

      Product.addHook("afterUpdate", async (product) => {
        await ProductMongo(product.id, db.Product, db.Brand, db.Family);
        if (product._previousDataValues.stock === 0 && product.stock > 0) {
          const alerts = await db.Alert.findAll({ where: { restock: true } });
          notificationService.notifyUsers(alerts, 'Produit de nouveau disponible', `Le produit ${product.name} à été restocké il est de nouveau disponible.`);
        }

        if (product._previousDataValues.price !== product.price) {
          const alerts = await db.Alert.findAll({ where: { priceChange: true } });
          notificationService.notifyUsers(alerts, 'Changement du prix', `Le prix du produit ${product.name} à été modifié.`);
        }
      });

      Product.addHook("beforeDestroy", async (product) => {
        try {
          const result = await ProductMongo(
            product.id,
            db.Product,
            db.Brand,
            db.Family,
            true
          );
        } catch (error) {
          console.error(
            "Error deleting MongoDB document for product:",
            product.id,
            error
          );
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