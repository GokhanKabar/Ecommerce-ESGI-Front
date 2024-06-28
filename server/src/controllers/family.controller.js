const { Family } = require("../databases/sequelize/models"); // Sequelize model
const Joi = require('joi');

const familySchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Le nom doit être une chaîne de caractères",
    "string.empty": "Le nom ne doit pas être vide",
    "string.min": "Le nom doit avoir une longueur minimale de {#limit}",
    "string.max": "Le nom doit avoir une longueur maximale de {#limit}",
    "any.required": "Le nom est requis",
  }),
  description: Joi.string().min(10).max(100),
});

exports.createFamily = async (req, res) => {
  const { error, value } = familySchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const family = await Family.create(value);
    res.status(201).json(family);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllFamilies = async (req, res) => {
  try {
    const families = await Family.findAll(); // Use Sequelize to get all families
    res.status(200).json(families);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFamilyById = async (req, res) => {
  try {
    const family = await Family.findByPk(req.params.id);
    if (!family) {
      return res.status(404).json({ error: "Family not found" });
    }
    res.status(200).json(family);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateFamily = async (req, res) => {
  const { error, value } = familySchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const [updated] = await Family.update(value, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: "Family not found" });
    }
    res.status(200).json({ message: "Family updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFamily = async (req, res) => {
  try {
    const deleted = await Family.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Family not found" });
    }
    res.status(200).json({ message: "Family deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllFamiliesAdmin = async (req, res) => {
  try {
    const families = await Family.findAll();
    res.status(200).json(families);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
