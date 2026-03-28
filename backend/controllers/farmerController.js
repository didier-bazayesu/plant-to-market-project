const { Farmer, User, Farm, Crop, Activity, Harvest } = require('../models');

module.exports = {

  // ─── CREATE FARMER ──────────────────────────────────────────
  createFarmer: async (req, res) => {
    try {
      const { name, email, phone, passwordHash } = req.body;
      const farmer = await Farmer.create({ name, email, phone, passwordHash });
      res.status(201).json({ success: true, farmer });
    } catch (err) {
      console.error('[ERROR]', err);
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // ─── GET ALL FARMERS ────────────────────────────────────────
  getFarmers: async (req, res) => {
    try {
      const farmers = await Farmer.findAll({
        attributes: { exclude: ['passwordHash'] }, // ✅ updated field name
        include: [
          {
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] }
          },
          {
            model: Farm,
            as: 'farms',
            include: [
              {
                model: Crop,
                as: 'crops',
                include: [
                  { model: Activity, as: 'activities' },
                  { model: Harvest, as: 'harvests' }
                ]
              }
            ]
          }
        ]
      });
      res.json({ success: true, farmers });
    } catch (err) {
      console.error('[ERROR]', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // ─── GET SINGLE FARMER ──────────────────────────────────────
  getFarmer: async (req, res) => {
    try {
      const farmer = await Farmer.findByPk(req.params.id, {
        attributes: { exclude: ['passwordHash'] },
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          {
            model: Farm, as: 'farms',
            include: [{ model: Crop, as: 'crops' }]
          }
        ]
      });
      if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
      res.json({ success: true, farmer });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // ─── UPDATE FARMER ──────────────────────────────────────────
  updateFarmer: async (req, res) => {
    try {
      const farmer = await Farmer.findByPk(req.params.id);
      if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
      await farmer.update(req.body);
      res.json({ success: true, farmer });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // ─── DELETE FARMER ──────────────────────────────────────────
  deleteFarmer: async (req, res) => {
    try {
      const farmer = await Farmer.findByPk(req.params.id);
      if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
      await farmer.destroy();
      res.json({ success: true, message: 'Farmer deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};