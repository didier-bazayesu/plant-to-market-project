module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cropId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('irrigation','fertilization','pesticide'), allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    notes: { type: DataTypes.TEXT }
  }, { timestamps: false });

  Activity.associate = models => {
    Activity.belongsTo(models.Crop, { foreignKey: 'cropId', as: 'crop' });
  };

  return Activity;
};