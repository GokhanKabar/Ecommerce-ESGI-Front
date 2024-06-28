const { Brand } = require("../databases/sequelize/models"); // Sequelize model
const Joi = require('joi');

const brandSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(10).max(100),
});

exports.createBrand = async (req, res) => {
  const { error, value } = brandSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const brand = await Brand.create(value);
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  const { error, value } = brandSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const [updated] = await Brand.update(value, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json({ message: "Brand updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const deleted = await Brand.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBrandsAdmin = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
