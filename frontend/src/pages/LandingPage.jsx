import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_URL from "../utilis/api";

const images = [
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2049",
  "https://images.unsplash.com/photo-1574943322596-66c2417b397f?q=80&w=2028",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000",
  "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2000",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000",
  "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000",
  "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=2000",
];

const LandingPage = () => {
  const { token } = useAuth();
  const [currentImg, setCurrentImg] = useState(0);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/public/stats`); // no token
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error("fetchStats error:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div
        className="relative h-137.5 transition-all duration-1000 ease-in-out bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${images[currentImg]})`,
        }}
      >
        <div className="text-center px-4 max-w-4xl animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Modern Solutions for{" "}
            <span className="text-green-400 font-serif italic">
              Rwandan Agriculture
            </span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 mb-8 max-w-2xl mx-auto">
            Providing real-time data for farmers to optimize harvest cycles and
            maximize market profits.
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
        <div className="absolute bottom-10 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImg ? "bg-green-400 w-8" : "bg-white/30 w-3"}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            emoji="🌿"
            title="Total Crops"
            value={loadingStats ? "..." : (stats?.totalCrops ?? 0)}
            borderColor="border-green-500"
          />
          <StatCard
            emoji="👨‍🌾"
            title="Farmers"
            value={loadingStats ? "..." : (stats?.totalFarmers ?? 0)}
            borderColor="border-blue-500"
          />
          <StatCard
            emoji="🚜"
            title="Managed Farms"
            value={loadingStats ? "..." : (stats?.totalFarms ?? 0)}
            borderColor="border-amber-500"
          />
          <StatCard
            emoji="📊"
            title="Total Activities"
            value={loadingStats ? "..." : (stats?.totalActivities ?? 0)}
            borderColor="border-red-500"
          />
         
          <StatCard
            emoji="💰"
            title="Avg Price on market"
            value={`700 RWF`}
            borderColor="border-red-500"
          />
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-medium text-sm">
                No activities logged yet
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-bold text-gray-700 capitalize">
                        {activity.type}:{" "}
                        <span className="font-normal">{activity.notes}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Crop #{activity.cropId}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 italic">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ emoji, title, value, borderColor }) => (
  <div
    className={`bg-white p-6 rounded-2xl shadow-xl border-b-4 ${borderColor} transform transition hover:-translate-y-2`}
  >
    <div className="text-3xl mb-4">{emoji}</div>
    <h3 className="text-gray-400 font-semibold text-xs uppercase tracking-widest">
      {title}
    </h3>
    <p className="text-4xl font-black text-gray-800 mt-1">{value}</p>
  </div>
);

export default LandingPage;
