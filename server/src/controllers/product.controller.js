const { Product: SequelizeProduct } = require("../databases/sequelize/models");
const Product = require("../databases/mongoose/Products"); // Mongoose model

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPromotionalProducts = async (req, res) => {
  try {
    const promotionalProducts = await Product.find({ promotion: { $gt: 0 } }).sort({ promotion: -1 }).limit(3);
    res.status(200).json(promotionalProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByFamilyId = async (req, res) => {
  const { familyId } = req.params;
  const { limit } = req.query;
  try {
    const products = await Product.find({ familyId }).limit(
      parseInt(limit, 10) || 4
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      stock,
      concentration,
      promotion,
      brandId,
      familyId,
    } = req.body;
    const image = req.file ? req.file.path : null;

    const product = await SequelizeProduct.create({
      name,
      description,
      category,
      price,
      stock,
      concentration,
      promotion,
      image,
      brandId,
      familyId,
      dateAdded: new Date(),
      dateUpdated: new Date(),
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      price,
      stock,
      concentration,
      promotion,
      brandId,
      familyId,
    } = req.body;
    const image = req.file ? req.file.path : null;

    const product = await SequelizeProduct.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.update({
      name,
      description,
      category,
      price,
      stock,
      concentration,
      promotion,
      image: image || product.image,
      brandId,
      familyId,
      dateUpdated: new Date(),
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await SequelizeProduct.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsAdmin = async (req, res) => {
  try {
    const products = await SequelizeProduct.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { "brand.name": { $regex: query, $options: "i" } },
        { "family.name": { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: error.message });
  }
};
