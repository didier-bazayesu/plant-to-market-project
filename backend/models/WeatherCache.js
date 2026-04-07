// backend/models/WeatherCache.js
// Stores weather data fetched from OWM and NASA POWER.
// One row per unique location (rounded to 2 decimal places).
// Two independent refresh cycles: OWM every 3 hours, NASA every 30 days.

'use strict';

module.exports = (sequelize, DataTypes) => {
  const WeatherCache = sequelize.define('WeatherCache', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Cache key — format: lat_X.XX_lon_X.XX
    cacheKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    // Rounded coordinates used to build the cache key
    lat: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    lon: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },

    // OpenWeatherMap — current weather + 5-day forecast
    // Stored as JSON string, parsed on read
    owmData: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      get() {
        const raw = this.getDataValue('owmData');
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(value) {
        this.setDataValue('owmData', value ? JSON.stringify(value) : null);
      }
    },

    // Timestamp of last OWM fetch — refresh every 3 hours
    owmFetchedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // NASA POWER — historical climatology (monthly rainfall, temp, ET)
    // Stored as JSON string, parsed on read
    nasaData: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      get() {
        const raw = this.getDataValue('nasaData');
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(value) {
        this.setDataValue('nasaData', value ? JSON.stringify(value) : null);
      }
    },

    // Timestamp of last NASA fetch — refresh every 30 days
    nasaFetchedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

  }, {
    timestamps: true,
    tableName: 'weather_caches',
  });

  // No associations needed — WeatherCache is standalone,
  // looked up by cacheKey from farm coordinates.

  return WeatherCache;
};