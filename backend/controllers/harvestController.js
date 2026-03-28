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
  try {
    const harvests = await db.Harvest.findAll({
      include: [
        { model: db.Crop, as: 'crop' } // ✅ must match Harvest.belongsTo(Crop, { as: 'crop' })
      ]
    });
    res.json({ success: true, harvests });
  } catch (err) {
    console.error('[ERROR LOG]:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};