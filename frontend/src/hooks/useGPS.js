// src/hooks/useGPS.js
import { useState, useCallback } from 'react';

export const useGPS = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, requesting, granted, denied

  const requestGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setStatus('denied');
      return;
    }

    setStatus('requesting');
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setStatus('granted');
        setLoading(false);
        console.log('✅ GPS obtained:', position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.log('GPS Error:', err.code, err.message);
        setError("Location access denied. Using district weather.");
        setStatus('denied');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { 
    coords,      // ✅ coordinates object
    error,       // ✅ error message
    loading,     // ✅ loading state
    status,      // ✅ status: 'idle', 'requesting', 'granted', 'denied'
    requestGPS   // ✅ function to request GPS
  };
};