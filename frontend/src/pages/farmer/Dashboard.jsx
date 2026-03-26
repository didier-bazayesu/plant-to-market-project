import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCrops } from '../../context/CropContext';
import {
  Sprout, MapPin, CloudRain, TrendingUp,
  AlertTriangle, CheckCircle2, ArrowRight,
  Droplets, Plus, Layers, Sun, Wind
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { marketPrices } from '../../data/mockData';

// ─── HARDCODED WEATHER ────────────────────────────────────────
const weatherData = {
  temp: 24,
  condition: 'Light Rain',
  humidity: 78,
  wind: 12,
  forecast: [
    { day: 'Mon', icon: CloudRain, temp: 22 },
    { day: 'Tue', icon: Sun, temp: 26 },
    { day: 'Wed', icon: CloudRain, temp: 21 },
    { day: 'Thu', icon: Sun, temp: 25 },
    { day: 'Fri', icon: Wind, temp: 23 },
  ]
};
// ─────────────────────────────────────────────────────────────

const FarmerDashboard = () => {
  const { farmer } = useAuth();
  const { crops } = useCrops();
  const navigate = useNavigate();

  // ─── STATS ────────────────────────────────────────────────
  const totalCrops = crops.length;
  const healthyCrops = crops.filter(c => c.health === 'Healthy').length;
  const atRiskCrops = crops.filter(c => c.health === 'At Risk').length;
  const readyToHarvest = crops.filter(c => c.progress >= 80).length;

  // Recent crops — last 3
  const recentCrops = crops.slice(0, 3);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Good morning, {farmer?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <MapPin size={14} className="text-green-600" />
              {farmer?.district}, Rwanda • {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/activities')}
              className="bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:bg-green-700 transition-all flex items-center gap-2 font-black text-sm"
            >
              <Plus size={16} /> Register Crop
            </button>
            <button
              onClick={() => navigate('/my-farms')}
              className="bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 font-black text-sm"
            >
              <Layers size={16} /> My Farms
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Crops',
              value: totalCrops,
              icon: Sprout,
              color: 'bg-green-50 text-green-600',
              border: 'border-green-100'
            },
            {
              label: 'Healthy',
              value: healthyCrops,
              icon: CheckCircle2,
              color: 'bg-blue-50 text-blue-600',
              border: 'border-blue-100'
            },
            {
              label: 'At Risk',
              value: atRiskCrops,
              icon: AlertTriangle,
              color: 'bg-red-50 text-red-500',
              border: 'border-red-100'
            },
            {
              label: 'Ready to Harvest',
              value: readyToHarvest,
              icon: TrendingUp,
              color: 'bg-amber-50 text-amber-600',
              border: 'border-amber-100'
            },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white rounded-3xl p-5 border shadow-sm ${stat.border}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 font-bold mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* WEATHER CARD */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-white/10 rounded-full" />
              <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-white/10 rounded-full" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-1">
                      Current Weather
                    </p>
                    <p className="text-5xl font-black">{weatherData.temp}°C</p>
                    <p className="text-blue-100 font-bold mt-1 flex items-center gap-2">
                      <CloudRain size={16} /> {weatherData.condition}
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="bg-white/10 rounded-2xl px-4 py-2">
                      <p className="text-[10px] text-blue-200 font-bold">Humidity</p>
                      <p className="font-black">{weatherData.humidity}%</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl px-4 py-2">
                      <p className="text-[10px] text-blue-200 font-bold">Wind</p>
                      <p className="font-black">{weatherData.wind} km/h</p>
                    </div>
                  </div>
                </div>

                {/* 5 day forecast */}
                <div className="flex justify-between gap-2">
                  {weatherData.forecast.map((day) => (
                    <div key={day.day} className="flex-1 bg-white/10 rounded-2xl p-3 text-center">
                      <p className="text-[10px] font-black text-blue-200 mb-2">{day.day}</p>
                      <day.icon size={16} className="mx-auto mb-2" />
                      <p className="font-black text-sm">{day.temp}°</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RECENT CROPS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Sprout className="text-green-600" size={20} /> Recent Crops
                </h2>
                <button
                  onClick={() => navigate('/my-crops')}
                  className="text-green-600 font-black text-xs flex items-center gap-1 hover:underline"
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>

              {recentCrops.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-100 shadow-sm">
                  <Sprout size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="font-black text-gray-400">No crops yet</p>
                  <p className="text-xs text-gray-300 font-medium mt-1 mb-4">
                    Register your first crop to get started
                  </p>
                  <button
                    onClick={() => navigate('/activities')}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs hover:bg-green-700 transition-all inline-flex items-center gap-2"
                  >
                    <Plus size={14} /> Register Crop
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCrops.map((crop) => (
                    <div
                      key={crop.id}
                      className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group cursor-pointer"
                      onClick={() => navigate('/my-crops')}
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                        <img
                          src={crop.img}
                          alt={crop.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-black text-gray-900">{crop.name}</h3>
                          <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            crop.health === 'Healthy'
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : 'bg-red-50 text-red-500 border-red-100'
                          }`}>
                            {crop.health}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold mb-2">
                          {crop.variety} • {crop.location}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                            <div
                              className={`h-full rounded-full ${
                                crop.health === 'Healthy' ? 'bg-green-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${crop.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-green-600 shrink-0">
                            {crop.progress}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-gray-300">
                        <Droplets size={14} className="text-blue-400" />
                        <span className="text-xs font-bold text-gray-400">{crop.lastWatered}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AT RISK ALERT */}
            {atRiskCrops > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6 flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-xl shrink-0">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-red-700">
                    {atRiskCrops} crop{atRiskCrops > 1 ? 's are' : ' is'} at risk
                  </p>
                  <p className="text-xs text-red-400 font-medium mt-1">
                    Check your crops and run an AI health scan to detect issues early.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/activities')}
                  className="bg-red-500 text-white px-4 py-2 rounded-2xl font-black text-xs hover:bg-red-600 transition-all shrink-0"
                >
                  View
                </button>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* FARMER PROFILE CARD */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-6 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                  {farmer?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-lg leading-tight">{farmer?.name}</p>
                  <p className="text-green-400 text-xs font-bold">{farmer?.district}, Rwanda</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-white/10 rounded-xl px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold">Phone</span>
                  <span className="text-xs font-black">{farmer?.phone || '—'}</span>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold">Email</span>
                  <span className="text-xs font-black truncate ml-2">{farmer?.email}</span>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold">Role</span>
                  <span className="text-xs font-black capitalize text-green-400">{farmer?.role}</span>
                </div>
              </div>
            </div>

            {/* MARKET PRICES */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
                <TrendingUp className="text-green-600" size={18} /> Live Market
              </h3>
              <div className="space-y-4">
                {marketPrices.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.crop}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-sm">{item.price} RWF</p>
                      <p className={`text-[10px] font-black ${
                        item.trend > 0 ? 'text-green-500' :
                        item.trend < 0 ? 'text-red-500' : 'text-gray-300'
                      }`}>
                        {item.trend > 0 ? `▲ ${item.trend}%` :
                         item.trend < 0 ? `▼ ${Math.abs(item.trend)}%` : 'STABLE'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;