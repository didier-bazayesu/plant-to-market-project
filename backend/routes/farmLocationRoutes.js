const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { FarmLocation, Farm } = require('../models');

// Save or update GPS coordinates for a farm
router.post('/:farmId/location', protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const { farmId } = req.params;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'latitude and longitude required' });
    }

    // Upsert — create or update
    const [location, created] = await FarmLocation.upsert({
      farmId: Number(farmId),
      latitude,
      longitude,
    }, { returning: true });

    res.json({ success: true, location, created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get GPS coordinates for a farm
router.get('/:farmId/location', protect, async (req, res) => {
  try {
    const location = await FarmLocation.findOne({
      where: { farmId: req.params.farmId }
    });
    res.json({ success: true, location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;