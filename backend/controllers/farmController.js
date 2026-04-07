const db = require('../models');

// ─── GET ALL FARMS ────────────────────────────────────────────
exports.getFarms = async (req, res) => {
  try {
    // ✅ Admin sees ALL farms
    if (req.user.role === 'admin') {
      const farms = await db.Farm.findAll({
        include: [
          { model: db.Farmer, as: 'farmer', attributes: ['id', 'name', 'email'] },
          { model: db.Crop, as: 'crops' },
          { model: db.FarmLocation, as: 'gpsLocation' }, // ✅ added
        ]
      });
      return res.json({ success: true, farms });
    }

    // Farmer sees only their farms
    const farmer = await db.Farmer.findOne({
      where: { userId: req.user.id }
    });

    if (!farmer) {
      return res.json({ success: true, farms: [] });
    }

    const farms = await db.Farm.findAll({
      where: { farmerId: farmer.id },
      include: [
        { model: db.Farmer, as: 'farmer', attributes: ['id', 'name', 'email'] },
        { model: db.Crop, as: 'crops' },
        { model: db.FarmLocation, as: 'gpsLocation' }, // ✅ already here
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
        { model: db.Crop, as: 'crops' },
        { model: db.FarmLocation, as: 'gpsLocation' },
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
    const farmer = await db.Farmer.findOne({
      where: { userId: req.user.id }
    });

    if (!farmer) {
      return res.status(403).json({
        success: false,
        message: 'Farmer profile not found. Please complete your profile.'
      });
    }

    // ✅ Destructure coordinates out — don't spread them into Farm model
    const { latitude, longitude, locationAccuracy, ...farmData } = req.body;

    const farm = await db.Farm.create({
      ...farmData,
      farmerId: farmer.id,
      locationAccuracy: locationAccuracy || 'district_fallback',
    });

    // ✅ Save coordinates to FarmLocation if provided
    if (latitude && longitude) {
      await db.FarmLocation.upsert({
        farmId: farm.id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
    }

    // ✅ Return farm with gpsLocation so frontend mapFarm works correctly
    const farmWithLocation = await db.Farm.findByPk(farm.id, {
      include: [
        { model: db.FarmLocation, as: 'gpsLocation' }
      ]
    });

    res.status(201).json({ success: true, farm: farmWithLocation });

  } catch (err) {
    console.error('createFarm error:', err);
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

// ─── GET FARMS BY USER (admin use) ───────────────────────────
exports.getFarmsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const farmer = await db.Farmer.findOne({
      where: { userId },
      include: [
        {
          model: db.Farm,
          as: 'farms',
          include: [
            { model: db.Crop, as: 'crops' },
            { model: db.FarmLocation, as: 'gpsLocation' }, // ✅ added
          ]
        }
      ]
    });

    if (!farmer) {
      return res.json({ success: true, farms: [] });
    }

    res.json({ success: true, farms: farmer.farms });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};