const db = require('../models');

// CREATE Farmer
exports.createFarmer = async (req, res) => {
  try {
    const farmer = await db.Farmer.create(req.body);
    res.status(201).json(farmer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all Farmers
exports.getFarmers = async (req, res) => {
  const farmers = await db.Farmer.findAll({ include: db.Farm });
  res.json(farmers);
};
