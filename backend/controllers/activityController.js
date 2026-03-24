const db = require('../models');

exports.createActivity = async (req, res) => {
  try {
    const activity = await db.Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getActivities = async (req, res) => {
  const activities = await db.Activity.findAll({ include: db.Crop });
  res.json(activities);
};
