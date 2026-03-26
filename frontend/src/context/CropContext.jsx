import { createContext, useContext, useState } from 'react';

const CropContext = createContext(null);

// ─── HARDCODED INITIAL CROPS ──────────────────────────────────
const initialCrops = [
  {
    id: 1,
    name: 'Maize',
    variety: 'Hybrid H624',
    farm: 'Kagera Valley Farm',
    location: 'Musanze',
    health: 'Healthy',
    progress: 65,
    plantingDate: '2025-01-10',
    harvestDate: '2025-04-10',
    lastWatered: 'Today',
    size: '1.5 ha',
    img: 'https://images.unsplash.com/photo-1601472544916-85b66e160a7c?q=80&w=400',
  },
  {
    id: 2,
    name: 'Potato',
    variety: 'Kinigi Red',
    farm: 'Kagera Valley Farm',
    location: 'Musanze',
    health: 'At Risk',
    progress: 80,
    plantingDate: '2024-12-01',
    harvestDate: '2025-03-01',
    lastWatered: 'Yesterday',
    size: '2.0 ha',
    img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400',
  },
  {
    id: 3,
    name: 'Beans',
    variety: 'RWR 2245',
    farm: 'Bugesera East Fields',
    location: 'Bugesera',
    health: 'Healthy',
    progress: 30,
    plantingDate: '2025-02-01',
    harvestDate: '2025-05-01',
    lastWatered: '2 days ago',
    size: '1.0 ha',
    img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=400',
  },
  {
    id: 4,
    name: 'Rice',
    variety: 'Jasmine 85',
    farm: 'Bugesera East Fields',
    location: 'Bugesera',
    health: 'Healthy',
    progress: 50,
    plantingDate: '2025-01-20',
    harvestDate: '2025-06-01',
    lastWatered: 'Today',
    size: '3.0 ha',
    img: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9ef1d?q=80&w=400',
  },
  {
    id: 5,
    name: 'Sorghum',
    variety: 'SARO 5',
    farm: 'Huye Hillside Farm',
    location: 'Huye',
    health: 'At Risk',
    progress: 45,
    plantingDate: '2025-01-05',
    harvestDate: '2025-05-15',
    lastWatered: '3 days ago',
    size: '1.3 ha',
    img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400',
  },
];
// ─────────────────────────────────────────────────────────────

export const CropProvider = ({ children }) => {
  const [crops, setCrops] = useState(initialCrops);

  const addCrop = (newCrop) => {
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
  };

  const updateCrop = (id, updates) => {
    setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCrop = (id) => {
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CropContext.Provider value={{ crops, addCrop, updateCrop, deleteCrop }}>
      {children}
    </CropContext.Provider>
  );
};

export const useCrops = () => useContext(CropContext);