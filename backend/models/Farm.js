// models/Farm.js
module.exports = (sequelize, DataTypes) => {
  const Farm = sequelize.define('Farm', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmer_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.FLOAT },
    location: { type: DataTypes.STRING },
    soil_type: { type: DataTypes.STRING }
  }, { timestamps: false });

  Farm.associate = models => {
    Farm.belongsTo(models.Farmer, { foreignKey: 'farmer_id' });
    Farm.hasMany(models.Crop, { foreignKey: 'farm_id' });
  };

  return Farm;
};
