// backend/data/cropRequirements.js
// Central knowledge base for all supported Rwanda crops.
// cropAdvisor.js, plantingCalendar.js, and all weather endpoints read from here.
// Never hardcode crop data anywhere else.

'use strict';

const cropRequirements = {

  maize: {
    name: 'Maize',
    varieties: ['hybrid', 'local', 'orange_maize'],
    daysToHarvest: { min: 90, max: 120 },
    seasons: ['A', 'B'],          // Season A = Sep–Feb, Season B = Mar–Jun
    soilTypes: ['loam', 'clay_loam', 'sandy_loam'],
    water: {
      minRainfallMm: 500,         // per season
      maxRainfallMm: 1200,
      droughtTolerant: false,
      irrigationBenefit: 'high',
    },
    temperature: {
      minC: 16,
      maxC: 35,
      optimalMinC: 20,
      optimalMaxC: 30,
    },
    alerts: {
      excessRain: 'Risk of fungal disease — consider fungicide application',
      drought: 'Water stress likely — irrigate if possible or apply mulch',
      coldStress: 'Low temperatures may slow germination and early growth',
      heatStress: 'High temperatures during tasseling can reduce yield',
    }
  },

  beans: {
    name: 'Beans',
    varieties: ['climbing', 'bush', 'mixed'],
    daysToHarvest: { min: 60, max: 90 },
    seasons: ['A', 'B', 'C'],    // Season C = Jul–Aug (short season)
    soilTypes: ['loam', 'sandy_loam', 'clay_loam'],
    water: {
      minRainfallMm: 300,
      maxRainfallMm: 800,
      droughtTolerant: false,
      irrigationBenefit: 'medium',
    },
    temperature: {
      minC: 14,
      maxC: 30,
      optimalMinC: 18,
      optimalMaxC: 26,
    },
    alerts: {
      excessRain: 'Waterlogging risk — ensure drainage, watch for root rot',
      drought: 'Beans are sensitive to drought — irrigate at flowering stage',
      coldStress: 'Cold nights may cause flower drop',
      heatStress: 'Heat above 30°C during flowering reduces pod set',
    }
  },

  irish_potato: {
    name: 'Irish Potato',
    varieties: ['kinigi', 'kirundo', 'victoria', 'markies'],
    daysToHarvest: { min: 75, max: 120 },
    seasons: ['A', 'B'],
    soilTypes: ['loam', 'sandy_loam', 'volcanic'],
    water: {
      minRainfallMm: 500,
      maxRainfallMm: 1000,
      droughtTolerant: false,
      irrigationBenefit: 'high',
    },
    temperature: {
      minC: 10,
      maxC: 25,
      optimalMinC: 15,
      optimalMaxC: 20,
    },
    alerts: {
      excessRain: 'High late blight risk — apply fungicide, improve drainage',
      drought: 'Tuber development affected — irrigate consistently',
      coldStress: 'Frost risk at high altitude — monitor overnight temperatures',
      heatStress: 'Temperatures above 25°C reduce tuber formation',
    }
  },

  sweet_potato: {
    name: 'Sweet Potato',
    varieties: ['orange_fleshed', 'white_fleshed', 'naspot'],
    daysToHarvest: { min: 90, max: 150 },
    seasons: ['A', 'B', 'C'],
    soilTypes: ['sandy_loam', 'loam', 'volcanic'],
    water: {
      minRainfallMm: 400,
      maxRainfallMm: 1000,
      droughtTolerant: true,
      irrigationBenefit: 'low',
    },
    temperature: {
      minC: 16,
      maxC: 35,
      optimalMinC: 20,
      optimalMaxC: 30,
    },
    alerts: {
      excessRain: 'Root rot risk in waterlogged soils — use raised beds',
      drought: 'Moderate drought tolerance — monitor during vine establishment',
      coldStress: 'Growth slows significantly below 16°C',
      heatStress: 'Generally tolerant — monitor soil moisture',
    }
  },

  sorghum: {
    name: 'Sorghum',
    varieties: ['local', 'improved', 'sorgho_rouge'],
    daysToHarvest: { min: 100, max: 140 },
    seasons: ['A', 'B'],
    soilTypes: ['clay', 'clay_loam', 'loam', 'sandy_loam'],
    water: {
      minRainfallMm: 300,
      maxRainfallMm: 900,
      droughtTolerant: true,
      irrigationBenefit: 'low',
    },
    temperature: {
      minC: 15,
      maxC: 40,
      optimalMinC: 20,
      optimalMaxC: 35,
    },
    alerts: {
      excessRain: 'Fungal disease risk — ensure good air circulation',
      drought: 'High drought tolerance — can recover from short dry spells',
      coldStress: 'Germination poor below 15°C',
      heatStress: 'Well adapted to heat — monitor for grain mold in humid heat',
    }
  },

  cassava: {
    name: 'Cassava',
    varieties: ['improved', 'local', 'mkumba'],
    daysToHarvest: { min: 270, max: 360 },  // 9–12 months
    seasons: ['A', 'B'],                      // planted at start of rains
    soilTypes: ['sandy_loam', 'loam', 'clay_loam'],
    water: {
      minRainfallMm: 500,
      maxRainfallMm: 1500,
      droughtTolerant: true,
      irrigationBenefit: 'low',
    },
    temperature: {
      minC: 16,
      maxC: 38,
      optimalMinC: 22,
      optimalMaxC: 32,
    },
    alerts: {
      excessRain: 'Root rot risk — avoid poorly drained soils',
      drought: 'Highly drought tolerant — sheds leaves to conserve water',
      coldStress: 'Growth significantly slowed below 16°C',
      heatStress: 'Tolerates heat well with adequate moisture',
    }
  },

  wheat: {
    name: 'Wheat',
    varieties: ['danda\'a', 'kakuru', 'selam'],
    daysToHarvest: { min: 100, max: 130 },
    seasons: ['A', 'B'],
    soilTypes: ['loam', 'clay_loam', 'volcanic'],
    water: {
      minRainfallMm: 400,
      maxRainfallMm: 900,
      droughtTolerant: false,
      irrigationBenefit: 'medium',
    },
    temperature: {
      minC: 10,
      maxC: 28,
      optimalMinC: 15,
      optimalMaxC: 22,
    },
    alerts: {
      excessRain: 'Rust and septoria risk — apply fungicide at flag leaf stage',
      drought: 'Drought at grain fill stage causes yield loss — irrigate',
      coldStress: 'Frost at flowering causes sterility',
      heatStress: 'Heat above 28°C at grain fill reduces grain weight',
    }
  },

  tomato: {
    name: 'Tomato',
    varieties: ['hybrid', 'roma', 'moneymaker'],
    daysToHarvest: { min: 60, max: 90 },
    seasons: ['A', 'B', 'C'],
    soilTypes: ['loam', 'sandy_loam', 'clay_loam'],
    water: {
      minRainfallMm: 400,
      maxRainfallMm: 800,
      droughtTolerant: false,
      irrigationBenefit: 'high',
    },
    temperature: {
      minC: 15,
      maxC: 32,
      optimalMinC: 20,
      optimalMaxC: 27,
    },
    alerts: {
      excessRain: 'Blight and blossom end rot risk — stake plants, improve drainage',
      drought: 'Blossom drop and cracking — maintain consistent irrigation',
      coldStress: 'Fruit set poor below 15°C at night',
      heatStress: 'Pollen sterility above 32°C — shade netting recommended',
    }
  },

  banana: {
    name: 'Banana',
    varieties: ['intuntu', 'intokatoke', 'cavendish', 'cooking'],
    daysToHarvest: { min: 270, max: 365 },
    seasons: ['A', 'B'],          // perennial but planted at season start
    soilTypes: ['loam', 'clay_loam', 'volcanic'],
    water: {
      minRainfallMm: 1000,
      maxRainfallMm: 2000,
      droughtTolerant: false,
      irrigationBenefit: 'high',
    },
    temperature: {
      minC: 15,
      maxC: 35,
      optimalMinC: 20,
      optimalMaxC: 30,
    },
    alerts: {
      excessRain: 'Panama disease and sigatoka risk — improve drainage, rotate',
      drought: 'High water demand — irrigate regularly, apply mulch',
      coldStress: 'Growth halts below 15°C — avoid high altitude planting',
      heatStress: 'Leaf scorch possible — maintain soil moisture',
    }
  },

  coffee: {
    name: 'Coffee (Arabica)',
    varieties: ['bourbon', 'jackson', 'mibirizi'],
    daysToHarvest: { min: 270, max: 300 }, // from flowering to harvest
    seasons: ['A'],                          // flowering in Season A rains
    soilTypes: ['volcanic', 'loam', 'clay_loam'],
    water: {
      minRainfallMm: 1200,
      maxRainfallMm: 2000,
      droughtTolerant: false,
      irrigationBenefit: 'medium',
    },
    temperature: {
      minC: 15,
      maxC: 28,
      optimalMinC: 18,
      optimalMaxC: 24,
    },
    alerts: {
      excessRain: 'Coffee berry disease risk — prune for air circulation',
      drought: 'Stress during berry development reduces cup quality',
      coldStress: 'Frost causes severe damage — plant in frost-free zones',
      heatStress: 'Above 28°C affects bean quality — shade trees recommended',
    }
  },

};

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

/**
 * Get requirements for a specific crop type.
 * Returns null if crop not found — caller must handle this.
 */
function getCropRequirements(cropType) {
  const key = cropType?.toLowerCase().replace(/\s+/g, '_');
  return cropRequirements[key] || null;
}

/**
 * Get all supported crop type keys.
 */
function getSupportedCrops() {
  return Object.keys(cropRequirements);
}

/**
 * Check if a soil type is compatible with a crop.
 */
function isSoilCompatible(cropType, soilType) {
  const crop = getCropRequirements(cropType);
  if (!crop) return null;
  return crop.soilTypes.includes(soilType?.toLowerCase());
}

/**
 * Check if a season is valid for a crop.
 */
function isSeasonValid(cropType, season) {
  const crop = getCropRequirements(cropType);
  if (!crop) return null;
  return crop.seasons.includes(season?.toUpperCase());
}

module.exports = {
  cropRequirements,
  getCropRequirements,
  getSupportedCrops,
  isSoilCompatible,
  isSeasonValid,
};