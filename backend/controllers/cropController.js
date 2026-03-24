const db = require('../models');

exports.createCrop = async (req, res) => {
  try {
    const crop = await db.Crop.create(req.body);
    res.status(201).json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCrops = async (req, res) => {
  const crops = await db.Crop.findAll({
    include: [db.Activity, db.Harvest]
  });
  res.json(crops);
};
