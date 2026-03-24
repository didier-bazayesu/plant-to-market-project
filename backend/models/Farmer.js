// models/Farmer.js
module.exports = (sequelize, DataTypes) => {
  const Farmer = sequelize.define('Farmer', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { timestamps: false });

  Farmer.associate = models => {
    Farmer.hasMany(models.Farm, { foreignKey: 'farmer_id' });
  };

  return Farmer;
};
