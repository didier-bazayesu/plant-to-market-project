module.exports = (sequelize, DataTypes) => {
  const Harvest = sequelize.define('Harvest', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cropId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.FLOAT },
    quality: { type: DataTypes.STRING },
    revenue: { type: DataTypes.FLOAT },
    date: { type: DataTypes.DATE, allowNull: false }
  }, { timestamps: false });

  Harvest.associate = models => {
    Harvest.belongsTo(models.Crop, { foreignKey: 'cropId', as: 'crop' });
  };

  return Harvest;
};