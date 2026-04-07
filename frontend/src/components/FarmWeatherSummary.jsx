import { useWeather } from '../hooks/useWeather';
import WeatherWidget from './WeatherWidget';
import GPSPermissionBanner from './GPSPermissionBanner';
import { useGPSLocation } from '../hooks/useGPSLocation';

const FarmWeatherSummary = ({ 
  district, 
  farmId, 
  farmName, 
  existingCoords = null 
}) => {
  const { 
    status, 
    coordinates, 
    error: gpsError, 
    requestGPS,
    retryGPS,
    clearGPS
  } = useGPSLocation(farmId);

  // GPS coords take priority over saved coords, saved coords over null
  const finalCoords = coordinates || existingCoords;

  const { weather, forecast, loading, error, alerts, refetch } = useWeather(
    district,
    finalCoords
  );

  const handleGPSSuccess = async () => {
    const coords = await requestGPS();
    return coords;
  };

  return (
    <div className="space-y-6">
      {farmId && (
        <GPSPermissionBanner
          status={status}
          error={gpsError}
          farmName={farmName}
          onRequestGPS={handleGPSSuccess}
          onRetryGPS={retryGPS}
          onDismiss={clearGPS}
        />
      )}
      <WeatherWidget
        district={district}
        coords={finalCoords}
      />
    </div>
  );
};

export default FarmWeatherSummary;