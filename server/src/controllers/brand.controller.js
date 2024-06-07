const { Brand } = require('../databases/sequelize/models');

exports.createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
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
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const [updated] = await Brand.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(200).json({ message: 'Brand updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const deleted = await Brand.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(200).json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
