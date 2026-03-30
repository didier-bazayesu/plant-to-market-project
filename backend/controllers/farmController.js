const db = require('../models');

// ─── GET ALL FARMS (for logged in user) ───────────────────────
exports.getFarms = async (req, res) => {
  try {

    // ✅ Admin sees ALL farms
    if (req.user.role === 'admin') {
      const farms = await db.Farm.findAll({
        include: [
          { model: db.Farmer, as: 'farmer', attributes: ['id', 'name', 'email'] },
          { model: db.Crop, as: 'crops' }
        ]
      });
      return res.json({ success: true, farms });
    }
    // 1. Find farmer profile for logged in user
    const farmer = await db.Farmer.findOne({
      where: { userId: req.user.id }
    });

    if (!farmer) {
      return res.json({ success: true, farms: [] });
    }

    // 2. Find all farms for this farmer
    const farms = await db.Farm.findAll({
      where: { farmerId: farmer.id },
      include: [
        {
          model: db.Farmer,
          as: 'farmer',
          attributes: ['id', 'name', 'email']
        },
        { model: db.Crop, as: 'crops' }
      ]
    });

    res.json({ success: true, farms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET SINGLE FARM ──────────────────────────────────────────
exports.getFarm = async (req, res) => {
  try {
    const farm = await db.Farm.findByPk(req.params.id, {
      include: [
        { model: db.Farmer, as: 'farmer', attributes: ['id', 'name', 'email'] },
        { model: db.Crop, as: 'crops' }
      ]
    });
    if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
    res.json({ success: true, farm });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CREATE FARM ──────────────────────────────────────────────
exports.createFarm = async (req, res) => {
  try {
    // Find farmer profile for logged in user
    const farmer = await db.Farmer.findOne({
      where: { userId: req.user.id }
    });

    if (!farmer) {
      return res.status(403).json({
        success: false,
        message: 'Farmer profile not found. Please complete your profile.'
      });
    }

    const farm = await db.Farm.create({
      ...req.body,
      farmerId: farmer.id, // ✅ always link to logged in farmer
    });

    res.status(201).json({ success: true, farm });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── UPDATE FARM ──────────────────────────────────────────────
exports.updateFarm = async (req, res) => {
  try {
    const farm = await db.Farm.findByPk(req.params.id);
    if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
    await farm.update(req.body);
    res.json({ success: true, farm });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE FARM ──────────────────────────────────────────────
exports.deleteFarm = async (req, res) => {
  try {
    const farm = await db.Farm.findByPk(req.params.id);
    if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
    await farm.destroy();
    res.json({ success: true, message: 'Farm deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};