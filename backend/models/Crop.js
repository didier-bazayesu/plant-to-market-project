// models/Crop.js
module.exports = (sequelize, DataTypes) => {
  const Crop = sequelize.define('Crop', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farm_id: { type: DataTypes.INTEGER, allowNull: false },
    crop_type: { type: DataTypes.STRING, allowNull: false },
    planting_date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('planted','growing','harvested'), defaultValue: 'planted' },
  }, { timestamps: false });

  Crop.associate = models => {
    Crop.belongsTo(models.Farm, { foreignKey: 'farm_id' });
    Crop.hasMany(models.Activity, { foreignKey: 'crop_id' });
    Crop.hasOne(models.Harvest, { foreignKey: 'crop_id' });
  };

  return Crop;
};
