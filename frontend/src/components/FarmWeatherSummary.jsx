import { useWeather } from '../hooks/useWeather';
import { getCropWeatherAlert } from '../data/cropRequirements';
import WeatherWidget from './WeatherWidget';
import CropWeatherAlert from './CropWeatherAlert';
import { Sprout, CloudRain } from 'lucide-react';

const FarmWeatherSummary = ({ district, crops = [] }) => {
  const { weather, forecast, loading, error, alerts, refetch } = useWeather(district);

  // Generate per-crop alerts from real weather
  const cropAlerts = crops
    .map(crop => getCropWeatherAlert(crop.cropType || crop.name, weather))
    .filter(Boolean);

  const dangerCount = cropAlerts.filter(a => a.severity === 'danger').length;
  const warningCount = cropAlerts.filter(a => a.severity === 'warning').length;

  return (
    <div className="space-y-6">

      {/* Overall weather */}
      <WeatherWidget district={district} />

      {/* Per crop recommendations */}
      {crops.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Sprout className="text-green-600" size={18} />
              Crop Weather Recommendations
            </h3>
            {(dangerCount > 0 || warningCount > 0) && (
              <div className="flex items-center gap-2">
                {dangerCount > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-1 rounded-full">
                    {dangerCount} at risk
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="bg-amber-100 text-amber-600 text-xs font-black px-2 py-1 rounded-full">
                    {warningCount} warning
                  </span>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {crops.slice(0, 3).map((_, i) => (
                <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {cropAlerts.map((alert, i) => (
                <CropWeatherAlert key={i} alert={alert} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmWeatherSummary;