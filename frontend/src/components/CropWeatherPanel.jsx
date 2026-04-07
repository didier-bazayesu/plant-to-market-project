import { useEffect, useState } from 'react';
import { AlertTriangle, Info, CheckCircle, CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LEVEL_STYLES = {
  critical: { container: 'bg-red-50 border-red-200', icon: 'text-red-500', badge: 'bg-red-100 text-red-700', label: 'CRITICAL' },
  warning:  { container: 'bg-amber-50 border-amber-200', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-700', label: 'WARNING' },
  info:     { container: 'bg-blue-50 border-blue-200', icon: 'text-blue-500', badge: 'bg-blue-100 text-blue-700', label: 'INFO' },
};

function AlertIcon({ level }) {
  if (level === 'info') return <Info size={16} />;
  return <AlertTriangle size={16} />;
}

function AlertCard({ alert }) {
  const style = LEVEL_STYLES[alert.level] || LEVEL_STYLES.info;
  return (
    <div className={`border rounded-xl p-4 ${style.container}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 ${style.icon}`}><AlertIcon level={alert.level} /></span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
          </div>
          <p className="text-sm font-semibold text-gray-800">{alert.message}</p>
          {alert.value && <p className="text-xs text-gray-500 mt-1">{alert.value}</p>}
        </div>
      </div>
    </div>
  );
}

function CurrentConditions({ current, locationAccuracy }) {
  if (!current) return null;
  const accuracyLabel = {
    gps_at_farm:       { text: 'GPS accuracy', color: 'text-green-600' },
    map_pin:           { text: 'Map pin accuracy', color: 'text-blue-600' },
    district_fallback: { text: 'District estimate', color: 'text-amber-600' },
  }[locationAccuracy] || { text: 'District estimate', color: 'text-amber-600' };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Current Conditions</h4>
        <span className={`text-xs font-semibold ${accuracyLabel.color}`}>📍 {accuracyLabel.text}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {current.tempC != null && (
          <div className="flex items-center gap-2">
            <Thermometer size={16} className="text-orange-400" />
            <div><p className="text-xs text-gray-400">Temperature</p><p className="text-sm font-bold text-gray-800">{current.tempC.toFixed(1)}°C</p></div>
          </div>
        )}
        {current.humidity != null && (
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-blue-400" />
            <div><p className="text-xs text-gray-400">Humidity</p><p className="text-sm font-bold text-gray-800">{current.humidity}%</p></div>
          </div>
        )}
        {current.rain1h != null && (
          <div className="flex items-center gap-2">
            <CloudRain size={16} className="text-blue-500" />
            <div><p className="text-xs text-gray-400">Rain (1hr)</p><p className="text-sm font-bold text-gray-800">{current.rain1h}mm</p></div>
          </div>
        )}
        {current.weatherDesc && (
          <div className="flex items-center gap-2">
            <Wind size={16} className="text-gray-400" />
            <div><p className="text-xs text-gray-400">Conditions</p><p className="text-sm font-bold text-gray-800 capitalize">{current.weatherDesc}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CropWeatherPanel({ cropId }) {
  const { token } = useAuth();
  const [advice, setAdvice]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!cropId || !token) return;
    setLoading(true);
    fetch(`/api/crops/${cropId}/advice`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message);
        setAdvice(data.advice);
      })
      .catch(err => setError(err.message || 'Failed to load weather advice'))
      .finally(() => setLoading(false));
  }, [cropId, token]);

  if (loading) return (
    <div className="space-y-3 animate-pulse">
      <div className="h-20 bg-gray-100 rounded-xl" />
      <div className="h-16 bg-gray-100 rounded-xl" />
      <div className="h-16 bg-gray-100 rounded-xl" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-sm text-red-600 font-semibold">⚠ {error}</p>
    </div>
  );

  if (!advice) return null;

  if (!advice.supported) return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <p className="text-sm text-amber-700 font-semibold">No weather intelligence available for: {advice.cropType}</p>
    </div>
  );

  if (!advice.weatherAvailable) return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <p className="text-sm text-gray-500">{advice.message}</p>
    </div>
  );

  const hasAlerts = advice.alerts?.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {advice.alertCount.critical > 0 && <span className="bg-red-100 text-red-700 text-xs font-black px-3 py-1 rounded-full">🔴 {advice.alertCount.critical} Critical</span>}
        {advice.alertCount.warning > 0  && <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-full">🟡 {advice.alertCount.warning} Warning</span>}
        {advice.alertCount.info > 0     && <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full">🔵 {advice.alertCount.info} Info</span>}
        {!hasAlerts && <span className="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12} /> All conditions good</span>}
      </div>

      <CurrentConditions current={advice.current} locationAccuracy={advice.locationAccuracy} />

      {advice.forecast && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center"><p className="text-xs text-gray-400">Total Rain</p><p className="text-sm font-bold text-blue-700">{advice.forecast.totalRainMm5day?.toFixed(0)}mm</p></div>
            <div className="text-center"><p className="text-xs text-gray-400">Max Temp</p><p className="text-sm font-bold text-orange-600">{advice.forecast.maxTempC?.toFixed(1)}°C</p></div>
            <div className="text-center"><p className="text-xs text-gray-400">Min Temp</p><p className="text-sm font-bold text-blue-600">{advice.forecast.minTempC?.toFixed(1)}°C</p></div>
          </div>
        </div>
      )}

      {hasAlerts && (
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Alerts & Recommendations</h4>
          {advice.alerts.map((alert, i) => <AlertCard key={i} alert={alert} />)}
        </div>
      )}
    </div>
  );
}