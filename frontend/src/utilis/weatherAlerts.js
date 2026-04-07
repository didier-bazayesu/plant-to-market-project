// src/utils/weatherAlerts.js
export const generateAlerts = (weather) => {
  if (!weather) return [];
  
  const alerts = [];
  
  // High temperature alert
  if (weather.temp > 30) {
    alerts.push({
      icon: '🌡️',
      title: 'High Temperature Alert',
      message: `Temperature reaching ${weather.temp}°C. Ensure adequate irrigation for your crops.`,
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      severity: 'warning'
    });
  }
  
  // Low temperature alert
  if (weather.temp < 12) {
    alerts.push({
      icon: '❄️',
      title: 'Low Temperature Alert',
      message: `Temperature dropping to ${weather.temp}°C. Protect sensitive crops from frost.`,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      severity: 'warning'
    });
  }
  
  // Rain alert
  if (weather.condition === 'Rain' || weather.condition === 'Drizzle') {
    alerts.push({
      icon: '☔',
      title: 'Rainy Conditions',
      message: 'Rain expected. Reduce irrigation and monitor for waterlogging.',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      severity: 'info'
    });
  }
  
  // High wind alert
  if (weather.windSpeed > 8) {
    alerts.push({
      icon: '💨',
      title: 'Strong Winds',
      message: `Winds at ${weather.windSpeed} m/s. Provide wind protection for young crops.`,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      severity: 'warning'
    });
  }
  
  // High humidity alert
  if (weather.humidity > 85) {
    alerts.push({
      icon: '💧',
      title: 'High Humidity',
      message: `Humidity at ${weather.humidity}%. Risk of fungal diseases. Improve air circulation.`,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      severity: 'warning'
    });
  }
  
  // Low humidity alert
  if (weather.humidity < 40) {
    alerts.push({
      icon: '🏜️',
      title: 'Low Humidity',
      message: `Humidity at ${weather.humidity}%. Increase irrigation frequency.`,
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      severity: 'info'
    });
  }
  
  return alerts;
};