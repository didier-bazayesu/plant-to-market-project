const db = require('../models');

exports.createHarvest = async (req, res) => {
  try {
    const harvest = await db.Harvest.create(req.body);
    res.status(201).json(harvest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getHarvests = async (req, res) => {
  const harvests = await db.Harvest.findAll({ include: db.Crop });
  res.json(harvests);
};
