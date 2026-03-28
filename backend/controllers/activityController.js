const db = require('../models');

// ─── GET ALL ACTIVITIES (for logged in user) ──────────────────
exports.getActivities = async (req, res) => {
  try {
    // 1. Find farmer profile for logged in user
    const farmer = await db.Farmer.findOne({
      where: { userId: req.user.id }  // ✅ camelCase
    });

    if (!farmer) {
      return res.json({ success: true, activities: [] });
    }

    // 2. Get all farms for this farmer
    const farms = await db.Farm.findAll({
      where: { farmerId: farmer.id },
      attributes: ['id']
    });

    const farmIds = farms.map(f => f.id);

    if (farmIds.length === 0) {
      return res.json({ success: true, activities: [] });
    }

    // 3. Get all crops in those farms
    const crops = await db.Crop.findAll({
      where: { farmId: farmIds },
      attributes: ['id']
    });

    const cropIds = crops.map(c => c.id);

    if (cropIds.length === 0) {
      return res.json({ success: true, activities: [] });
    }

    // 4. Build where clause
    const where = { cropId: cropIds }; // ✅ only user's crops

    // 5. Filter by specific cropId if provided
    if (req.query.cropId) {
      const requestedCropId = parseInt(req.query.cropId);
      // Only allow if crop belongs to user
      if (cropIds.includes(requestedCropId)) {
        where.cropId = requestedCropId;
      } else {
        return res.json({ success: true, activities: [] });
      }
    }

    const activities = await db.Activity.findAll({
      where,
      include: [{ model: db.Crop, as: 'crop' }],
      order: [['date', 'DESC']]
    });

    res.json({ success: true, activities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET SINGLE ACTIVITY ──────────────────────────────────────
exports.getActivity = async (req, res) => {
  try {
    const activity = await db.Activity.findByPk(req.params.id, {
      include: [{ model: db.Crop, as: 'crop' }]
    });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CREATE ACTIVITY ──────────────────────────────────────────
exports.createActivity = async (req, res) => {
  try {
    const { cropId, type, date, notes } = req.body;

    // Verify crop belongs to logged in user
    const farmer = await db.Farmer.findOne({
      where: { userId: req.user.id }  // ✅ camelCase
    });

    if (!farmer) {
      return res.status(403).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    // Verify crop belongs to farmer's farm
    const crop = await db.Crop.findOne({
      where: { id: cropId },
      include: [{
        model: db.Farm,
        as: 'farm',
        where: { farmerId: farmer.id }
      }]
    });

    if (!crop) {
      return res.status(403).json({
        success: false,
        message: 'Crop not found or does not belong to you'
      });
    }

    const activity = await db.Activity.create({
      cropId,   // ✅ camelCase
      type,
      date,
      notes
    });

    res.status(201).json({ success: true, activity });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── UPDATE ACTIVITY ──────────────────────────────────────────
exports.updateActivity = async (req, res) => {
  try {
    const activity = await db.Activity.findByPk(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    await activity.update(req.body);
    res.json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE ACTIVITY ──────────────────────────────────────────
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await db.Activity.findByPk(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    await activity.destroy();
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};