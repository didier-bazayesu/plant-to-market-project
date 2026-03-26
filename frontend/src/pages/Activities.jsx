import React, { useState } from 'react';
import { marketPrices } from '../data/mockData';
import { useCrops } from '../context/CropContext';
import { 
  Sprout, Droplets, TrendingUp, MapPin, 
  CloudRain, Plus, ArrowRight, Microscope 
} from 'lucide-react';
import RegisterCrop from '../components/RegisterCrop';

const Activity = () => {
  const { crops, addCrop } = useCrops();
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Farm Activity</h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <MapPin size={14} className="text-green-600"/> Rwanda • {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-3 border border-blue-100">
              <CloudRain className="text-blue-600" size={20} />
              <p className="text-sm font-black text-blue-900">24°C • Light Rain</p>
            </div>
            <button 
              onClick={() => setShowRegister(true)}
              className="bg-green-600 text-white p-3 rounded-2xl shadow-lg hover:bg-green-700 transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sprout className="text-green-600" /> Active Cultivations
              <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {crops.length} crops
              </span>
            </h2>

            {crops.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-sm">
                <Sprout size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-black text-gray-400 text-lg">No crops registered yet</p>
                <p className="text-sm text-gray-300 font-medium mt-1 mb-6">Click the + button to register your first crop</p>
                <button
                  onClick={() => setShowRegister(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-700 transition-all inline-flex items-center gap-2"
                >
                  <Plus size={16} /> Register Crop
                </button>
              </div>
            ) : (
              crops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-48 h-48 rounded-[2rem] overflow-hidden shrink-0">
                      <img src={crop.img} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    
                    <div className="flex-grow p-4 pr-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">{crop.name}</h3>
                          <p className="text-sm text-gray-400 font-medium uppercase tracking-tighter">
                            {crop.variety} • {crop.location}
                          </p>
                          {/* Show farm name if available */}
                          {crop.farm && (
                            <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                              <MapPin size={10} /> {crop.farm}
                            </p>
                          )}
                        </div>
                        <StatusBadge health={crop.health} />
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-gray-400">Growth Progress</span>
                          <span className="text-green-600">{crop.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              crop.health === 'Healthy' ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${crop.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-blue-500" />
                          <span className="text-xs font-bold text-gray-600">{crop.lastWatered}</span>
                        </div>
                        {crop.plantingDate && (
                          <div className="text-xs font-bold text-gray-400">
                            Planted: {new Date(crop.plantingDate).toLocaleDateString()}
                          </div>
                        )}
                        <button className="ml-auto text-green-600 font-bold text-xs flex items-center gap-1 hover:underline">
                          Details <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Microscope className="text-green-500" size={20}/> AI Health Scan
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                  <p className="text-sm font-medium italic opacity-80">
                    "Analyzing latest uploads for potato sectors..."
                  </p>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-2xl font-black text-xs transition-colors">
                  Run New AI Scan
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-600" size={20}/> Live Market
              </h3>
              <div className="space-y-6">
                {marketPrices.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0">
                    <div>
                      <p className="font-bold text-gray-900">{item.crop}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">{item.price} RWF</p>
                      <p className={`text-[10px] font-black ${
                        item.trend > 0 ? 'text-green-500' : 
                        item.trend < 0 ? 'text-red-500' : 'text-gray-300'
                      }`}>
                        {item.trend > 0 ? `▲ ${item.trend}%` : item.trend < 0 ? `▼ ${Math.abs(item.trend)}%` : 'STABLE'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* REGISTER CROP PANEL */}
      {showRegister && (
        <RegisterCrop
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onAddCrop={addCrop}
        />
      )}

    </div>
  );
};

const StatusBadge = ({ health }) => (
  <span className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
    health === 'Healthy' 
      ? 'bg-green-50 text-green-600 border-green-100' 
      : 'bg-red-50 text-red-600 border-red-100 animate-pulse'
  }`}>
    {health}
  </span>
);

export default Activity;