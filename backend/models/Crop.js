module.exports = (sequelize, DataTypes) => {
  const Crop = sequelize.define('Crop', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmId: { type: DataTypes.INTEGER, allowNull: false },
    cropType: { type: DataTypes.STRING, allowNull: false },
    plantingDate: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('planted','growing','harvested'), defaultValue: 'planted' },
  }, { timestamps: false });

  Crop.associate = models => {
    Crop.belongsTo(models.Farm, { foreignKey: 'farmId', as: 'farm' });
    Crop.hasMany(models.Activity, { foreignKey: 'cropId', as: 'activities' }); // ✅ was crop_id
    Crop.hasMany(models.Harvest, { foreignKey: 'cropId', as: 'harvests' });    // ✅ was crop_id
  };

  return Crop;
};