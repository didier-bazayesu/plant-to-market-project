// backend/services/plantingCalendar.js
'use strict';

const { getCropRequirements } = require('../data/cropRequirements');

// ─── RWANDA SEASONS ───────────────────────────────────────────
const SEASONS = {
  A: {
    name: 'Season A',
    description: 'Long rains — September to February',
    startMonth: 9,
    endMonth: 2,
    plantingWindowStart: { month: 9,  day: 1  },
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

// ─── HELPERS ──────────────────────────────────────────────────

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 9 || month <= 2) return 'A';
  if (month >= 3 && month <= 6) return 'B';
  return 'C';
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

// ─── RESOLVE WINDOW DATES FOR A SEASON ────────────────────────
// Returns { windowStart, windowEnd } correctly accounting for
// Season A crossing the year boundary and whether we are
// currently inside the window or looking at a future one.

function resolveWindowDates(seasonKey, season, today) {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  let windowStart, windowEnd;

  if (seasonKey === 'A') {
    // Season A: Sep 1 – Oct 31 planting window, season runs Sep–Feb
    if (currentMonth >= 9) {
      // Sep–Dec: window started this year, ends this year
      windowStart = new Date(currentYear, 8, 1);   // Sep 1
      windowEnd   = new Date(currentYear, 9, 31);  // Oct 31
    } else if (currentMonth <= 2) {
      // Jan–Feb: we are inside Season A, window started last year
      windowStart = new Date(currentYear - 1, 8, 1);  // Sep 1 last year
      windowEnd   = new Date(currentYear - 1, 9, 31); // Oct 31 last year
    } else {
      // Mar–Aug: Season A hasn't started yet this year
      windowStart = new Date(currentYear, 8, 1);   // Sep 1 this year
      windowEnd   = new Date(currentYear, 9, 31);  // Oct 31 this year
    }
  } else {
    // Season B and C: simple same-year windows
    windowStart = new Date(
      currentYear,
      season.plantingWindowStart.month - 1,
      season.plantingWindowStart.day
    );
    windowEnd = new Date(
      currentYear,
      season.plantingWindowEnd.month - 1,
      season.plantingWindowEnd.day
    );

    // ✅ If window has completely passed this year, move to next year
    if (windowEnd < today) {
      windowStart = new Date(
        currentYear + 1,
        season.plantingWindowStart.month - 1,
        season.plantingWindowStart.day
      );
      windowEnd = new Date(
        currentYear + 1,
        season.plantingWindowEnd.month - 1,
        season.plantingWindowEnd.day
      );
    }
  }

  return { windowStart, windowEnd };
}

// ─── PLANTING WINDOWS ─────────────────────────────────────────

function getPlantingWindows(cropType) {
  const requirements = getCropRequirements(cropType);
  if (!requirements) return null;

  const today = new Date();
  const windows = [];

  for (const seasonKey of requirements.seasons) {
    const season = SEASONS[seasonKey];
    if (!season) continue;

    const { windowStart, windowEnd } = resolveWindowDates(seasonKey, season, today);

    // ✅ Is today inside this planting window?
    const isWindowOpen = today >= windowStart && today <= windowEnd;

    // ✅ Days until window opens (0 if already open)
    const daysUntilWindow = isWindowOpen ? 0 : daysBetween(today, windowStart);

    // ✅ Peak planting date is always in the same year as windowStart
    const peakPlantingDate = new Date(
      windowStart.getFullYear(),
      season.peakPlantingMonth - 1,
      1
    );

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
      daysUntilWindow,
      estimatedHarvest: {
        earliest: formatDate(earliestHarvest),
        latest:   formatDate(latestHarvest),
        daysToHarvestMin: requirements.daysToHarvest.min,
        daysToHarvestMax: requirements.daysToHarvest.max,
      },
    });
  }

  // Open windows first, then soonest upcoming
  windows.sort((a, b) => {
    if (a.isWindowOpen && !b.isWindowOpen) return -1;
    if (!a.isWindowOpen && b.isWindowOpen) return 1;
    return a.daysUntilWindow - b.daysUntilWindow;
  });

  return windows;
}

// ─── HARVEST ETA FOR PLANTED CROP ────────────────────────────

function getHarvestETA(crop) {
  const requirements = getCropRequirements(crop.cropType);
  if (!requirements) return null;

  if (!crop.plantingDate) {
    return {
      available: false,
      message: 'No planting date recorded for this crop',
    };
  }

  const plantingDate    = new Date(crop.plantingDate);
  const today           = new Date();
  const earliestHarvest = addDays(plantingDate, requirements.daysToHarvest.min);
  const latestHarvest   = addDays(plantingDate, requirements.daysToHarvest.max);
  const daysPlanted     = daysBetween(plantingDate, today);
  const daysToEarliest  = daysBetween(today, earliestHarvest);
  const daysToLatest    = daysBetween(today, latestHarvest);

  const totalDays   = requirements.daysToHarvest.max;
  const progressPct = Math.min(100, Math.round((daysPlanted / totalDays) * 100));

  // ✅ Stage thresholds
  let stage;
  if (progressPct < 15)      stage = 'germination';
  else if (progressPct < 35) stage = 'vegetative';
  else if (progressPct < 60) stage = 'flowering';
  else if (progressPct < 80) stage = 'grain_fill';
  else if (progressPct < 100) stage = 'maturation';
  else                        stage = 'ready_to_harvest';

  const isReadyToHarvest = today >= earliestHarvest;
  const isOverdue        = today > latestHarvest;

  // ✅ Override stage if actually ready or overdue
  if (isOverdue)        stage = 'ready_to_harvest';
  if (isReadyToHarvest && !isOverdue) stage = 'ready_to_harvest';

  return {
    available: true,
    plantingDate:          formatDate(plantingDate),
    daysPlanted,
    progressPct,
    stage,
    earliestHarvest:       formatDate(earliestHarvest),
    latestHarvest:         formatDate(latestHarvest),
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

// ─── SEASON SUMMARY ───────────────────────────────────────────

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