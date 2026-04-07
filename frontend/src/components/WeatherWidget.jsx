import { useEffect } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useGPSLocation } from '../hooks/useGPSLocation';
import { CloudRain, Sun, Cloud, Wind, Droplets, Eye, RefreshCw, AlertTriangle, Navigation } from 'lucide-react';

const WeatherIcon = ({ condition, size = 24 }) => {
  const icons = {
    Clear: <Sun size={size} className="text-yellow-400" />,
    Clouds: <Cloud size={size} className="text-gray-400" />,
    Rain: <CloudRain size={size} className="text-blue-400" />,
    Drizzle: <CloudRain size={size} className="text-blue-300" />,
    Thunderstorm: <CloudRain size={size} className="text-purple-500" />,
    Snow: <Cloud size={size} className="text-blue-200" />,
    Mist: <Cloud size={size} className="text-gray-300" />,
  };
  return icons[condition] || <Sun size={size} className="text-yellow-400" />;
};

const WeatherWidget = ({ district, crops = [] }) => {
  const { coords, error: gpsError, loading: gpsLoading, status, requestGPS } = useGPSLocation();
  const { weather, forecast, loading, error, alerts, cropAlerts, refetch } = useWeather(district, coords, crops);

  // Request GPS on mount - only once
  useEffect(() => {
    if (status === 'idle') {
      requestGPS();
    }
  }, [status, requestGPS]);

  // Show loading state
  if (loading || gpsLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] p-6 text-white animate-pulse">
        <div className="h-6 bg-white/20 rounded-xl w-32 mb-4" />
        <div className="h-12 bg-white/20 rounded-xl w-24 mb-2" />
        <div className="h-4 bg-white/20 rounded-xl w-40" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-center">
        <p className="text-sm font-bold text-gray-400">{error}</p>
        <button onClick={refetch} className="mt-3 text-green-600 font-black text-xs hover:underline flex items-center gap-1 mx-auto">
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="space-y-4">
      {/* GPS Status Banner */}
      {status === 'denied' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <p className="text-xs text-amber-700">GPS denied. Using district weather.</p>
          </div>
          <button onClick={requestGPS} className="text-amber-600 text-xs font-bold hover:underline">
            Retry
          </button>
        </div>
      )}
      
      {status === 'granted' && coords && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <Navigation size={14} className="text-green-600" />
            <p className="text-xs text-green-700">✅ Using precise GPS weather</p>
          </div>
        </div>
      )}

      {/* Main weather card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-white/10 rounded-full" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-1">
                {weather.location || district}, Rwanda
              </p>
              <div className="flex items-end gap-3">
                <p className="text-6xl font-black">{weather.temp}°</p>
                <WeatherIcon condition={weather.condition} size={36} />
              </div>
              <p className="text-blue-100 font-bold mt-1 capitalize">{weather.description}</p>
            </div>

            <div className="space-y-2">
              <div className="bg-white/10 rounded-2xl px-3 py-2 text-right">
                <p className="text-xs text-blue-200 font-bold">Feels like</p>
                <p className="font-black text-sm">{weather.feelsLike}°C</p>
              </div>
              <button onClick={refetch} className="bg-white/10 hover:bg-white/20 rounded-xl p-2 transition-colors block ml-auto">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Current stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
              { icon: Wind, label: 'Wind', value: `${weather.windSpeed} m/s` },
              { icon: Eye, label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km` },
            ].map(item => (
              <div key={item.label} className="bg-white/10 rounded-2xl p-2.5 text-center">
                <item.icon size={14} className="mx-auto mb-1 text-blue-200" />
                <p className="text-xs text-blue-200 font-bold">{item.label}</p>
                <p className="font-black text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {/* 5 day forecast */}
          {forecast && forecast.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {forecast.map((day, i) => (
                <div key={i} className="flex-1 min-w-[60px] bg-white/10 rounded-2xl p-2 text-center">
                  <p className="text-xs font-black text-blue-200 mb-1">{day.date}</p>
                  <WeatherIcon condition={day.condition} size={16} />
                  <p className="font-black text-sm mt-1">{day.temp}°</p>
                  <p className="text-xs text-blue-200">{day.humidity}%</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Smart alerts */}
      {alerts && alerts.length > 0 && alerts.map((alert, i) => (
        <div key={i} className={`rounded-2xl p-4 border flex items-start gap-3 ${alert.color}`}>
          <span className="text-lg shrink-0">{alert.icon}</span>
          <div>
            <p className="font-black text-sm">{alert.title}</p>
            <p className="text-xs font-medium mt-0.5 opacity-80">{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherWidget;