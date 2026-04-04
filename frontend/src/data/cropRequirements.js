// src/data/cropRequirements.js
export const CROP_REQUIREMENTS = {
  'Maize': {
    tempMin: 18, tempMax: 32,
    humidityMin: 50, humidityMax: 80,
    rainfall: 'moderate',
    waterNeeds: 'medium',
    diseaseRisk: { highHumidity: 85, lowTemp: 15 },
    alerts: {
      tooHot: 'Maize is heat stressed above 32°C. irrigate immediately.',
      tooCold: 'Maize growth slows below 18°C. monitor closely.',
      tooWet: 'High humidity risks maize leaf blight. apply fungicide.',
      tooDry: 'Maize needs irrigation. humidity is too low.',
      optimal: 'Conditions are optimal for maize growth.',
    }
  },
  'Potato': {
    tempMin: 15, tempMax: 25,
    humidityMin: 60, humidityMax: 80,
    rainfall: 'moderate',
    waterNeeds: 'high',
    diseaseRisk: { highHumidity: 80, lowTemp: 10 },
    alerts: {
      tooHot: 'Potatoes struggle above 25°C. risk of tuber deformation.',
      tooCold: 'Frost risk for potatoes below 15°C.',
      tooWet: 'High humidity risks late blight in potatoes. spray mancozeb.',
      tooDry: 'Potatoes need consistent moisture. irrigate now.',
      optimal: 'Good conditions for potato growth.',
    }
  },
  'Beans': {
    tempMin: 16, tempMax: 30,
    humidityMin: 45, humidityMax: 75,
    rainfall: 'low',
    waterNeeds: 'low',
    diseaseRisk: { highHumidity: 80, lowTemp: 12 },
    alerts: {
      tooHot: 'Beans may drop flowers above 30°C.',
      tooCold: 'Bean germination slows below 16°C.',
      tooWet: 'Beans are prone to root rot in high humidity.',
      tooDry: 'Beans need moderate water especially during flowering.',
      optimal: 'Good conditions for beans.',
    }
  },
  'Rice': {
    tempMin: 20, tempMax: 35,
    humidityMin: 70, humidityMax: 90,
    rainfall: 'high',
    waterNeeds: 'very high',
    diseaseRisk: { highHumidity: 95, lowTemp: 18 },
    alerts: {
      tooHot: 'Rice pollen sterility risk above 35°C.',
      tooCold: 'Rice growth stops below 20°C.',
      tooWet: 'Monitor for rice blast disease in very high humidity.',
      tooDry: 'Rice needs flooded conditions. ensure water supply.',
      optimal: 'Ideal conditions for rice cultivation.',
    }
  },
  'Sorghum': {
    tempMin: 20, tempMax: 38,
    humidityMin: 30, humidityMax: 70,
    rainfall: 'low',
    waterNeeds: 'low',
    diseaseRisk: { highHumidity: 80, lowTemp: 15 },
    alerts: {
      tooHot: 'Sorghum tolerates heat but monitor above 38°C.',
      tooCold: 'Sorghum growth slows below 20°C.',
      tooWet: 'Sorghum is drought tolerant but waterlogging causes root rot.',
      tooDry: 'Sorghum handles dry conditions well. minimal irrigation needed.',
      optimal: 'Good conditions for sorghum.',
    }
  },
  'Cassava': {
    tempMin: 18, tempMax: 35,
    humidityMin: 40, humidityMax: 80,
    rainfall: 'low',
    waterNeeds: 'low',
    diseaseRisk: { highHumidity: 85, lowTemp: 15 },
    alerts: {
      tooHot: 'Cassava tolerates heat well. monitor above 35°C.',
      tooCold: 'Cassava growth stops below 18°C.',
      tooWet: 'High humidity risks cassava mosaic virus spread.',
      tooDry: 'Cassava is drought tolerant. minimal irrigation needed.',
      optimal: 'Good conditions for cassava.',
    }
  },
  'Wheat': {
    tempMin: 10, tempMax: 24,
    humidityMin: 40, humidityMax: 70,
    rainfall: 'moderate',
    waterNeeds: 'medium',
    diseaseRisk: { highHumidity: 75, lowTemp: 5 },
    alerts: {
      tooHot: 'Wheat grain filling affected above 24°C.',
      tooCold: 'Frost can damage wheat below 10°C.',
      tooWet: 'High humidity risks wheat rust. apply fungicide.',
      tooDry: 'Wheat needs moderate moisture. irrigate if dry.',
      optimal: 'Good conditions for wheat.',
    }
  },
};

// Default requirements for unknown crops
export const DEFAULT_REQUIREMENTS = {
  tempMin: 15, tempMax: 30,
  humidityMin: 40, humidityMax: 80,
  waterNeeds: 'medium',
  alerts: {
    tooHot: 'High temperature detected. monitor your crop.',
    tooCold: 'Low temperature detected. monitor your crop.',
    tooWet: 'High humidity detected. watch for disease.',
    tooDry: 'Low humidity. consider irrigation.',
    optimal: 'Conditions look good for your crop.',
  }
};

// Get requirements for a crop
export const getCropRequirements = (cropName) => {
  if (!cropName) return DEFAULT_REQUIREMENTS;
  const key = Object.keys(CROP_REQUIREMENTS).find(k =>
    cropName.toLowerCase().includes(k.toLowerCase())
  );
  return key ? CROP_REQUIREMENTS[key] : DEFAULT_REQUIREMENTS;
};

// Generate per-crop weather recommendation
export const getCropWeatherAlert = (cropName, weather) => {
  const req = getCropRequirements(cropName);
  if (!weather) return null;

  const { temp, humidity } = weather;
  let status = 'optimal';
  let message = req.alerts.optimal;
  let severity = 'good';

  if (temp > req.tempMax) {
    status = 'tooHot';
    message = req.alerts.tooHot;
    severity = 'warning';
  } else if (temp < req.tempMin) {
    status = 'tooCold';
    message = req.alerts.tooCold;
    severity = 'warning';
  } else if (humidity > req.humidityMax) {
    status = 'tooWet';
    message = req.alerts.tooWet;
    severity = 'danger';
  } else if (humidity < req.humidityMin) {
    status = 'tooDry';
    message = req.alerts.tooDry;
    severity = 'info';
  }

  return {
    cropName,
    status,
    message,
    severity,
    idealTemp: `${req.tempMin}°C – ${req.tempMax}°C`,
    idealHumidity: `${req.humidityMin}% – ${req.humidityMax}%`,
    currentTemp: temp,
    currentHumidity: humidity,
    waterNeeds: req.waterNeeds,
  };
};