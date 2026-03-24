const db = require('../models');

exports.createPrice = async (req, res) => {
  try {
    const price = await db.MarketPrice.create(req.body);
    res.status(201).json(price);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPrices = async (req, res) => {
  const prices = await db.MarketPrice.findAll();
  res.json(prices);
};
