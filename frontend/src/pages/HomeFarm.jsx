import React, { useState, useEffect } from 'react';

// Hard-coded images for the slider
const images = [
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2049",
  "https://images.unsplash.com/photo-1574943322596-66c2417b397f?q=80&w=2028",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000",
  "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2000",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000",
  "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000",
  "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=2000"
];

// Hard-coded statistics
const STATIC_STATS = {
  crops: 124,
  farmers: 45,
  farms: 18,
  avgPrice: 650
};

// Hard-coded recent activities
const RECENT_ACTIVITIES = [
  { id: 1, action: "Harvest Recorded", item: "Maize", user: "Didier B.", time: "2 hours ago", color: "text-green-600" },
  { id: 2, action: "New Price Update", item: "Potatoes", user: "System", time: "5 hours ago", color: "text-blue-600" },
  { id: 3, action: "Farm Registered", item: "Gisenyi Sector", user: "Admin", time: "1 day ago", color: "text-amber-600" },
];

const HomeFarm = () => {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div 
        className="relative h-137.5 transition-all duration-1000 ease-in-out bg-cover bg-center flex items-center justify-center text-white"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${images[currentImg]})` 
        }}
      >
        <div className="text-center px-4 max-w-4xl animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Modern Solutions for <span className="text-green-400 font-serif italic">Rwandan Agriculture</span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 mb-8 max-w-2xl mx-auto">
            Providing real-time data for farmers to optimize harvest cycles and maximize market profits.
          </p>
          <div className="flex gap-4 justify-center">
             <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95">
               Manage Crops
             </button>
             <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-3 rounded-full font-bold transition">
               Market Reports
             </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-10 flex gap-2">
          {images.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImg ? 'bg-green-400 w-8' : 'bg-white/30 w-3'}`} />
          ))}
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <StatCard emoji="🌿" title="Total Crops" value={STATIC_STATS.crops} borderColor="border-green-500" />
          <StatCard emoji="👨‍🌾" title="Farmers" value={STATIC_STATS.farmers} borderColor="border-blue-500" />
          <StatCard emoji="🚜" title="Managed Farms" value={STATIC_STATS.farms} borderColor="border-amber-500" />
          <StatCard emoji="💰" title="Avg Price" value={`${STATIC_STATS.avgPrice} RWF`} borderColor="border-red-500" />

        </div>

        {/* Recent Activity Table */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button className="text-green-600 font-semibold text-sm hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${activity.color.replace('text', 'bg')}`}></div>
                  <div>
                    <p className="font-bold text-gray-700">{activity.action}: <span className="font-normal">{activity.item}</span></p>
                    <p className="text-xs text-gray-400">By {activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 italic">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Sub-component for Stats
const StatCard = ({ emoji, title, value, borderColor }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-xl border-b-4 ${borderColor} transform transition hover:-translate-y-2`}>
    <div className="text-3xl mb-4">{emoji}</div>
    <h3 className="text-gray-400 font-semibold text-xs uppercase tracking-widest">{title}</h3>
    <p className="text-4xl font-black text-gray-800 mt-1">{value}</p>
  </div>
);

export default HomeFarm;