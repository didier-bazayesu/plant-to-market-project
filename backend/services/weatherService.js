// backend/services/weatherService.js
// Handles all weather data fetching and caching.
// Two data sources: OpenWeatherMap (real-time) + NASA POWER (historical climatology).
// One WeatherCache row per location, keyed by coordinates rounded to 2 decimal places.

'use strict';

const axios = require('axios');
const { WeatherCache } = require('../models');

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const OWM_API_KEY = process.env.OWM_API_KEY;
const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const NASA_BASE_URL = 'https://power.larc.nasa.gov/api/temporal/climatology/point';

const OWM_TTL_MS   = 3  * 60 * 60 * 1000;  // 3 hours
const NASA_TTL_MS  = 30 * 24 * 60 * 60 * 1000;  // 30 days

// Rwanda district center coordinates — fallback when no GPS or map pin
const DISTRICT_COORDINATES = {
  kigali:         { lat: -1.9441, lon: 30.0619 },
  gasabo:         { lat: -1.8661, lon: 30.1069 },
  kicukiro:       { lat: -1.9897, lon: 30.0675 },
  nyarugenge:     { lat: -1.9467, lon: 30.0594 },
  bugesera:       { lat: -2.2128, lon: 30.1588 },
  gatsibo:        { lat: -1.5878, lon: 30.4677 },
  kayonza:        { lat: -1.8856, lon: 30.6468 },
  kirehe:         { lat: -2.3588, lon: 30.6671 },
  ngoma:          { lat: -2.1545, lon: 30.4975 },
  rwamagana:      { lat: -1.9485, lon: 30.4346 },
  burera:         { lat: -1.4733, lon: 29.8539 },
  gakenke:        { lat: -1.6921, lon: 29.7803 },
  gicumbi:        { lat: -1.5766, lon: 30.0825 },
  musanze:        { lat: -1.4990, lon: 29.6339 },
  rulindo:        { lat: -1.7246, lon: 30.1061 },
  gisagara:       { lat: -2.6148, lon: 29.8323 },
  huye:           { lat: -2.5967, lon: 29.7386 },
  kamonyi:        { lat: -2.0662, lon: 29.8762 },
  muhanga:        { lat: -2.0836, lon: 29.7561 },
  nyamagabe:      { lat: -2.4833, lon: 29.4833 },
  nyamasheke:     { lat: -2.3167, lon: 29.1333 },
  nyanza:         { lat: -2.3500, lon: 29.7500 },
  nyaruguru:      { lat: -2.7500, lon: 29.5333 },
  ruhango:        { lat: -2.2167, lon: 29.7833 },
  karongi:        { lat: -2.0000, lon: 29.3667 },
  ngororero:      { lat: -1.8833, lon: 29.5333 },
  nyabihu:        { lat: -1.6667, lon: 29.5000 },
  nyamasheke:     { lat: -2.3167, lon: 29.1333 },
  rubavu:         { lat: -1.6783, lon: 29.3464 },
  rusizi:         { lat: -2.4833, lon: 28.9000 },
  rutsiro:        { lat: -1.8833, lon: 29.4333 },
};

// ─── CACHE KEY ────────────────────────────────────────────────────────────────

function buildCacheKey(lat, lon) {
  const rLat = parseFloat(lat).toFixed(2);
  const rLon = parseFloat(lon).toFixed(2);
  return `lat_${rLat}_lon_${rLon}`;
}

function roundCoords(lat, lon) {
  return {
    lat: parseFloat(parseFloat(lat).toFixed(2)),
    lon: parseFloat(parseFloat(lon).toFixed(2)),
  };
}

// ─── COORDINATE RESOLUTION ───────────────────────────────────────────────────
// Priority: gps_at_farm → map_pin → district_fallback

function resolveCoordinates(farm) {
  const gps = farm.gpsLocation;

  if (
    farm.locationAccuracy === 'gps_at_farm' ||
    farm.locationAccuracy === 'map_pin'
  ) {
    if (gps?.latitude && gps?.longitude) {
      return {
        lat: parseFloat(gps.latitude),
        lon: parseFloat(gps.longitude),
        accuracy: farm.locationAccuracy,
      };
    }
  }

  // Fall back to district center
  const districtKey = farm.district?.toLowerCase().replace(/\s+/g, '_');
  const coords = DISTRICT_COORDINATES[districtKey];

  if (coords) {
    return { lat: coords.lat, lon: coords.lon, accuracy: 'district_fallback' };
  }

  // Last resort — Kigali center
  return { lat: -1.9441, lon: 30.0619, accuracy: 'district_fallback' };
}

// ─── OWM FETCH ────────────────────────────────────────────────────────────────

async function fetchOWMData(lat, lon) {
  if (!OWM_API_KEY) throw new Error('OWM_API_KEY not set in environment');

  const [currentRes, forecastRes] = await Promise.all([
    axios.get(`${OWM_BASE_URL}/weather`, {
      params: { lat, lon, appid: OWM_API_KEY, units: 'metric' }
    }),
    axios.get(`${OWM_BASE_URL}/forecast`, {
      params: { lat, lon, appid: OWM_API_KEY, units: 'metric' }
    }),
  ]);

  return {
    current: currentRes.data,
    forecast: forecastRes.data,
    fetchedAt: new Date().toISOString(),
  };
}

// ─── NASA POWER FETCH ─────────────────────────────────────────────────────────

async function fetchNASAData(lat, lon) {
  const res = await axios.get(NASA_BASE_URL, {
    params: {
      parameters: 'PRECTOTCORR,T2M,T2M_MAX,T2M_MIN,EVPTRNS',
      community: 'AG',
      longitude: lon,
      latitude: lat,
      format: 'JSON',
    }
  });

  return {
    climatology: res.data.properties?.parameter || {},
    fetchedAt: new Date().toISOString(),
  };
}

// ─── IS STALE ─────────────────────────────────────────────────────────────────

function isOWMStale(cache) {
  if (!cache?.owmFetchedAt) return true;
  return (Date.now() - new Date(cache.owmFetchedAt).getTime()) > OWM_TTL_MS;
}

function isNASAStale(cache) {
  if (!cache?.nasaFetchedAt) return true;
  return (Date.now() - new Date(cache.nasaFetchedAt).getTime()) > NASA_TTL_MS;
}

// ─── MAIN — GET WEATHER FOR FARM ─────────────────────────────────────────────

async function getWeatherForFarm(farm) {
  const { lat, lon, accuracy } = resolveCoordinates(farm);
  const cacheKey = buildCacheKey(lat, lon);
  const { lat: rLat, lon: rLon } = roundCoords(lat, lon);

  // Find or create cache row
  let cache = await WeatherCache.findOne({ where: { cacheKey } });
  if (!cache) {
    cache = await WeatherCache.create({ cacheKey, lat: rLat, lon: rLon });
  }

  const updates = {};

  // Refresh OWM if stale
  if (isOWMStale(cache)) {
    try {
      updates.owmData = await fetchOWMData(lat, lon);
      updates.owmFetchedAt = new Date();
    } catch (err) {
      console.error(`OWM fetch failed for ${cacheKey}:`, err.message);
    }
  }

  // Refresh NASA if stale
  if (isNASAStale(cache)) {
    try {
      updates.nasaData = await fetchNASAData(lat, lon);
      updates.nasaFetchedAt = new Date();
    } catch (err) {
      console.error(`NASA fetch failed for ${cacheKey}:`, err.message);
    }
  }

  // Save updates if any
  if (Object.keys(updates).length > 0) {
    await cache.update(updates);
    await cache.reload();
  }

  return {
    cacheKey,
    lat,
    lon,
    accuracy,
    owm: cache.owmData,
    nasa: cache.nasaData,
    owmFetchedAt: cache.owmFetchedAt,
    nasaFetchedAt: cache.nasaFetchedAt,
  };
}

// ─── GET WEATHER BY DISTRICT ──────────────────────────────────────────────────
// Used by /api/weather/:district endpoint

async function getWeatherForDistrict(district) {
  const key = district?.toLowerCase().replace(/\s+/g, '_');
  const coords = DISTRICT_COORDINATES[key];

  if (!coords) {
    throw new Error(`Unknown district: ${district}`);
  }

  // Build a minimal farm-like object to reuse getWeatherForFarm
  const fakeFarm = {
    locationAccuracy: 'district_fallback',
    district,
    gpsLocation: null,
  };

  return getWeatherForFarm(fakeFarm);
}

module.exports = {
  getWeatherForFarm,
  getWeatherForDistrict,
  resolveCoordinates,
  buildCacheKey,
  DISTRICT_COORDINATES,
};