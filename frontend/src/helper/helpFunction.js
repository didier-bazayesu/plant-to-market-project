export const RWANDA_DISTRICTS = [
  // Kigali City
  'Gasabo', 'Kicukiro', 'Nyarugenge',
  // Northern Province
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo',
  // Southern Province
  'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe',
  'Nyanza', 'Nyaruguru', 'Ruhango',
  // Eastern Province
  'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma',
  'Nyagatare', 'Rwamagana',
  // Western Province
  'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke',
  'Rubavu', 'Rutsiro', 'Rusizi',
];

export const initialFarms = [
  {
    id: 1,
    name: 'Kagera Valley Farm',
    location: 'Musanze',
    district: 'Musanze',
    size: 4.5,
    soilType: 'Loamy',
    status: 'Active',
    activeCrops: 3,
    img: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=600',
    plots: [
      { id: 1, name: 'Plot A', size: 1.5, crop: 'Maize', status: 'Growing' },
      { id: 2, name: 'Plot B', size: 2.0, crop: 'Potato', status: 'Harvesting' },
      { id: 3, name: 'Plot C', size: 1.0, crop: 'Beans', status: 'Planting' },
    ]
  },
  {
    id: 2,
    name: 'Bugesera East Fields',
    location: 'Bugesera',
    district: 'Bugesera',
    size: 6.0,
    soilType: 'Clay',
    status: 'Active',
    activeCrops: 2,
    img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600',
    plots: [
      { id: 1, name: 'Plot A', size: 3.0, crop: 'Rice', status: 'Growing' },
      { id: 2, name: 'Plot B', size: 3.0, crop: 'Sorghum', status: 'Growing' },
    ]
  },
  {
    id: 3,
    name: 'Huye Hillside Farm',
    location: 'Huye',
    district: 'Huye',
    size: 2.8,
    soilType: 'Sandy Loam',
    status: 'Inactive',
    activeCrops: 0,
    img: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=600',
    plots: [
      { id: 1, name: 'Plot A', size: 1.5, crop: '—', status: 'Idle' },
      { id: 2, name: 'Plot B', size: 1.3, crop: '—', status: 'Idle' },
    ]
  },
];
