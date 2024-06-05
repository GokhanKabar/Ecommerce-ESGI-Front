const db = require("../databases/sequelize/models");

const Family = db.Family;

exports.getFamilies = async (req, res) => {
  try {
    const families = await Family.findAll();
    res.status(200).json(families);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFamilyById = async (req, res) => {
  try {
    const family = await Family.findByPk(req.params.id);
    if (family) {
      res.status(200).json(family);
    } else {
      res.status(404).json({ message: "Family not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
