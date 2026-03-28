import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CropContext = createContext(null);

export const CropProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!authLoading && token) {
    fetchCrops();
  } else if (!authLoading && !token) {
    setLoading(false);
  }
  }, [token, authLoading]);

  // ─── MAP BACKEND FIELDS TO FRONTEND FIELDS ────────────────
  const mapCrop = (c) => ({
    id: c.id,
    name: c.cropType,
    variety: c.variety || '—',
    farm: c.farm?.name || '—',
    location: c.farm?.location || '—',
    health: c.health || 'Healthy',
    progress: c.progress || 0,
    plantingDate: c.plantingDate,
    harvestDate: c.harvestDate || null,
    lastWatered: c.lastWatered || 'Not yet',
    size: c.size ? `${c.size} ha` : '—',
    img: c.img || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400',
    status: c.status,
    farm_id: c.farm_id,
  });

  // ─── FETCH ALL CROPS ──────────────────────────────────────
  const fetchCrops = async () => {
    try {
      const res = await fetch('/api/crops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch crops');
      const data = await res.json();
      setCrops(data.crops.map(mapCrop));
    } catch (err) {
      console.error('fetchCrops error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── ADD CROP ─────────────────────────────────────────────
  const addCrop = async (newCrop) => {
    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cropType: newCrop.name,
          plantingDate: newCrop.plantingDate,
          farm_id: newCrop.farm_id,
          status: 'planted',
        })
      });
      if (!res.ok) throw new Error('Failed to add crop');
      await fetchCrops(); // refresh from backend
    } catch (err) {
      console.error('addCrop error:', err);
      // ✅ Fallback — add locally if backend fails
      setCrops((prev) => [
        ...prev,
        {
          ...newCrop,
          id: Date.now(),
          health: 'Healthy',
          progress: 0,
          lastWatered: 'Not yet',
          img: newCrop.img || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400',
        },
      ]);
    }
  };

  // ─── UPDATE CROP ──────────────────────────────────────────
  const updateCrop = async (id, updates) => {
    try {
      await fetch(`/api/crops/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    } catch (err) {
      console.error('updateCrop error:', err);
      // Fallback — update locally
      setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    }
  };

  // ─── DELETE CROP ──────────────────────────────────────────
  const deleteCrop = async (id) => {
    try {
      await fetch(`/api/crops/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setCrops((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('deleteCrop error:', err);
      // Fallback — delete locally
      setCrops((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <CropContext.Provider value={{ crops, loading, addCrop, updateCrop, deleteCrop, fetchCrops }}>
      {children}
    </CropContext.Provider>
  );
};

export const useCrops = () => useContext(CropContext);