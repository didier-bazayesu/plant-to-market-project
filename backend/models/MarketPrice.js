// models/MarketPrice.js
module.exports = (sequelize, DataTypes) => {
  const MarketPrice = sequelize.define('MarketPrice', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    crop_type: { type: DataTypes.STRING, allowNull: false },
    market_name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT },
    date: { type: DataTypes.DATE, allowNull: false }
  }, { timestamps: false });

  return MarketPrice;
};
