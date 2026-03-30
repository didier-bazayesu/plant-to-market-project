import { useState } from 'react';
import { useCrops } from '../context/CropContext';
import {
  Sprout, MapPin, Droplets, ArrowRight,
  Search, Filter, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, Layers, Trash2, X
} from 'lucide-react';

const HEALTH_FILTERS = ['All', 'Healthy', 'At Risk'];

const Crops = () => {
  const { crops, deleteCrop } = useCrops();
  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState('All');
  const [farmFilter, setFarmFilter] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ─── DYNAMIC FARM FILTERS ────────────────────────────────
  const FARM_FILTERS = ['All', ...new Set(crops.map(c => c.farm).filter(Boolean))];

  // ─── STATS ───────────────────────────────────────────────
  const total = crops.length;
  const healthy = crops.filter(c => c.health === 'Healthy').length;
  const atRisk = crops.filter(c => c.health === 'At Risk').length;
  const readyToHarvest = crops.filter(c => c.progress >= 80).length;

  // ─── FILTERED CROPS ──────────────────────────────────────
  const filtered = crops.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.variety.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchHealth = healthFilter === 'All' || c.health === healthFilter;
    const matchFarm = farmFilter === 'All' || c.farm === farmFilter;
    return matchSearch && matchHealth && matchFarm;
  });

  // ─── DELETE HANDLERS ─────────────────────────────────────
  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setConfirmDelete(id);
  };

  const handleConfirmDelete = () => {
    deleteCrop(confirmDelete);
    if (selectedCrop?.id === confirmDelete) setSelectedCrop(null);
    setConfirmDelete(null);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Crops</h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <MapPin size={14} className="text-green-600" />
              Rwanda • {total} crop{total !== 1 ? 's' : ''} registered
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-3.5 text-gray-300" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crops..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-800 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Crops', value: total, icon: Sprout, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
            { label: 'Healthy', value: healthy, icon: CheckCircle2, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
            { label: 'At Risk', value: atRisk, icon: AlertTriangle, color: 'bg-red-50 text-red-500', border: 'border-red-100' },
            { label: 'Ready to Harvest', value: readyToHarvest, icon: TrendingUp, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
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

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Filter</span>
          </div>

          {/* Health filter */}
          <div className="flex gap-2 flex-wrap">
            {HEALTH_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setHealthFilter(f)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
                  healthFilter === f
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-green-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-200 hidden sm:block" />

          {/* Farm filter — dynamic */}
          <div className="flex gap-2 flex-wrap">
            {FARM_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFarmFilter(f)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
                  farmFilter === f
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                }`}
              >
                {f === 'All' ? 'All Farms' : f.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* CROPS GRID + DETAIL */}
        <div className="space-y-6">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-sm">
              <Sprout size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="font-black text-gray-400 text-lg">No crops found</p>
              <p className="text-sm text-gray-300 font-medium mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              {/* CROP CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((crop) => (
                  <div
                    key={crop.id}
                    onClick={() => setSelectedCrop(selectedCrop?.id === crop.id ? null : crop)}
                    className={`bg-white rounded-[2rem] overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                      selectedCrop?.id === crop.id
                        ? 'border-green-400 ring-2 ring-green-100'
                        : 'border-gray-100'
                    }`}
                  >
                    {/* Crop image */}
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={crop.img}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Health badge */}
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        crop.health === 'Healthy'
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : 'bg-red-50 text-red-500 border-red-100 animate-pulse'
                      }`}>
                        {crop.health}
                      </span>

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDeleteClick(e, crop.id)}
                        className="absolute top-3 left-3 bg-white/90 hover:bg-red-50 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 hover:text-red-500 text-gray-400"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Progress pill */}
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/20 rounded-full">
                          <div
                            className="h-full rounded-full bg-green-400"
                            style={{ width: `${crop.progress}%` }}
                          />
                        </div>
                        <span className="text-white text-[10px] font-black">{crop.progress}%</span>
                      </div>
                    </div>

                    {/* Crop info */}
                    <div className="p-5">
                      <h3 className="text-lg font-black text-gray-900">{crop.name}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-3">
                        {crop.variety}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-gray-400 font-bold">
                          <MapPin size={12} className="text-green-500" />
                          {crop.location}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 font-bold">
                          <Droplets size={12} className="text-blue-400" />
                          {crop.lastWatered}
                        </div>
                      </div>

                      {crop.farm && (
                        <div className="mt-3 flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2">
                          <Layers size={12} className="text-gray-400" />
                          <span className="text-xs font-black text-gray-500">{crop.farm}</span>
                        </div>
                      )}

                      <button className="mt-3 w-full text-green-600 font-black text-xs flex items-center justify-center gap-1 hover:underline">
                        {selectedCrop?.id === crop.id ? 'Hide Details' : 'View Details'}
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* DETAIL ROW */}
              {selectedCrop && (
                <div className="bg-white rounded-[2rem] border border-green-100 shadow-sm p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8">

                    {/* Left — image */}
                    <div className="md:w-56 h-48 rounded-[1.5rem] overflow-hidden shrink-0">
                      <img
                        src={selectedCrop.img}
                        alt={selectedCrop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Right — details */}
                    <div className="flex-1 space-y-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">{selectedCrop.name}</h3>
                          <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">
                            {selectedCrop.variety}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            selectedCrop.health === 'Healthy'
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : 'bg-red-50 text-red-500 border-red-100'
                          }`}>
                            {selectedCrop.health}
                          </span>
                          {/* Delete from detail panel */}
                          <button
                            onClick={(e) => handleDeleteClick(e, selectedCrop.id)}
                            className="p-2 hover:bg-red-50 rounded-xl transition-all text-gray-300 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            onClick={() => setSelectedCrop(null)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-gray-400">Growth Progress</span>
                          <span className="text-green-600">{selectedCrop.progress}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              selectedCrop.health === 'Healthy' ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${selectedCrop.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { icon: MapPin, label: 'Location', value: selectedCrop.location, color: 'text-green-500' },
                          { icon: Layers, label: 'Farm', value: selectedCrop.farm || '—', color: 'text-blue-500' },
                          { icon: Droplets, label: 'Last Watered', value: selectedCrop.lastWatered, color: 'text-cyan-500' },
                          { icon: Clock, label: 'Field Size', value: selectedCrop.size || '—', color: 'text-amber-500' },
                        ].map((item) => (
                          <div key={item.label} className="bg-gray-50 rounded-2xl p-3">
                            <item.icon size={14} className={`${item.color} mb-1`} />
                            <p className="text-[10px] text-gray-400 font-bold">{item.label}</p>
                            <p className="text-sm font-black text-gray-800 truncate">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Dates */}
                      {(selectedCrop.plantingDate || selectedCrop.harvestDate) && (
                        <div className="flex gap-3">
                          {selectedCrop.plantingDate && (
                            <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex-1">
                              <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Planted</p>
                              <p className="text-sm font-black text-gray-800 mt-0.5">
                                {new Date(selectedCrop.plantingDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {selectedCrop.harvestDate && (
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex-1">
                              <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Expected Harvest</p>
                              <p className="text-sm font-black text-gray-800 mt-0.5">
                                {new Date(selectedCrop.harvestDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="bg-red-50 w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">
              Delete Crop?
            </h3>
            <p className="text-sm text-gray-400 font-medium text-center mb-6">
              This action cannot be undone. The crop will be permanently removed from your farm.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-500 hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Crops;