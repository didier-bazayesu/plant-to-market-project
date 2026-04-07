// backend/routes/weatherRoutes.js

'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getWeatherForDistrict } = require('../services/weatherService');
const { getCropAdvice } = require('../services/cropAdvisor');
const { getPlantingWindows, getHarvestETA, getSeasonSummary } = require('../services/plantingCalendar');
const db = require('../models');

// ─── GET /api/weather/:district ───────────────────────────────────────────────
// Returns current + forecast weather for a district center coordinate.

router.get('/weather/:district', protect, async (req, res) => {
  try {
    const data = await getWeatherForDistrict(req.params.district);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── GET /api/crops/:id/advice ────────────────────────────────────────────────
// Returns crop-specific weather alerts and recommendations.

router.get('/crops/:id/advice', protect, async (req, res) => {
  try {
    // Load crop with its farm and farm's GPS location
    const crop = await db.Crop.findByPk(req.params.id, {
      include: [
        {
          model: db.Farm,
          as: 'farm',
          include: [
            { model: db.FarmLocation, as: 'gpsLocation' }
          ]
        }
      ]
    });

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (!crop.farm) {
      return res.status(404).json({ success: false, message: 'Farm not found for this crop' });
    }

    const advice = await getCropAdvice(crop, crop.farm);
    res.json({ success: true, advice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/crops/:id/calendar ──────────────────────────────────────────────
// Returns planting windows and harvest ETA for a crop.

router.get('/crops/:id/calendar', protect, async (req, res) => {
  try {
    const crop = await db.Crop.findByPk(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    const plantingWindows = getPlantingWindows(crop.cropType);
    const harvestETA      = getHarvestETA(crop);
    const seasonSummary   = getSeasonSummary();

    res.json({
      success: true,
      calendar: {
        cropId:   crop.id,
        cropType: crop.cropType,
        seasonSummary,
        plantingWindows,
        harvestETA,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;