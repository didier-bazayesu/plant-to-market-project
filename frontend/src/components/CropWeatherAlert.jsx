import { AlertTriangle, CheckCircle2, Droplets, Thermometer, Info } from 'lucide-react';

const severityConfig = {
  good: {
    bg: 'bg-green-50 border-green-100',
    icon: <CheckCircle2 size={16} className="text-green-600" />,
    badge: 'bg-green-100 text-green-700',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-100',
    icon: <AlertTriangle size={16} className="text-amber-600" />,
    badge: 'bg-amber-100 text-amber-700',
  },
  danger: {
    bg: 'bg-red-50 border-red-100',
    icon: <AlertTriangle size={16} className="text-red-500" />,
    badge: 'bg-red-100 text-red-700',
  },
  info: {
    bg: 'bg-blue-50 border-blue-100',
    icon: <Info size={16} className="text-blue-500" />,
    badge: 'bg-blue-100 text-blue-700',
  },
};

const CropWeatherAlert = ({ alert }) => {
  if (!alert) return null;
  const config = severityConfig[alert.severity] || severityConfig.good;

  return (
    <div className={`rounded-2xl border p-4 ${config.bg}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-black text-gray-900 text-sm">{alert.cropName}</p>
            <span className={`text-xs font-black px-2 py-0.5 rounded-full capitalize ${config.badge}`}>
              {alert.status}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-600 mb-3">{alert.message}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/70 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Thermometer size={12} className="text-orange-500" />
                <span className="text-xs font-black text-gray-500">Temperature</span>
              </div>
              <p className="text-xs font-black text-gray-800">Now: {alert.currentTemp}°C</p>
              <p className="text-xs text-gray-400 font-bold">Ideal: {alert.idealTemp}</p>
            </div>
            <div className="bg-white/70 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets size={12} className="text-blue-500" />
                <span className="text-xs font-black text-gray-500">Humidity</span>
              </div>
              <p className="text-xs font-black text-gray-800">Now: {alert.currentHumidity}%</p>
              <p className="text-xs text-gray-400 font-bold">Ideal: {alert.idealHumidity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropWeatherAlert;