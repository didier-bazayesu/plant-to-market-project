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

    const { latitude, longitude, locationAccuracy, ...farmData } = req.body;

    const farm = await db.Farm.create({
      ...farmData,
      farmerId: farmer.id,
      locationAccuracy: locationAccuracy || 'district_fallback',
    });

    // ✅ create instead of upsert — new farm always has no FarmLocation yet
    if (latitude && longitude) {
      await db.FarmLocation.create({
        farmId: farm.id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      console.log(`✅ FarmLocation created for farm ${farm.id}`);
    }

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

exports.updateFarm = async (req, res) => {
  try {
    const farm = await db.Farm.findByPk(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    const { latitude, longitude, locationAccuracy, id, farmerId, ...safeData } = req.body;

    // ✅ Update safe farm fields
    await farm.update({
      ...safeData,
      ...(locationAccuracy && { locationAccuracy }),
    });

    // ✅ Update FarmLocation using findOne + update/create instead of upsert
    if (latitude && longitude) {
      const existingLocation = await db.FarmLocation.findOne({
        where: { farmId: farm.id }
      });

      if (existingLocation) {
        // Row exists — update it
        await existingLocation.update({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
        console.log(`✅ FarmLocation updated for farm ${farm.id}`);
      } else {
        // No row yet — create it
        await db.FarmLocation.create({
          farmId: farm.id,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
        console.log(`✅ FarmLocation created for farm ${farm.id}`);
      }
    }

    // ✅ Return updated farm with gpsLocation included
    const updatedFarm = await db.Farm.findByPk(farm.id, {
      include: [
        { model: db.FarmLocation, as: 'gpsLocation' },
        { model: db.Crop, as: 'crops' },
      ]
    });

    res.json({ success: true, farm: updatedFarm });

  } catch (err) {
    console.error('updateFarm error:', err);
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