const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    role: {
      type: DataTypes.ENUM('admin', 'farmer'),
      allowNull: false,
      defaultValue: 'farmer'
    }
  }, { timestamps: true });

 User.associate = models => {
  User.hasOne(models.Farmer, { foreignKey: 'userId', as: 'farmerProfile' }); // ✅ was user_id
 };

  return User;
};
