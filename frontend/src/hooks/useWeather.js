import { useState, useEffect, useCallback } from 'react';
import { getCropWeatherAlert } from '../data/cropRequirements';
import { generateAlerts } from '../utilis/weatherAlerts';

// Rwanda district coordinates
const DISTRICT_COORDS = {
  Gasabo:     { lat: -1.9441, lon: 30.0619 },
  Kicukiro:   { lat: -1.9706, lon: 30.1044 },
  Nyarugenge: { lat: -1.9503, lon: 30.0588 },
  Musanze:    { lat: -1.4994, lon: 29.6340 },
  Burera:     { lat: -1.3667, lon: 29.8500 },
  Gakenke:    { lat: -1.6893, lon: 29.7793 },
  Gicumbi:    { lat: -1.5761, lon: 30.0731 },
  Rulindo:    { lat: -1.7256, lon: 30.0653 },
  Huye:       { lat: -2.5963, lon: 29.7394 },
  Gisagara:   { lat: -2.6148, lon: 29.8289 },
  Kamonyi:    { lat: -2.0380, lon: 29.8766 },
  Muhanga:    { lat: -2.0833, lon: 29.7500 },
  Nyamagabe:  { lat: -2.4833, lon: 29.4833 },
  Nyanza:     { lat: -2.3500, lon: 29.7333 },
  Nyaruguru:  { lat: -2.7167, lon: 29.5500 },
  Ruhango:    { lat: -2.2167, lon: 29.7833 },
  Bugesera:   { lat: -2.1667, lon: 30.1667 },
  Gatsibo:    { lat: -1.5833, lon: 30.4667 },
  Kayonza:    { lat: -1.8833, lon: 30.6500 },
  Kirehe:     { lat: -2.1500, lon: 30.6833 },
  Ngoma:      { lat: -2.1500, lon: 30.5000 },
  Nyagatare:  { lat: -1.2992, lon: 30.3281 },
  Rwamagana:  { lat: -1.9500, lon: 30.4333 },
  Karongi:    { lat: -2.0667, lon: 29.3833 },
  Ngororero:  { lat: -1.8833, lon: 29.5333 },
  Nyabihu:    { lat: -1.6500, lon: 29.5000 },
  Nyamasheke: { lat: -2.3333, lon: 29.1667 },
  Rubavu:     { lat: -1.6781, lon: 29.3383 },
  Rusizi:     { lat: -2.4833, lon: 28.9000 },
  Rutsiro:    { lat: -1.9333, lon: 29.4000 },
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const useWeather = (district, coords = null, crops = []) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processWeatherData = (currentData, forecastData) => {
    if (!currentData?.main || !forecastData?.list) {
      throw new Error('Invalid weather data');
    }

    setWeather({
      temp: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      condition: currentData.weather?.[0]?.main,
      description: currentData.weather?.[0]?.description,
      icon: currentData.weather?.[0]?.icon,
      location: currentData.name,
      pressure: currentData.main.pressure,
      visibility: currentData.visibility,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
    });

    const dailyForecast = forecastData.list
      .filter((_, i) => i % 8 === 0)
      .slice(0, 5)
      .map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
        temp: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        condition: item.weather?.[0]?.main,
        icon: item.weather?.[0]?.icon,
        humidity: item.main.humidity,
      }));

    setForecast(dailyForecast);
  };

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    if (!API_KEY) {
      setError('Missing weather API key');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
      ]);

      if (!currentRes.ok || !forecastRes.ok) {
        throw new Error('Weather API error');
      }

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();
      processWeatherData(currentData, forecastData);

    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByDistrict = useCallback(async (district) => {
    const fallback = DISTRICT_COORDS[district] || DISTRICT_COORDS['Gasabo'];
    await fetchWeatherByCoords(fallback.lat, fallback.lon);
  }, [fetchWeatherByCoords]);

  useEffect(() => {
    if (coords?.latitude && coords?.longitude) {
      fetchWeatherByCoords(coords.latitude, coords.longitude);
    } else if (district) {
      fetchWeatherByDistrict(district);
    }
  }, [district, coords?.latitude, coords?.longitude, fetchWeatherByCoords, fetchWeatherByDistrict]);

  const alerts = weather ? generateAlerts(weather, forecast) : [];

  const cropAlerts = crops
    .map(crop => getCropWeatherAlert(crop?.name || crop?.cropType, weather))
    .filter(Boolean);

  const refetch = () => {
    if (coords?.latitude && coords?.longitude) {
      fetchWeatherByCoords(coords.latitude, coords.longitude);
    } else if (district) {
      fetchWeatherByDistrict(district);
    }
  };

  return {
    weather,
    forecast,
    loading,
    error,
    alerts,
    cropAlerts,
    refetch
  };
};