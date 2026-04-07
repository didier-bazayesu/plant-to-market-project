// src/data/cropRequirements.js
export const CROP_REQUIREMENTS = {
  'Maize': {
    tempMin: 18, tempMax: 32,
    humidityMin: 50, humidityMax: 80,
    alerts: {
      tooHot: '🌡️ High temperature alert! Maize needs irrigation immediately.',
      tooCold: '❄️ Low temperature alert! Maize growth will be slow.',
      tooWet: '💧 High humidity! Risk of leaf blight. Consider fungicide.',
      tooDry: '💨 Low humidity! Maize needs irrigation.',
      optimal: '✅ Conditions are optimal for maize growth.',
    }
  },
  'Beans': {
    tempMin: 16, tempMax: 30,
    humidityMin: 45, humidityMax: 75,
    alerts: {
      tooHot: '🌡️ Beans may drop flowers in this heat.',
      tooCold: '❄️ Bean germination slows in cold weather.',
      tooWet: '💧 High humidity! Risk of root rot in beans.',
      tooDry: '💨 Beans need water, especially during flowering.',
      optimal: '✅ Good conditions for beans.',
    }
  },
  'Potato': {
    tempMin: 15, tempMax: 25,
    humidityMin: 60, humidityMax: 80,
    alerts: {
      tooHot: '🌡️ Potatoes struggle above 25°C. Risk of tuber deformation.',
      tooCold: '❄️ Frost risk! Protect potatoes from cold.',
      tooWet: '💧 High humidity! Late blight risk. Apply fungicide.',
      tooDry: '💨 Potatoes need consistent moisture.',
      optimal: '✅ Perfect potato weather!',
    }
  },
  'Cassava': {
    tempMin: 18, tempMax: 35,
    humidityMin: 40, humidityMax: 80,
    alerts: {
      tooHot: '🌡️ Cassava tolerates heat but monitor soil moisture.',
      tooCold: '❄️ Cassava growth stops in cold weather.',
      tooWet: '💧 High humidity! Risk of cassava mosaic virus.',
      tooDry: '💨 Cassava is drought tolerant, minimal irrigation needed.',
      optimal: '✅ Good conditions for cassava.',
    }
  },
  'Rice': {
    tempMin: 20, tempMax: 35,
    humidityMin: 70, humidityMax: 90,
    alerts: {
      tooHot: '🌡️ Rice pollen sterility risk above 35°C.',
      tooCold: '❄️ Rice growth stops below 20°C.',
      tooWet: '💧 Monitor for rice blast disease.',
      tooDry: '💨 Rice needs flooded conditions. Ensure water supply.',
      optimal: '✅ Ideal conditions for rice.',
    }
  }
};

export const getCropWeatherAlert = (cropName, weather) => {
  if (!weather || !cropName) return null;
  
  // Find matching crop requirements
  const cropKey = Object.keys(CROP_REQUIREMENTS).find(key => 
    cropName.toLowerCase().includes(key.toLowerCase())
  );
  
  const requirements = cropKey ? CROP_REQUIREMENTS[cropKey] : null;
  
  if (!requirements) return null;
  
  const { temp, humidity } = weather;
  let status = 'optimal';
  let message = requirements.alerts.optimal;
  let severity = 'good';
  
  // Check temperature
  if (temp > requirements.tempMax) {
    status = 'tooHot';
    message = requirements.alerts.tooHot;
    severity = 'danger';
  } else if (temp < requirements.tempMin) {
    status = 'tooCold';
    message = requirements.alerts.tooCold;
    severity = 'warning';
  } 
  // Check humidity (only if temp is optimal)
  else if (humidity > requirements.humidityMax) {
    status = 'tooWet';
    message = requirements.alerts.tooWet;
    severity = 'warning';
  } else if (humidity < requirements.humidityMin) {
    status = 'tooDry';
    message = requirements.alerts.tooDry;
    severity = 'info';
  }
  
  return {
    cropName: cropKey || cropName,
    status,
    message,
    severity,
    idealTemp: `${requirements.tempMin}°C – ${requirements.tempMax}°C`,
    idealHumidity: `${requirements.humidityMin}% – ${requirements.humidityMax}%`,
    currentTemp: temp,
    currentHumidity: humidity,
  };
};