import { useState, useEffect } from 'react';
import { getCropWeatherAlert } from '../data/cropRequirements';

// Rwanda district coordinates
const DISTRICT_COORDS = {
  // Kigali
  Gasabo:     { lat: -1.9441, lon: 30.0619 },
  Kicukiro:   { lat: -1.9706, lon: 30.1044 },
  Nyarugenge: { lat: -1.9503, lon: 30.0588 },
  // Northern
  Musanze:    { lat: -1.4994, lon: 29.6340 },
  Burera:     { lat: -1.3667, lon: 29.8500 },
  Gakenke:    { lat: -1.6893, lon: 29.7793 },
  Gicumbi:    { lat: -1.5761, lon: 30.0731 },
  Rulindo:    { lat: -1.7256, lon: 30.0653 },
  // Southern
  Huye:       { lat: -2.5963, lon: 29.7394 },
  Gisagara:   { lat: -2.6148, lon: 29.8289 },
  Kamonyi:    { lat: -2.0380, lon: 29.8766 },
  Muhanga:    { lat: -2.0833, lon: 29.7500 },
  Nyamagabe:  { lat: -2.4833, lon: 29.4833 },
  Nyanza:     { lat: -2.3500, lon: 29.7333 },
  Nyaruguru:  { lat: -2.7167, lon: 29.5500 },
  Ruhango:    { lat: -2.2167, lon: 29.7833 },
  // Eastern
  Bugesera:   { lat: -2.1667, lon: 30.1667 },
  Gatsibo:    { lat: -1.5833, lon: 30.4667 },
  Kayonza:    { lat: -1.8833, lon: 30.6500 },
  Kirehe:     { lat: -2.1500, lon: 30.6833 },
  Ngoma:      { lat: -2.1500, lon: 30.5000 },
  Nyagatare:  { lat: -1.2992, lon: 30.3281 },
  Rwamagana:  { lat: -1.9500, lon: 30.4333 },
  // Western
  Karongi:    { lat: -2.0667, lon: 29.3833 },
  Ngororero:  { lat: -1.8833, lon: 29.5333 },
  Nyabihu:    { lat: -1.6500, lon: 29.5000 },
  Nyamasheke: { lat: -2.3333, lon: 29.1667 },
  Rubavu:     { lat: -1.6781, lon: 29.3383 },
  Rusizi:     { lat: -2.4833, lon: 28.9000 },
  Rutsiro:    { lat: -1.9333, lon: 29.4000 },
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const useWeather = (district,crops=[]) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!district) return;
    fetchWeather();
  }, [district]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const coords = DISTRICT_COORDS[district] || DISTRICT_COORDS['Gasabo'];
      const { lat, lon } = coords;

      // Current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const currentData = await currentRes.json();

      // 5 day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      setWeather({
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        location: currentData.name,
        pressure: currentData.main.pressure,
        visibility: currentData.visibility,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
      });

      // Get one forecast per day (every 8th item = 24hrs)
      const dailyForecast = forecastData.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5)
        .map(item => ({
          date: new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          tempMin: Math.round(item.main.temp_min),
          tempMax: Math.round(item.main.temp_max),
          condition: item.weather[0].main,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
        }));

      setForecast(dailyForecast);

    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Generate smart alerts from weather data
  const alerts = weather ? generateAlerts(weather, forecast) : [];

  

  return { weather, forecast, loading, error, alerts, refetch: fetchWeather };
};

// Smart alerts logic
const generateAlerts = (weather, forecast) => {
  const alerts = [];

  // High humidity → disease risk
  if (weather.humidity > 80) {
    alerts.push({
      type: 'warning',
      title: 'High Disease Risk',
      message: `Humidity is ${weather.humidity}%. High risk of fungal diseases. Monitor your crops closely.`,
      color: 'bg-red-50 border-red-100 text-red-700',
      icon: '🦠'
    });
  }

  // Low humidity → irrigation needed
  if (weather.humidity < 40) {
    alerts.push({
      type: 'info',
      title: 'Irrigation Recommended',
      message: `Humidity is low at ${weather.humidity}%. Consider irrigating your crops today.`,
      color: 'bg-blue-50 border-blue-100 text-blue-700',
      icon: '💧'
    });
  }

  // Heavy rain in forecast
  const rainDays = forecast.filter(f =>
    f.condition === 'Rain' || f.condition === 'Thunderstorm'
  );
  if (rainDays.length > 0) {
    alerts.push({
      type: 'info',
      title: 'Rain Expected',
      message: `Rain expected on ${rainDays.map(d => d.date).join(', ')}. Good time to delay irrigation.`,
      color: 'bg-blue-50 border-blue-100 text-blue-700',
      icon: '🌧️'
    });
  }

  // High wind → spray warning
  if (weather.windSpeed > 10) {
    alerts.push({
      type: 'warning',
      title: 'High Wind Speed',
      message: `Wind speed is ${weather.windSpeed} m/s. Avoid spraying pesticides today.`,
      color: 'bg-amber-50 border-amber-100 text-amber-700',
      icon: '💨'
    });
  }

  // Very hot → heat stress
  if (weather.temp > 30) {
    alerts.push({
      type: 'warning',
      title: 'Heat Stress Risk',
      message: `Temperature is ${weather.temp}°C. Crops may experience heat stress. Consider extra irrigation.`,
      color: 'bg-orange-50 border-orange-100 text-orange-700',
      icon: '🌡️'
    });
  }

  // Good conditions
  if (alerts.length === 0) {
    alerts.push({
      type: 'success',
      title: 'Good Growing Conditions',
      message: 'Weather conditions are favorable for your crops today.',
      color: 'bg-green-50 border-green-100 text-green-700',
      icon: '✅'
    });
  }

  return alerts;
};