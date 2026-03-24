const db = require('../models');

exports.createFarm = async (req, res) => {
  try {
    const farm = await db.Farm.create(req.body);
    res.status(201).json(farm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFarms = async (req, res) => {
  const farms = await db.Farm.findAll({ include: db.Crop });
  res.json(farms);
};
