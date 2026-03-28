const db = require('../models');

// ─── GET ALL CROPS (for logged in user) ───────────────────────
exports.getCrops = async (req, res) => {
  try {
    // 1. Find farmer profile for logged in user
    const farmer = await db.Farmer.findOne({
      where: { userId: req.user.id }
    });

    if (!farmer) {
      return res.json({ success: true, crops: [] });
    }

    // 2. Find all farms belonging to this farmer
    const farms = await db.Farm.findAll({
      where: { farmerId: farmer.id },
      attributes: ['id']
    });

    const farmIds = farms.map(f => f.id);

    if (farmIds.length === 0) {
      return res.json({ success: true, crops: [] });
    }

    // 3. Find all crops in those farms
    const crops = await db.Crop.findAll({
      where: { farmId: farmIds },
      include: [
        { model: db.Farm, as: 'farm' },
        { model: db.Activity, as: 'activities' },
        { model: db.Harvest, as: 'harvests' }
      ]
    });

    res.json({ success: true, crops });
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET SINGLE CROP ──────────────────────────────────────────
exports.getCrop = async (req, res) => {
  try {
    const crop = await db.Crop.findByPk(req.params.id, {
      include: [
        { model: db.Farm, as: 'farm' },
        { model: db.Activity, as: 'activities' },
        { model: db.Harvest, as: 'harvests' }
      ]
    });
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.json({ success: true, crop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CREATE CROP ──────────────────────────────────────────────
exports.createCrop = async (req, res) => {
  try {
    // Verify farm belongs to logged in user
    const farmer = await db.Farmer.findOne({
      where: { userId: req.user.id }
    });

    if (!farmer) {
      return res.status(403).json({ success: false, message: 'Farmer profile not found' });
    }

    const farm = await db.Farm.findOne({
      where: { id: req.body.farmId, farmerId: farmer.id }
    });

    if (!farm) {
      return res.status(403).json({ success: false, message: 'Farm not found or not yours' });
    }

    const crop = await db.Crop.create({
      ...req.body,
      farmId: farm.id,
    });

    res.status(201).json({ success: true, crop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── UPDATE CROP ──────────────────────────────────────────────
exports.updateCrop = async (req, res) => {
  try {
    const crop = await db.Crop.findByPk(req.params.id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    await crop.update(req.body);
    res.json({ success: true, crop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE CROP ──────────────────────────────────────────────
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await db.Crop.findByPk(req.params.id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    await crop.destroy();
    res.json({ success: true, message: 'Crop deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};