const { Product: SequelizeProduct } = require("../databases/sequelize/models");
const Product = require("../databases/mongoose/Products"); // Mongoose model
const Joi = require('joi');

const productCreateSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Le nom doit être une chaîne de caractères",
    "string.empty": "Le nom ne doit pas être vide",
    "string.min": "Le nom doit avoir une longueur minimale de {#limit}",
    "string.max": "Le nom doit avoir une longueur maximale de {#limit}",
    "any.required": "Le nom est requis",
  }),
  description: Joi.string().min(10).max(100).required().messages({
    "string.base": "La description doit être une chaîne de caractères",
    "string.empty": "La description ne doit pas être vide",
    "string.min": "La description doit avoir une longueur minimale de {#limit}",
    "string.max": "La description doit avoir une longueur maximale de {#limit}",
    "any.required": "La description est requise",
  }),
  category: Joi.string().required().messages({
    "string.base": "La catégorie doit être une chaîne de caractères",
    "string.empty": "La catégorie ne doit pas être vide",
    "any.required": "La catégorie est requise",
  }),
  price: Joi.number().required().messages({
    "number.base": "Le prix doit être un nombre",
    "number.empty": "Le prix ne doit pas être vide",
    "any.required": "Le prix est requis",
  }),
  stock: Joi.number().required().messages({
    "number.base": "Le stock doit être un nombre",
    "number.empty": "Le stock ne doit pas être vide",
    "any.required": "Le stock est requis",
  }),
  concentration: Joi.string().required().messages({
    "string.base": "La concentration doit être une chaîne de caractères",
    "string.empty": "La concentration ne doit pas être vide",
    "any.required": "La concentration est requise",
  }),
  promotion: Joi.number().optional().messages({
    "number.base": "La promotion doit être un nombre",
  }),
  brandId: Joi.string().required().messages({
    "string.base": "L'ID de la marque doit être une chaîne de caractères",
    "string.empty": "L'ID de la marque ne doit pas être vide",
    "any.required": "L'ID de la marque est requis",
  }),
  familyId: Joi.string().required().messages({
    "string.base": "L'ID de la famille doit être une chaîne de caractères",
    "string.empty": "L'ID de la famille ne doit pas être vide",
    "any.required": "L'ID de la famille est requis",
  }),
  image: Joi.any().optional()
});

const productUpdateSchema = productCreateSchema.fork(
  ['name', 'description', 'category', 'price', 'stock', 'concentration', 'promotion', 'brandId', 'familyId', 'image'],
  field => field.optional()
);

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
      return res.status(404).json({ message: "No products found for this category" });
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
    const products = await Product.find({ familyId }).limit(parseInt(limit, 10) || 4);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const { error, value } = productCreateSchema.validate(req.body);
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
  const { error, value } = productUpdateSchema.validate(req.body, { allowUnknown: true });
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

    const updatedProduct = {
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
    };

    await product.update(updatedProduct);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProductStock = async (req, res) => {
  const { id, qt, op } = req.params;
console.log('id'+id)
console.log('qt'+qt)
console.log('op'+op)
  try {
    const product = await SequelizeProduct.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let newStock;
    if (op == 1) {
      newStock = product.stock + parseInt(qt, 10);
    } else if (op == 0) {
      if (product.stock < qt) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      newStock = product.stock - parseInt(qt, 10);
    } else {
      return res.status(400).json({ message: 'Invalid operation ***' });
    }

    product.stock = newStock;
    await product.save();

    res.status(200).json({ message: 'Stock updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
