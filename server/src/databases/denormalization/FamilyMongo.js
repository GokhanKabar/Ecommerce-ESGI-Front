const FamilyMongo = require("../mongoose/Families");

module.exports = async function(familyId, Family, Product, onlyRemove = false) {
  try {
    console.log(familyId, Family);
    const family = await Family.findByPk(familyId, {
      include: [
        {
          model: Product,
          attributes: ["id", "name", "description", "category", "price", "stock", "concentration", "promotion", "image"],
        },
      ],
    });

    console.log("Family found:", family);

    if (!family) {
      console.log("Family not found");
      return;
    }

    await FamilyMongo.deleteOne({ sequelizeId: familyId });

    if (!onlyRemove) {
      const familyMongo = new FamilyMongo({
        sequelizeId: familyId,
        ...family.dataValues,
        products: family.Products ? family.Products.map((product) => product.dataValues) : [],
      });

      await familyMongo.save();
    }
  } catch (error) {
    console.error("Error in familyMongo function:", error);
  }
};
