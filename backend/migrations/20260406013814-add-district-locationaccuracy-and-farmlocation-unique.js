'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add district column to Farms
    await queryInterface.addColumn('Farms', 'district', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // 2. Add locationAccuracy column to Farms
    await queryInterface.addColumn('Farms', 'locationAccuracy', {
      type: Sequelize.ENUM('gps_at_farm', 'map_pin', 'district_fallback'),
      allowNull: true,
      defaultValue: 'district_fallback',
    });

    // 3. Add unique constraint to farm_locations.farmId
    await queryInterface.addConstraint('farm_locations', {
      fields: ['farmId'],
      type: 'unique',
      name: 'unique_farm_location_farmId',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('farm_locations', 'unique_farm_location_farmId');
    await queryInterface.removeColumn('Farms', 'locationAccuracy');
    await queryInterface.removeColumn('Farms', 'district');
  }
};