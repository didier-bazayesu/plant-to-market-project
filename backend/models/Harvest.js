// models/Harvest.js
module.exports = (sequelize, DataTypes) => {
  const Harvest = sequelize.define('Harvest', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    crop_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.FLOAT },
    quality: { type: DataTypes.STRING },
    revenue: { type: DataTypes.FLOAT },
    date: { type: DataTypes.DATE, allowNull: false }
  }, { timestamps: false });

  Harvest.associate = models => {
    Harvest.belongsTo(models.Crop, { foreignKey: 'crop_id' });
  };

  return Harvest;
};
