const { Product: SequelizeProduct } = require("../databases/sequelize/models");
const Product = require("../databases/mongoose/Products"); // Mongoose model
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Le nom doit être une chaîne de caractères",
    "string.empty": "Le nom ne doit pas être vide",
    "string.min": "Le nom doit avoir une longueur minimale de {#limit}",
    "string.max": "Le nom doit avoir une longueur maximale de {#limit}",
    "any.required": "Le nom est requis",
  }),
  description: Joi.string().min(10).max(500).required().messages({
    "string.base": "La description doit être une chaîne de caractères",
    "string.empty": "La description ne doit pas être vide",
    "string.min": "La description doit avoir une longueur minimale de {#limit}",
    "string.max": "La description doit avoir une longueur maximale de {#limit}",
    "any.required": "La description est requise",
  }),
  category: Joi.string().required(),
  price: Joi.number().positive().required().messages({
    "number.base": "Le prix doit être un nombre",
    "number.positive": "Le prix doit être un nombre positif",
    "any.required": "Le prix est requis",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Le stock doit être un nombre",
    "number.integer": "Le stock doit être un nombre entier",
    "number.min": "Le stock doit être supérieur ou égal à {#limit}",
    "any.required": "Le stock est requis",
  }),
  concentration: Joi.string().required(),
  promotion: Joi.string().optional(),
  brandId: Joi.number().integer().required(),
  familyId: Joi.number().integer().required(),
  image: Joi.string().optional(),
});

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
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
  const { error, value } = productSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

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
    } = value;
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
  const { error, value } = productSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

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
    } = value;
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
