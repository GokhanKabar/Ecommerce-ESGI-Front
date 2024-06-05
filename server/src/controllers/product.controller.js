const db = require("../databases/sequelize/models");

const Product = db.Product;

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMenProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        category: "homme",
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWomenProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        category: "femme",
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
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
    const products = await Product.findAll({
      where: { familyId },
      limit: parseInt(limit, 10) || 4,
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
