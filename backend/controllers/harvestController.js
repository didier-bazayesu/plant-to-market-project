const db = require('../models');

exports.createHarvest = async (req, res) => {
  try {
    const { cropId, quantity, quality, revenue, date } = req.body;

    // Verify this crop belongs to the logged-in user
    const farmer = await db.Farmer.findOne({ where: { userId: req.user.id } });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    const farms = await db.Farm.findAll({ where: { farmerId: farmer.id } });
    const farmIds = farms.map(f => f.id);

    const crop = await db.Crop.findOne({ where: { id: cropId, farmId: farmIds } });
    if (!crop) return res.status(403).json({ message: 'Crop not found or not yours' });

    const harvest = await db.Harvest.create({ cropId, quantity, quality, revenue, date });
    res.status(201).json({ success: true, harvest });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getHarvests = async (req, res) => {
  try {
    const farmer = await db.Farmer.findOne({ where: { userId: req.user.id } });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    const farms = await db.Farm.findAll({ where: { farmerId: farmer.id } });
    const farmIds = farms.map(f => f.id);

    const crops = await db.Crop.findAll({ where: { farmId: farmIds } });
    const cropIds = crops.map(c => c.id);

    const harvests = await db.Harvest.findAll({
      where: { cropId: cropIds },
      include: [{ model: db.Crop, as: 'crop' }],
      order: [['date', 'DESC']]
    });

    res.json({ success: true, harvests });
  } catch (err) {
    console.error('[HARVEST ERROR]:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};