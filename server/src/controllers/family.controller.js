const { Family } = require("../databases/sequelize/models"); // Sequelize model
const FamilyModel = require("../databases/mongoose/Families"); // Mongoose model

exports.createFamily = async (req, res) => {
  try {
    const family = await Family.create(req.body);
    res.status(201).json(family);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllFamilies = async (req, res) => {
  try {
    const families = await FamilyModel.find(); // Use Mongoose to get all families
    res.status(200).json(families);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFamilyById = async (req, res) => {
  try {
    const family = await FamilyModel.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ error: "Family not found" });
    }
    res.status(200).json(family);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateFamily = async (req, res) => {
  try {
    const [updated] = await Family.update(req.body, {
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
