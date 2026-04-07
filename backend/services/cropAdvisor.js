// backend/services/cropAdvisor.js
'use strict';

const { getCropRequirements, isSoilCompatible } = require('../data/cropRequirements');
const { getWeatherForFarm } = require('./weatherService');

const ALERT_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

function parseCurrentConditions(owmData) {
  if (!owmData?.current) return null;
  const c = owmData.current;
  return {
    tempC: c.main?.temp ?? null,
    humidity: c.main?.humidity ?? null,
    weatherId: c.weather?.[0]?.id,
    weatherMain: c.weather?.[0]?.main,
    weatherDesc: c.weather?.[0]?.description,
    windSpeed: c.wind?.speed,
    rain1h: c.rain?.['1h'] || 0,
  };
}

function parseForecastRainfall(owmData) {
  if (!owmData?.forecast?.list) return null;

  const totalRain = owmData.forecast.list.reduce((sum, item) => {
    return sum + (item.rain?.['3h'] || 0);
  }, 0);

  const temps = owmData.forecast.list
    .map(i => i.main?.temp)
    .filter(t => t != null);

  if (temps.length === 0) return { totalRainMm: totalRain, maxTempC: null, minTempC: null };

  return {
    totalRainMm: totalRain,
    maxTempC: Math.max(...temps),
    minTempC: Math.min(...temps),
  };
}

function parseNASAClimatology(nasaData) {
  if (!nasaData?.climatology) return null;
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const c = nasaData.climatology;
  return {
    avgRainfallMm: c.PRECTOTCORR?.[month] != null ? c.PRECTOTCORR[month] * 30 : null,
    avgTempC: c.T2M?.[month] ?? null,
    avgMaxTempC: c.T2M_MAX?.[month] ?? null,
    avgMinTempC: c.T2M_MIN?.[month] ?? null,
    evapotranspirationMm: c.EVPTRNS?.[month] ?? null,
  };
}

function checkTemperatureAlerts(current, forecast, requirements) {
  const alerts = [];
  const { temperature, alerts: messages } = requirements;

  // Current temperature — only run if tempC is a real number
  if (current?.tempC != null) {
    if (current.tempC < temperature.minC) {
      alerts.push({
        level: ALERT_LEVELS.CRITICAL,
        type: 'cold_stress',
        message: messages.coldStress,
        value: `Current temp: ${current.tempC.toFixed(1)}°C (min: ${temperature.minC}°C)`,
      });
    } else if (current.tempC > temperature.maxC) {
      alerts.push({
        level: ALERT_LEVELS.CRITICAL,
        type: 'heat_stress',
        message: messages.heatStress,
        value: `Current temp: ${current.tempC.toFixed(1)}°C (max: ${temperature.maxC}°C)`,
      });
    } else if (current.tempC < temperature.optimalMinC) {
      alerts.push({
        level: ALERT_LEVELS.INFO,
        type: 'below_optimal_temp',
        message: `Temperature is below optimal range for this crop`,
        value: `Current: ${current.tempC.toFixed(1)}°C (optimal: ${temperature.optimalMinC}–${temperature.optimalMaxC}°C)`,
      });
    } else if (current.tempC > temperature.optimalMaxC) {
      alerts.push({
        level: ALERT_LEVELS.WARNING,
        type: 'above_optimal_temp',
        message: `Temperature is above optimal range for this crop`,
        value: `Current: ${current.tempC.toFixed(1)}°C (optimal: ${temperature.optimalMinC}–${temperature.optimalMaxC}°C)`,
      });
    }
  }

  // Forecast temperature — only run if values are real numbers
  if (forecast?.maxTempC != null && forecast?.minTempC != null) {
    if (forecast.maxTempC > temperature.maxC) {
      alerts.push({
        level: ALERT_LEVELS.WARNING,
        type: 'forecast_heat',
        message: `Heat stress expected in the next 5 days`,
        value: `Forecast max: ${forecast.maxTempC.toFixed(1)}°C`,
      });
    }
    if (forecast.minTempC < temperature.minC) {
      alerts.push({
        level: ALERT_LEVELS.WARNING,
        type: 'forecast_cold',
        message: `Cold stress expected in the next 5 days`,
        value: `Forecast min: ${forecast.minTempC.toFixed(1)}°C`,
      });
    }
  }

  return alerts;
}

function checkRainfallAlerts(current, forecast, climatology, requirements) {
  const alerts = [];
  const { water, alerts: messages } = requirements;

  if (current?.rain1h > 10) {
    alerts.push({
      level: ALERT_LEVELS.WARNING,
      type: 'heavy_rain',
      message: messages.excessRain,
      value: `Current rainfall: ${current.rain1h}mm/hr`,
    });
  }

  if (forecast?.totalRainMm != null) {
    if (forecast.totalRainMm > water.maxRainfallMm * 0.3) {
      alerts.push({
        level: ALERT_LEVELS.WARNING,
        type: 'excess_forecast_rain',
        message: messages.excessRain,
        value: `5-day forecast: ${forecast.totalRainMm.toFixed(0)}mm expected`,
      });
    } else if (forecast.totalRainMm < 10 && !water.droughtTolerant) {
      alerts.push({
        level: ALERT_LEVELS.WARNING,
        type: 'drought_risk',
        message: messages.drought,
        value: `5-day forecast: only ${forecast.totalRainMm.toFixed(0)}mm expected`,
      });
    }
  }

  if (climatology?.avgRainfallMm != null) {
    if (climatology.avgRainfallMm < water.minRainfallMm * 0.5 && !water.droughtTolerant) {
      alerts.push({
        level: ALERT_LEVELS.INFO,
        type: 'seasonal_dry_period',
        message: `This is historically a dry period for this region`,
        value: `Avg monthly rainfall: ${climatology.avgRainfallMm.toFixed(0)}mm`,
      });
    }
  }

  return alerts;
}

function checkSoilAlerts(soilType, requirements) {
  const alerts = [];
  if (!soilType) return alerts;
  const compatible = isSoilCompatible(requirements.name.toLowerCase(), soilType);
  if (compatible === false) {
    alerts.push({
      level: ALERT_LEVELS.WARNING,
      type: 'soil_incompatible',
      message: `Soil type '${soilType}' is not ideal for ${requirements.name}`,
      value: `Recommended soils: ${requirements.soilTypes.join(', ')}`,
    });
  }
  return alerts;
}

function checkIrrigationRecommendation(forecast, climatology, requirements) {
  const alerts = [];
  const { water } = requirements;
  if (water.irrigationBenefit === 'high') {
    const lowForecastRain = forecast?.totalRainMm != null && forecast.totalRainMm < 20;
    const dryMonth = climatology?.avgRainfallMm != null && climatology.avgRainfallMm < water.minRainfallMm * 0.6;
    if (lowForecastRain || dryMonth) {
      alerts.push({
        level: ALERT_LEVELS.INFO,
        type: 'irrigation_recommended',
        message: `Irrigation recommended — this crop benefits greatly from consistent water`,
        value: water.droughtTolerant
          ? 'Drought tolerant but yields improve with irrigation'
          : 'Not drought tolerant — irrigation important',
      });
    }
  }
  return alerts;
}

async function getCropAdvice(crop, farm) {
  const requirements = getCropRequirements(crop.cropType);

  if (!requirements) {
    return {
      cropId: crop.id,
      cropType: crop.cropType,
      supported: false,
      message: `No requirements data found for crop type: ${crop.cropType}`,
      alerts: [],
    };
  }

  let weatherData;
  try {
    weatherData = await getWeatherForFarm(farm);
  } catch (err) {
    return {
      cropId: crop.id,
      cropType: crop.cropType,
      supported: true,
      weatherAvailable: false,
      message: `Weather data unavailable: ${err.message}`,
      alerts: [],
    };
  }

  const current     = parseCurrentConditions(weatherData.owm);
  const forecast    = parseForecastRainfall(weatherData.owm);
  const climatology = parseNASAClimatology(weatherData.nasa);

  const alerts = [
    ...checkTemperatureAlerts(current, forecast, requirements),
    ...checkRainfallAlerts(current, forecast, climatology, requirements),
    ...checkSoilAlerts(farm.soilType, requirements),
    ...checkIrrigationRecommendation(forecast, climatology, requirements),
  ];

  const levelOrder = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);

  return {
    cropId: crop.id,
    cropType: crop.cropType,
    cropName: requirements.name,
    supported: true,
    weatherAvailable: true,
    locationAccuracy: weatherData.accuracy,
    current: current ? {
      tempC: current.tempC,
      humidity: current.humidity,
      weatherDesc: current.weatherDesc,
      rain1h: current.rain1h,
    } : null,
    forecast: forecast ? {
      totalRainMm5day: forecast.totalRainMm,
      maxTempC: forecast.maxTempC,
      minTempC: forecast.minTempC,
    } : null,
    climatology: climatology ? {
      avgMonthlyRainMm: climatology.avgRainfallMm,
      avgTempC: climatology.avgTempC,
    } : null,
    alerts,
    alertCount: {
      critical: alerts.filter(a => a.level === 'critical').length,
      warning:  alerts.filter(a => a.level === 'warning').length,
      info:     alerts.filter(a => a.level === 'info').length,
    }
  };
}

module.exports = { getCropAdvice, ALERT_LEVELS };