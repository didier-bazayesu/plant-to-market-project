import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export const useGPSLocation = (farmId = null) => {
  const { token } = useAuth();
  const [status, setStatus] = useState('idle');
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const requestedRef = useRef(false);

  const clearGPS = useCallback(() => {
    setStatus('idle');
    setCoordinates(null);
    setError(null);
    setLoading(false);
    requestedRef.current = false;
  }, []);

  const requestGPS = useCallback(() => {
    // Block if already requesting
    if (requestedRef.current) return Promise.resolve(null);

    if (!navigator.geolocation) {
      setStatus('denied');
      setError('Geolocation is not supported by your browser');
      return Promise.resolve(null);
    }

    requestedRef.current = true;
    setStatus('requesting');
    setLoading(true);
    setError(null);

    // Return a promise so components can await the result
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coords = { latitude, longitude };

          setCoordinates(coords);
          setLoading(false);

          // Save to backend if farmId provided
          if (farmId && token) {
            try {
              const res = await fetch(`/api/farms/${farmId}/location`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ latitude, longitude })
              });

              if (res.ok) {
                setStatus('saved');
                console.log(`✅ GPS saved for farm ${farmId}`);
                resolve(coords); // return coords to caller
              } else {
                // GPS worked but save failed — still useful
                setStatus('granted');
                console.warn('⚠️ GPS obtained but backend save failed');
                resolve(coords);
              }
            } catch (err) {
              // Network error — GPS still valid, saving failed
              setStatus('granted');
              console.error('Failed to save GPS to backend:', err);
              resolve(coords);
            }
          } else {
            // No farmId — just return coordinates, no saving needed
            setStatus('granted');
            resolve(coords);
          }
        },
        (err) => {
          setLoading(false);
          setStatus('denied');
          requestedRef.current = false; // allow retry after denial

          const message =
            err.code === 1
              ? 'Location access denied. Using farm pin or district weather instead.'
              : err.code === 2
              ? 'Location unavailable. Please try again.'
              : 'Location request timed out. Please try again.';

          setError(message);
          resolve(null); // resolve with null so callers don't hang
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // reuse position if under 5 min old
        }
      );
    });
  }, [farmId, token]);

  // Retry — clears denial state and requests again
  const retryGPS = useCallback(() => {
    clearGPS();
    // Small delay to ensure state is reset before re-requesting
    setTimeout(() => {
      requestedRef.current = false;
    }, 100);
    return requestGPS();
  }, [clearGPS, requestGPS]);

  return {
    status,       // 'idle' | 'requesting' | 'granted' | 'denied' | 'saved'
    coordinates,  // { latitude, longitude } or null
    error,        // string or null
    loading,      // true while browser is fetching position
    requestGPS,   // call to trigger GPS — returns Promise<coords | null>
    retryGPS,     // call after denial to try again
    clearGPS,     // resets everything to idle
  };
};