'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('weather_caches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cacheKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      lat: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      },
      lon: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      },
      owmData: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      owmFetchedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      nasaData: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      nasaFetchedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('weather_caches');
  }
};