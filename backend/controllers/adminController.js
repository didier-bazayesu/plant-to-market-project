const { User, Farmer, Farm, Crop, Activity } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Farmer,
          as: 'farmerProfile',
          include: [
            {
              model: Farm,
              as: 'farms',
              include: [
                {
                  model: Crop,
                  as: 'crops',
                  include: [
                    { model: Activity, as: 'activities' }
                  ]
                }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Farmer,
          as: 'farmerProfile',
          include: [
            {
              model: Farm,
              as: 'farms',
              include: [
                {
                  model: Crop,
                  as: 'crops',
                  include: [
                    { model: Activity, as: 'activities' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, district } = req.body;

    await User.update(
      { name, email, district },
      { where: { id } }
    );

    await Farmer.update(
      { name, email, phone },
      { where: { userId: id } }
    );

    res.json({ success: true, message: "User and Farmer profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const farmer = await Farmer.findOne({ where: { userId: id } });
    if (farmer) {
      const farms = await Farm.findAll({ where: { farmerId: farmer.id } });
      for (const farm of farms) {
        const crops = await Crop.findAll({ where: { farmId: farm.id } });
        for (const crop of crops) {
          await Activity.destroy({ where: { cropId: crop.id } });
        }
        await Crop.destroy({ where: { farmId: farm.id } });
      }
      await Farm.destroy({ where: { farmerId: farmer.id } });
      await Farmer.destroy({ where: { id: farmer.id } });
    }

    const deleted = await User.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User and all associated data wiped successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};