export const initialCrops = [
  {
    id: 1,
    name: "Irish Potatoes",
    variety: "Kinigi",
    location: "Musanze - Sector B",
    progress: 75,
    health: "Healthy",
    lastWatered: "2 hours ago",
    nextTask: "Harvesting Prep",
    img: "https://images.unsplash.com/photo-1518977676601-b53f02bad67b?q=80&w=400"
  },
  {
    id: 2,
    name: "Maize",
    variety: "Hybrid H624",
    location: "Bugesera - Plot 4",
    progress: 40,
    health: "Warning",
    lastWatered: "1 day ago",
    nextTask: "AI Foliar Scan",
    img: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?q=80&w=400"
  },
  {
    id: 3,
    name: "Climbing Beans",
    variety: "MAC 44",
    location: "Rubavu - West",
    progress: 15,
    health: "Healthy",
    lastWatered: "30 mins ago",
    nextTask: "Staking Support",
    img: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=400"
  }
];

export const marketPrices = [
  { id: 1, crop: "Irish Potatoes", price: 420, trend: 12, location: "Nyabugogo" },
  { id: 2, crop: "Maize", price: 350, trend: -5, location: "Kimironko" },
  { id: 3, crop: "Beans", price: 850, trend: 0, location: "Musanze" }
];