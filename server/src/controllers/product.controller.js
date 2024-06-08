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

exports.createProduct = async (req, res) => {
    try {
      const { name, description, category, price, stock, concentration, promotion, brandId, familyId } = req.body;
      const image = req.file ? req.file.path : null;
  
      const product = await Product.create({
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
      const { name, description, category, price, stock, concentration, promotion, brandId, familyId } = req.body;
      const image = req.file ? req.file.path : null;
  
      const product = await Product.findByPk(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
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
  
      const product = await Product.findByPk(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      await product.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };