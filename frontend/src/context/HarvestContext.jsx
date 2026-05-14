import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const HarvestContext = createContext();

export const HarvestProvider = ({ children }) => {
  const { token } = useAuth();
  const [harvests, setHarvests] = useState([]);

  const getHarvestsByCrop = useCallback(async (cropId) => {
    try {
      const res = await fetch(`/api/harvests?cropId=${cropId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      return data.harvests || [];
    } catch (err) {
      console.error('getHarvestsByCrop error:', err);
      return [];
    }
  }, [token]);

  const addHarvest = useCallback(async (harvestData) => {
    const res = await fetch('/api/harvests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(harvestData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to log harvest');
    }
    const data = await res.json();
    setHarvests(prev => [data.harvest, ...prev]);
    return data.harvest;
  }, [token]);

  return (
    <HarvestContext.Provider value={{ harvests, addHarvest, getHarvestsByCrop }}>
      {children}
    </HarvestContext.Provider>
  );
};

export const useHarvests = () => useContext(HarvestContext);