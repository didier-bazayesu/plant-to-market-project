const db = require('../models');

// ─── GET ALL USERS ────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: db.Farmer,
          as: 'farmerProfile',
          include: [
            {
              model: db.Farm,
              as: 'farms',
              include: [
                { model: db.FarmLocation, as: 'gpsLocation' },
                {
                  model: db.Crop,
                  as: 'crops',
                  include: [
                    { model: db.Activity, as: 'activities' }
                  ]
                }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // ✅ Consistent response format
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── GET SINGLE USER WITH FULL NESTED DATA ────────────────────
exports.getUserDetails = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: db.Farmer,
          as: 'farmerProfile',
          include: [
            {
              model: db.Farm,
              as: 'farms',
              include: [
                { model: db.FarmLocation, as: 'gpsLocation' },
                {
                  model: db.Crop,
                  as: 'crops',
                  include: [
                    { model: db.Activity, as: 'activities' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✅ Consistent response format
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── UPDATE USER ──────────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, district } = req.body;

    // ✅ Update User — include phone
    await db.User.update(
      { name, email, phone, district },
      { where: { id } }
    );

    // ✅ Update Farmer profile if exists
    await db.Farmer.update(
      { name, email, phone },
      { where: { userId: id } }
    );

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── DELETE USER ──────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ DB cascade handles Farmer → Farm → FarmLocation → Crop → Activity
    // Just delete the User and everything cascades automatically
    const deleted = await db.User.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};