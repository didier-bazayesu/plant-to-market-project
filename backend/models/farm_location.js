// models/FarmLocation.js
module.exports = (sequelize, DataTypes) => {
  const FarmLocation = sequelize.define('FarmLocation', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmId: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // ← add unique: true
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  }, {
    timestamps: true,
    tableName: 'farm_locations'
  });

  FarmLocation.associate = models => {
    FarmLocation.belongsTo(models.Farm, { foreignKey: 'farmId', as: 'farm' });
  };

  return FarmLocation;
};