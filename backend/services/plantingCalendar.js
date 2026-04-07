// backend/services/plantingCalendar.js
// Calculates planting windows, harvest ETA, and season compatibility
// for Rwanda's three agricultural seasons.
// Reads from cropRequirements.js. No weather dependency — pure calendar logic.

'use strict';

const { getCropRequirements, isSeasonValid } = require('../data/cropRequirements');

// ─── RWANDA SEASONS ───────────────────────────────────────────────────────────
// Season A: September – February (long rains)
// Season B: March – June (short rains)
// Season C: July – August (limited, high altitude or irrigated only)

const SEASONS = {
  A: {
    name: 'Season A',
    description: 'Long rains — September to February',
    startMonth: 9,   // September
    endMonth: 2,     // February (crosses year boundary)
    plantingWindowStart: { month: 9, day: 1  },
    plantingWindowEnd:   { month: 10, day: 31 },
    peakPlantingMonth: 9,
  },
  B: {
    name: 'Season B',
    description: 'Short rains — March to June',
    startMonth: 3,
    endMonth: 6,
    plantingWindowStart: { month: 3, day: 1  },
    plantingWindowEnd:   { month: 4, day: 15 },
    peakPlantingMonth: 3,
  },
  C: {
    name: 'Season C',
    description: 'Dry season — July to August (irrigated or high altitude only)',
    startMonth: 7,
    endMonth: 8,
    plantingWindowStart: { month: 7, day: 1  },
    plantingWindowEnd:   { month: 7, day: 31 },
    peakPlantingMonth: 7,
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Get current season based on today's month
function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1–12

  if (month >= 9 || month <= 2) return 'A';
  if (month >= 3 && month <= 6) return 'B';
  return 'C';
}

// Get the next occurrence of a specific month/day from a reference date
function getNextDate(month, day, fromDate = new Date()) {
  const year = fromDate.getFullYear();
  let target = new Date(year, month - 1, day);
  if (target <= fromDate) {
    target = new Date(year + 1, month - 1, day);
  }
  return target;
}

// Add days to a date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Days between two dates
function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

// ─── PLANTING WINDOWS ─────────────────────────────────────────────────────────

function getPlantingWindows(cropType) {
  const requirements = getCropRequirements(cropType);
  if (!requirements) return null;

  const today = new Date();
  const windows = [];

  for (const seasonKey of requirements.seasons) {
    const season = SEASONS[seasonKey];
    if (!season) continue;

    // Build next planting window start date
    const windowStart = getNextDate(
      season.plantingWindowStart.month,
      season.plantingWindowStart.day,
      today
    );
    const windowEnd = new Date(
      windowStart.getFullYear(),
      season.plantingWindowEnd.month - 1,
      season.plantingWindowEnd.day
    );

    // If window end is before start (season A crosses year), push end to next year
    if (windowEnd < windowStart) {
      windowEnd.setFullYear(windowEnd.getFullYear() + 1);
    }

    const daysUntilWindow = daysBetween(today, windowStart);
    const isWindowOpen = today >= windowStart && today <= windowEnd;

    // Harvest ETA from peak planting date
    const peakPlantingDate = getNextDate(season.peakPlantingMonth, 1, today);
    const earliestHarvest = addDays(peakPlantingDate, requirements.daysToHarvest.min);
    const latestHarvest   = addDays(peakPlantingDate, requirements.daysToHarvest.max);

    windows.push({
      season: seasonKey,
      seasonName: season.name,
      description: season.description,
      plantingWindowStart: formatDate(windowStart),
      plantingWindowEnd:   formatDate(windowEnd),
      peakPlantingDate:    formatDate(peakPlantingDate),
      isWindowOpen,
      daysUntilWindow: isWindowOpen ? 0 : daysUntilWindow,
      estimatedHarvest: {
        earliest: formatDate(earliestHarvest),
        latest:   formatDate(latestHarvest),
        daysToHarvestMin: requirements.daysToHarvest.min,
        daysToHarvestMax: requirements.daysToHarvest.max,
      },
    });
  }

  // Sort — open windows first, then by days until window
  windows.sort((a, b) => {
    if (a.isWindowOpen && !b.isWindowOpen) return -1;
    if (!a.isWindowOpen && b.isWindowOpen) return 1;
    return a.daysUntilWindow - b.daysUntilWindow;
  });

  return windows;
}

// ─── HARVEST ETA FOR PLANTED CROP ────────────────────────────────────────────
// For a crop already in the ground — calculates ETA from actual planting date

function getHarvestETA(crop) {
  const requirements = getCropRequirements(crop.cropType);
  if (!requirements) return null;

  if (!crop.plantingDate) {
    return {
      available: false,
      message: 'No planting date recorded for this crop',
    };
  }

  const plantingDate   = new Date(crop.plantingDate);
  const today          = new Date();
  const earliestHarvest = addDays(plantingDate, requirements.daysToHarvest.min);
  const latestHarvest   = addDays(plantingDate, requirements.daysToHarvest.max);
  const daysPlanted    = daysBetween(plantingDate, today);
  const daysToEarliest = daysBetween(today, earliestHarvest);
  const daysToLatest   = daysBetween(today, latestHarvest);

  // Progress as percentage through growing period
  const totalDays = requirements.daysToHarvest.max;
  const progressPct = Math.min(100, Math.round((daysPlanted / totalDays) * 100));

  let stage;
  const pct = progressPct;
  if (pct < 15)       stage = 'germination';
  else if (pct < 35)  stage = 'vegetative';
  else if (pct < 60)  stage = 'flowering';
  else if (pct < 80)  stage = 'grain_fill';
  else if (pct < 100) stage = 'maturation';
  else                stage = 'ready_to_harvest';

  const isReadyToHarvest = today >= earliestHarvest;
  const isOverdue        = today > latestHarvest;

  return {
    available: true,
    plantingDate:     formatDate(plantingDate),
    daysPlanted,
    progressPct,
    stage,
    earliestHarvest:  formatDate(earliestHarvest),
    latestHarvest:    formatDate(latestHarvest),
    daysToEarliestHarvest: Math.max(0, daysToEarliest),
    daysToLatestHarvest:   Math.max(0, daysToLatest),
    isReadyToHarvest,
    isOverdue,
    message: isOverdue
      ? 'Crop may be overdue for harvest — check field conditions'
      : isReadyToHarvest
        ? 'Crop is ready for harvest'
        : `${daysToEarliest} – ${daysToLatest} days until harvest window`,
  };
}

// ─── SEASON SUMMARY ───────────────────────────────────────────────────────────

function getSeasonSummary() {
  const currentSeason = getCurrentSeason();
  const today = new Date();

  return {
    currentSeason,
    currentSeasonName: SEASONS[currentSeason].name,
    currentSeasonDescription: SEASONS[currentSeason].description,
    today: formatDate(today),
    seasons: Object.entries(SEASONS).map(([key, s]) => ({
      key,
      name: s.name,
      description: s.description,
      isCurrent: key === currentSeason,
    })),
  };
}

module.exports = {
  getPlantingWindows,
  getHarvestETA,
  getSeasonSummary,
  getCurrentSeason,
  SEASONS,
};