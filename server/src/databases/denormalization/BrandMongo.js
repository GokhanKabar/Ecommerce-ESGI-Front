const BrandMongo = require("../mongoose/Brands");

module.exports = async function(brandId, Brand, Product, onlyRemove = false) {
  try {
    console.log(brandId,Brand);
    const brand = await Brand.findByPk(brandId, {
      include: [
        {
          model: Product,
          attributes: ["id", "name", "description", "category", "price", "stock", "concentration", "promotion", "image"],
        },
      ],
    });

    console.log("Brand found:", brand);

    if (!brand) {
      console.log("Brand not found");
      return;
    }

    await BrandMongo.deleteOne({ sequelizeId: brandId });

    if (!onlyRemove) {
      const brandMongo = new BrandMongo({
        sequelizeId: brandId,
        ...brand.dataValues,
        products: brand.Products ? brand.Products.map((product) => product.dataValues) : [],
      });

      await brandMongo.save();
    }
  } catch (error) {
    console.error("Error in brandMongo function:", error);
  }
};
