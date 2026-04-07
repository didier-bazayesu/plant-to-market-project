import { Navigation, AlertTriangle, CheckCircle2, Loader, X } from 'lucide-react';

const GPSPermissionBanner = ({ 
  status, 
  error, 
  farmName, 
  onRequestGPS, 
  onRetryGPS,
  onDismiss 
}) => {

  if (status === 'saved' || status === 'granted') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle2 size={18} className="text-green-600 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-black text-green-700">
            GPS Location Saved for {farmName}
          </p>
          <p className="text-xs text-green-500 font-medium mt-0.5">
            Weather data is now based on exact farm coordinates
          </p>
        </div>
        <button 
          onClick={onDismiss} 
          className="text-green-600 hover:bg-green-100 p-1 rounded-lg"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  if (status === 'requesting') {
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
        <Loader size={18} className="text-blue-500 shrink-0 animate-spin" />
        <p className="text-sm font-black text-blue-700">
          Getting your location for {farmName}...
        </p>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-black text-amber-700">
            GPS Access Denied for {farmName}
          </p>
          <p className="text-xs text-amber-600 font-medium mt-0.5">
            {error || 'Using district-level weather instead.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRetryGPS}
            className="bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-black hover:bg-amber-600 transition-all"
          >
            Retry
          </button>
          <button 
            onClick={onDismiss} 
            className="text-amber-600 hover:bg-amber-100 p-1.5 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // idle
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
      <Navigation size={18} className="text-blue-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-black text-blue-700">
          Enable Precise Weather for {farmName}
        </p>
        <p className="text-xs text-blue-500 font-medium mt-0.5">
          Allow GPS access to get accurate weather for your exact farm location.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRequestGPS}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-black hover:bg-blue-700 transition-all"
        >
          Allow GPS
        </button>
        <button 
          onClick={onDismiss} 
          className="text-blue-600 hover:bg-blue-100 p-1.5 rounded-lg"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default GPSPermissionBanner;