const ProductMongo = require("../mongoose/Products");

module.exports = async function (
  productId,
  Product,
  Brand,
  Family,
  onlyRemove = false
) {
  try {
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Brand,
          attributes: ["id", "name"],
        },
        {
          model: Family,
          attributes: ["id", "name"],
        },
      ],
    });


    if (!product) {
      return;
    }

    await ProductMongo.deleteOne({ sequelizeId: productId });

    if (!onlyRemove) {
      const productMongo = new ProductMongo({
        sequelizeId: productId,
        ...product.dataValues,
        brand: product.Brand ? product.Brand.dataValues : null,
        family: product.Family ? product.Family.dataValues : null,
      });

      await productMongo.save();
    }
  } catch (error) {
    console.error("Error in productMongo function:", error);
  }
};
