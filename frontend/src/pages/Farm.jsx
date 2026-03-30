import { useState } from 'react';
import {
  MapPin, Ruler, Sprout, Plus, ArrowRight,
  Layers, Droplets, Sun, FlaskConical, X, ChevronRight, Map
} from 'lucide-react';
import { initialFarms } from '../helper/helpFunction';
import { RWANDA_DISTRICTS } from '../helper/helpFunction';



const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Sandy Loam', 'Silty', 'Peaty'];

// ─── MAIN COMPONENT ───────────────────────────────────────────
const Farm = () => {
  const [farms, setFarms] = useState(initialFarms);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [formData, setFormData] = useState({
    name: '', district: '', size: '', soilType: ''
  });
  const [formError, setFormError] = useState('');

  // Stats
  const totalArea = farms.reduce((sum, f) => sum + f.size, 0);
  const totalActiveCrops = farms.reduce((sum, f) => sum + f.activeCrops, 0);
  const activeFarms = farms.filter(f => f.status === 'Active').length;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddFarm = () => {
    if (!formData.name || !formData.district || !formData.size || !formData.soilType) {
      setFormError('Please fill in all fields');
      return;
    }
    const newFarm = {
      id: Date.now(),
      name: formData.name,
      location: formData.district,
      district: formData.district,
      size: parseFloat(formData.size),
      soilType: formData.soilType,
      status: 'Active',
      activeCrops: 0,
      img: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=600',
      plots: []
    };
    setFarms([...farms, newFarm]);
    setFormData({ name: '', district: '', size: '', soilType: '' });
    setFormError('');
    setShowPanel(false);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Farms</h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <MapPin size={14} className="text-green-600" /> Rwanda • {farms.length} farm{farms.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <button
            onClick={() => setShowPanel(true)}
            className="bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:bg-green-700 transition-all flex items-center gap-2 font-black text-sm self-start md:self-auto"
          >
            <Plus size={18} /> Add Farm
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Farms', value: farms.length, icon: Layers, color: 'bg-blue-50 text-blue-600' },
            { label: 'Active Farms', value: activeFarms, icon: Sun, color: 'bg-green-50 text-green-600' },
            { label: 'Total Area', value: `${totalArea} ha`, icon: Ruler, color: 'bg-amber-50 text-amber-600' },
            { label: 'Active Crops', value: totalActiveCrops, icon: Sprout, color: 'bg-purple-50 text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 font-bold mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* FARMS — mix of card grid + detail row */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Layers className="text-green-600" size={20} /> Farm List
          </h2>

          {/* CARD GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <div
                key={farm.id}
                onClick={() => setSelectedFarm(selectedFarm?.id === farm.id ? null : farm)}
                className={`bg-white rounded-[2rem] overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group ${selectedFarm?.id === farm.id ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-100'}`}
              >
                {/* Farm image */}
                <div className="h-40 overflow-hidden relative">
                  <img src={farm.img} alt={farm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <StatusBadge status={farm.status} />
                </div>

                {/* Farm info */}
                <div className="p-5">
                  <h3 className="text-lg font-black text-gray-900 mb-1">{farm.name}</h3>
                  <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mb-4">
                    <MapPin size={12} className="text-green-500" /> {farm.district}
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-2xl p-3 text-center">
                      <p className="text-sm font-black text-gray-900">{farm.size} ha</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">Size</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-3 text-center">
                      <p className="text-sm font-black text-gray-900">{farm.activeCrops}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">Crops</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-3 text-center">
                      <p className="text-sm font-black text-gray-900">{farm.soilType}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">Soil</p>
                    </div>
                  </div>

                  <button className="mt-4 w-full text-green-600 font-black text-xs flex items-center justify-center gap-1 hover:underline">
                    {selectedFarm?.id === farm.id ? 'Hide Details' : 'View Details'} <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DETAIL ROW — plots list for selected farm */}
          {selectedFarm && (
            <div className="bg-white rounded-[2rem] border border-green-100 shadow-sm p-6 md:p-8 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{selectedFarm.name} — Plots</h3>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    {selectedFarm.plots.length} plot{selectedFarm.plots.length !== 1 ? 's' : ''} · {selectedFarm.size} ha total · {selectedFarm.soilType} soil
                  </p>
                </div>

                {/* Fake map placeholder */}
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                  <Map size={16} className="text-blue-500" />
                  <div>
                    <p className="text-xs font-black text-blue-800">{selectedFarm.district}, Rwanda</p>
                    <p className="text-[10px] text-blue-400 font-bold">Satellite view coming Phase 3</p>
                  </div>
                </div>
              </div>

              {selectedFarm.plots.length === 0 ? (
                <div className="text-center py-10 text-gray-300">
                  <Layers size={40} className="mx-auto mb-3" />
                  <p className="font-bold text-sm">No plots added yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Plot', 'Size', 'Current Crop', 'Status'].map(h => (
                          <th key={h} className="text-left text-[10px] font-black uppercase text-gray-400 tracking-widest pb-3 pr-6">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedFarm.plots.map((plot) => (
                        <tr key={plot.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 pr-6 font-black text-gray-900">{plot.name}</td>
                          <td className="py-4 pr-6 text-gray-500 font-bold">{plot.size} ha</td>
                          <td className="py-4 pr-6">
                            <div className="flex items-center gap-2">
                              <Sprout size={14} className="text-green-500" />
                              <span className="font-bold text-gray-700">{plot.crop}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <PlotBadge status={plot.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Farm soil & water info */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: FlaskConical, label: 'Soil Type', value: selectedFarm.soilType, color: 'text-amber-500' },
                  { icon: Ruler, label: 'Total Area', value: `${selectedFarm.size} ha`, color: 'text-blue-500' },
                  { icon: Sprout, label: 'Active Crops', value: selectedFarm.activeCrops, color: 'text-green-500' },
                  { icon: Droplets, label: 'Irrigation', value: 'Manual', color: 'text-cyan-500' },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                    <item.icon size={16} className={item.color} />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold">{item.label}</p>
                      <p className="text-sm font-black text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SLIDE-IN PANEL — Add Farm */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setShowPanel(false)}
        />
        <div className={`
          fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem]
          md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[460px] md:rounded-none md:rounded-l-[2.5rem]
          transform transition-transform duration-500 ease-in-out
          ${showPanel ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>

          {/* Drag handle mobile */}
          <div className="flex justify-center pt-4 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <Layers className="text-green-600" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Add New Farm</h2>
                <p className="text-xs text-gray-400 font-medium">Fill in your farm details</p>
              </div>
            </div>
            <button onClick={() => setShowPanel(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            {formError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
                ⚠ {formError}
              </div>
            )}

            {/* Farm Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Farm Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kagera Valley Farm"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
              />
            </div>

            {/* District */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">District</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select district</option>
                  <optgroup label="── Kigali City">
                    {['Gasabo', 'Kicukiro', 'Nyarugenge'].map(d => <option key={d}>{d}</option>)}
                  </optgroup>
                  <optgroup label="── Northern Province">
                    {['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'].map(d => <option key={d}>{d}</option>)}
                  </optgroup>
                  <optgroup label="── Southern Province">
                    {['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'].map(d => <option key={d}>{d}</option>)}
                  </optgroup>
                  <optgroup label="── Eastern Province">
                    {['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'].map(d => <option key={d}>{d}</option>)}
                  </optgroup>
                  <optgroup label="── Western Province">
                    {['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rutsiro', 'Rusizi'].map(d => <option key={d}>{d}</option>)}
                  </optgroup>
                </select>
                <ChevronRight size={16} className="absolute right-4 top-4 text-gray-300 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Farm Size (hectares)</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-4 text-gray-300" size={16} />
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="e.g. 2.5"
                  min="0"
                  step="0.1"
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            {/* Soil Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Soil Type</label>
              <div className="relative">
                <FlaskConical className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select soil type</option>
                  {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronRight size={16} className="absolute right-4 top-4 text-gray-300 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Info card */}
            <div className="p-5 bg-green-50 rounded-3xl border border-green-100 flex gap-3">
              <Sprout className="text-green-600 shrink-0 mt-0.5" size={16} />
              <p className="text-[11px] text-green-700 leading-relaxed font-medium">
                After adding your farm you can register plots and crops from the Activities page.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100">
            <button
              onClick={handleAddFarm}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-100"
            >
              Register Farm <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

// ─── BADGES ───────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
    status === 'Active'
      ? 'bg-green-50 text-green-600 border-green-100'
      : 'bg-gray-100 text-gray-400 border-gray-200'
  }`}>
    {status}
  </span>
);

const PlotBadge = ({ status }) => {
  const styles = {
    Growing:    'bg-green-50 text-green-600 border-green-100',
    Harvesting: 'bg-amber-50 text-amber-600 border-amber-100',
    Planting:   'bg-blue-50 text-blue-600 border-blue-100',
    Idle:       'bg-gray-50 text-gray-400 border-gray-100',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.Idle}`}>
      {status}
    </span>
  );
};

export default Farm;