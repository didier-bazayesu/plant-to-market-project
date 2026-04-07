// models/Farm.js
module.exports = (sequelize, DataTypes) => {
  const Farm = sequelize.define('Farm', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.FLOAT },
    location: { type: DataTypes.STRING },
    soilType: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },                // ← add
    locationAccuracy: {                                   // ← add
      type: DataTypes.ENUM('gps_at_farm', 'map_pin', 'district_fallback'),
      defaultValue: 'district_fallback'
    }
  }, { timestamps: false });

  Farm.associate = models => {
    Farm.belongsTo(models.Farmer, { foreignKey: 'farmerId', as: 'farmer' });
    Farm.hasMany(models.Crop, { foreignKey: 'farmId', as: 'crops' });
    Farm.hasOne(models.FarmLocation, { foreignKey: 'farmId', as: 'gpsLocation' });
  };

  return Farm;
};