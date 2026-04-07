import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FarmContext = createContext(null);

export const FarmProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && token) {
      fetchFarms();
    } else if (!authLoading && !token) {
      setLoading(false);
    }
  }, [token, authLoading]);

  // ─── MAP BACKEND FIELDS TO FRONTEND FIELDS ────────────────
  const mapFarm = (f) => ({
    id: f.id,
    name: f.name,
    district: f.district || f.location || '—',
    location: f.location || '—',
    size: f.size,
    soilType: f.soilType || '—',
    status: 'Active',
    irrigation: f.irrigation || 'Manual',
    locationAccuracy: f.locationAccuracy || 'district_fallback',
    farmerId: f.farmerId,
    img: f.img || 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=600',
    createdAt: f.createdAt || new Date().toISOString().split('T')[0],
    plots: f.plots || [],
    crops: f.crops || [],
    // ✅ Read from gpsLocation include, not f.location string
    latitude: f.gpsLocation?.latitude || null,
    longitude: f.gpsLocation?.longitude || null,
    hasGPS: !!(f.gpsLocation?.latitude && f.gpsLocation?.longitude),
  });

  // ─── FETCH ALL FARMS ──────────────────────────────────────
  const fetchFarms = async () => {
    try {
      const res = await fetch('/api/farms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch farms');
      const data = await res.json();
      setFarms(data.farms.map(mapFarm));
    } catch (err) {
      console.error('fetchFarms error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── ADD FARM ─────────────────────────────────────────────
  const addFarm = async (newFarm) => {
  try {
    const res = await fetch('/api/farms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newFarm.name,
        location: newFarm.location || newFarm.district,
        district: newFarm.district,
        size: parseFloat(newFarm.size),
        soilType: newFarm.soilType,
        irrigation: newFarm.irrigation,
        latitude: newFarm.latitude || null,
        longitude: newFarm.longitude || null,
        // ✅ correct field name
        locationAccuracy: newFarm.locationAccuracy || 'district_fallback',
      })
    });

    if (!res.ok) throw new Error('Failed to add farm');

    // ✅ No second fetch needed — backend handles FarmLocation now
    await fetchFarms();

  } catch (err) {
    console.error('addFarm error:', err);
    setFarms((prev) => [
      ...prev,
      {
        ...newFarm,
        id: Date.now(),
        status: 'Active',
        plots: [],
        crops: [],
        createdAt: new Date().toISOString().split('T')[0],
        img: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=600',
        latitude: newFarm.latitude || null,
        longitude: newFarm.longitude || null,
        hasGPS: !!(newFarm.latitude && newFarm.longitude),
        locationAccuracy: newFarm.locationAccuracy || 'district_fallback',
      },
    ]);
  }
};

  // ─── UPDATE FARM ──────────────────────────────────────────
const updateFarm = async (id, updates) => {
  try {
    const res = await fetch(`/api/farms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    if (!res.ok) throw new Error('Failed to update farm');

    const data = await res.json();

    // ✅ Use returned farm from backend instead of local merge
    // so gpsLocation is always fresh
    setFarms((prev) =>
      prev.map((f) => (f.id === id ? mapFarm(data.farm) : f))
    );

  } catch (err) {
    console.error('updateFarm error:', err);
    // Local fallback
    setFarms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }
};

  // ─── DELETE FARM ──────────────────────────────────────────
  const deleteFarm = async (id) => {
    try {
      await fetch(`/api/farms/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarms((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('deleteFarm error:', err);
      setFarms((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // ─── ADD PLOT TO FARM (local only) ────────────────────────
  const addPlot = (farmId, plot) => {
    setFarms((prev) =>
      prev.map((f) =>
        f.id === farmId
          ? { ...f, plots: [...f.plots, { ...plot, id: Date.now() }] }
          : f
      )
    );
  };

  // ─── GET SINGLE FARM ──────────────────────────────────────
  const getFarm = (id) => farms.find((f) => f.id === Number(id));

  return (
    <FarmContext.Provider
      value={{
        farms,
        loading,
        addFarm,
        updateFarm,
        deleteFarm,
        addPlot,
        getFarm,
        fetchFarms,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarms = () => useContext(FarmContext);