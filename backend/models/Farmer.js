const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Farmer = sequelize.define('Farmer', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  }, { 
    timestamps: false,
    createdAt: false  // ✅ explicitly disable createdAt
  });

  Farmer.associate = models => {
    Farmer.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Farmer.hasMany(models.Farm, { foreignKey: 'farmerId', as: 'farms' });
  };

  return Farmer;
};