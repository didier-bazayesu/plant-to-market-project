'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Crops', 'variety', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Crops', 'harvestDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Crops', 'harvestDate');
    await queryInterface.removeColumn('Crops', 'variety');
  }
};