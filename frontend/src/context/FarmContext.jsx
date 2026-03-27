import { createContext, useContext, useState } from 'react';

const FarmContext = createContext(null);

// ─── HARDCODED INITIAL FARMS ──────────────────────────────────
const initialFarms = [
  {
    id: 1,
    name: 'Kagera Valley Farm',
    district: 'Musanze',
    location: 'Kagera Sector, Musanze',
    size: 4.5,
    soilType: 'Loamy',
    status: 'Active',
    irrigation: 'Manual',
    img: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=600',
    createdAt: '2025-01-10',
    plots: [
      { id: 1, name: 'Plot A', size: 1.5, status: 'Growing' },
      { id: 2, name: 'Plot B', size: 2.0, status: 'Harvesting' },
      { id: 3, name: 'Plot C', size: 1.0, status: 'Planting' },
    ],
  },
  {
    id: 2,
    name: 'Bugesera East Fields',
    district: 'Bugesera',
    location: 'Ntarama Sector, Bugesera',
    size: 6.0,
    soilType: 'Clay',
    status: 'Active',
    irrigation: 'Drip',
    img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600',
    createdAt: '2025-01-15',
    plots: [
      { id: 1, name: 'Plot A', size: 3.0, status: 'Growing' },
      { id: 2, name: 'Plot B', size: 3.0, status: 'Growing' },
    ],
  },
  {
    id: 3,
    name: 'Huye Hillside Farm',
    district: 'Huye',
    location: 'Tumba Sector, Huye',
    size: 2.8,
    soilType: 'Sandy Loam',
    status: 'Inactive',
    irrigation: 'Manual',
    img: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=600',
    createdAt: '2025-02-01',
    plots: [
      { id: 1, name: 'Plot A', size: 1.5, status: 'Idle' },
      { id: 2, name: 'Plot B', size: 1.3, status: 'Idle' },
    ],
  },
];
// ─────────────────────────────────────────────────────────────

export const FarmProvider = ({ children }) => {
  const [farms, setFarms] = useState(initialFarms);

  // ─── ADD FARM ──────────────────────────────────────────────
  const addFarm = (newFarm) => {
    setFarms((prev) => [
      ...prev,
      {
        ...newFarm,
        id: Date.now(),
        status: 'Active',
        plots: [],
        createdAt: new Date().toISOString().split('T')[0],
        img: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=600',
      },
    ]);
  };

  // ─── UPDATE FARM ───────────────────────────────────────────
  const updateFarm = (id, updates) => {
    setFarms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  // ─── DELETE FARM ───────────────────────────────────────────
  const deleteFarm = (id) => {
    setFarms((prev) => prev.filter((f) => f.id !== id));
  };

  // ─── ADD PLOT TO FARM ──────────────────────────────────────
  const addPlot = (farmId, plot) => {
    setFarms((prev) =>
      prev.map((f) =>
        f.id === farmId
          ? {
              ...f,
              plots: [
                ...f.plots,
                { ...plot, id: Date.now() },
              ],
            }
          : f
      )
    );
  };

  // ─── GET SINGLE FARM ───────────────────────────────────────
  const getFarm = (id) => farms.find((f) => f.id === Number(id));

  return (
    <FarmContext.Provider
      value={{ farms, addFarm, updateFarm, deleteFarm, addPlot, getFarm }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarms = () => useContext(FarmContext);