const express = require('express');
const router = express.Router();
const db = require('../models');

// ─── GET PUBLIC PLATFORM STATS ────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [farmers, farms, crops, activities, districts] = await Promise.all([
      db.Farmer.count(),
      db.Farm.count(),
      db.Crop.count(),
      db.Activity.count(),
      db.Farm.count({ col: 'district', distinct: true }),  // ← add this
    ]);

    res.json({
      success: true,
      stats: {
        totalFarmers: farmers,
        totalFarms: farms,
        totalCrops: crops,
        totalActivities: activities,
        totalDistricts: districts,  // ← add this
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;