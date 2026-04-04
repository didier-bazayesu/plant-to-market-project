import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFarms } from '../../context/FarmContext';
import { useCrops } from '../../context/CropContext';
import {
  MapPin, Sprout, Ruler, FlaskConical,
  Droplets, Plus, ArrowRight, ChevronRight,
  ArrowLeft, Layers, X, Calendar,
  AlertTriangle, CheckCircle2, Clock,
  TrendingUp, Trash2, Image
} from 'lucide-react';
import FarmWeatherSummary from '../../components/FarmWeatherSummary';

const STEPS = ['Crop Info', 'Location & Size', 'Schedule'];

const FarmDetail = () => {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { getFarm, addPlot, deleteFarm } = useFarms();
  const { crops, addCrop, deleteCrop } = useCrops();

  const farm = getFarm(farmId);

  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showAddPlot, setShowAddPlot] = useState(false);
  const [confirmDeleteFarm, setConfirmDeleteFarm] = useState(false);
  const [confirmDeleteCrop, setConfirmDeleteCrop] = useState(null);
  const [activeTab, setActiveTab] = useState('crops'); // crops | plots | info

  // ─── REGISTER CROP FORM ───────────────────────────────────
  const [step, setStep] = useState(0);
  const [cropForm, setCropForm] = useState({
    name: '', variety: '', size: '',
    plantingDate: '', harvestDate: '',
    img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400'
  });
  const [cropFormError, setCropFormError] = useState('');

  // ─── ADD PLOT FORM ────────────────────────────────────────
  const [plotForm, setPlotForm] = useState({ name: '', size: '', status: 'Idle' });

  // ─── FARM CROPS ───────────────────────────────────────────
  const farmCrops = crops.filter(c => c.farm === farm?.name);

  // ─── STATS ────────────────────────────────────────────────
  const healthyCrops = farmCrops.filter(c => c.health === 'Healthy').length;
  const atRiskCrops = farmCrops.filter(c => c.health === 'At Risk').length;
  const readyToHarvest = farmCrops.filter(c => c.progress >= 80).length;

  // In the info tab or as a new "Weather" tab:
  {activeTab === 'weather' && (
    <FarmWeatherSummary
      district={farm.district || farm.location}
      crops={farmCrops}
    />
  )}
     // Add 'weather' to tabs:
// {['crops', 'plots', 'info', 'weather'].map(tab => (
//   <button key={tab} ...>{tab} </button>
// ))}
    
   

  if (!farm) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Layers size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="font-black text-gray-400 text-lg">Farm not found</p>
          <button
            onClick={() => navigate('/my-farms')}
            className="mt-4 text-green-600 font-black text-sm hover:underline flex items-center gap-1 mx-auto"
          >
            <ArrowLeft size={14} /> Back to Farms
          </button>
        </div>
      </div>
    );
  }

  // ─── CROP FORM HANDLERS ───────────────────────────────────
  const handleCropChange = (e) =>
    setCropForm({ ...cropForm, [e.target.name]: e.target.value });

  const cropNextDisabled =
    (step === 0 && (!cropForm.name || !cropForm.variety)) ||
    (step === 1 && !cropForm.size) ||
    (step === 2 && (!cropForm.plantingDate || !cropForm.harvestDate));

    const handleAddCrop = () => {
      addCrop({
        ...cropForm,
        farm: farm.name,
        location: farm.district,
        size: cropForm.size,
        farmId: farm.id,  // ✅ this is the only line added
    });
    setCropForm({
      name: '', variety: '', size: '',
      plantingDate: '', harvestDate: '',
      img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400'
    });
    setStep(0);
    setShowAddCrop(false);
  };

  // ─── PLOT FORM HANDLERS ───────────────────────────────────
  const handleAddPlot = () => {
    if (!plotForm.name || !plotForm.size) return;
    addPlot(farm.id, { ...plotForm, size: parseFloat(plotForm.size) });
    setPlotForm({ name: '', size: '', status: 'Idle' });
    setShowAddPlot(false);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/my-farms')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {farm.name}
              </h1>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <MapPin size={14} className="text-green-600" />
                {farm.location || farm.district}, Rwanda
              </p>
            </div>
          </div>
            

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddPlot(true)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 font-black text-sm"
            >
              <Layers size={16} /> Add Plot
            </button>
            <button
              onClick={() => setShowAddCrop(true)}
              className="bg-green-600 text-white px-4 py-2.5 rounded-2xl shadow-lg hover:bg-green-700 transition-all flex items-center gap-2 font-black text-sm"
            >
              <Plus size={16} /> Add Crop
            </button>
            <button
              onClick={() => setConfirmDeleteFarm(true)}
              className="bg-red-50 text-red-500 p-2.5 rounded-2xl hover:bg-red-100 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

        {/* FARM HERO */}
        <div className="relative h-52 md:h-64 rounded-[2rem] overflow-hidden shadow-xl">
          <img
            src={farm.img}
            alt={farm.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black text-white">{farm.name}</h2>
              <p className="text-white/70 text-sm font-bold flex items-center gap-1 mt-1">
                <MapPin size={13} /> {farm.district}, Rwanda
              </p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${
              farm.status === 'Active'
                ? 'bg-green-50 text-green-600 border-green-100'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}>
              {farm.status}
            </span>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Crops', value: farmCrops.length, icon: Sprout, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
            { label: 'Healthy', value: healthyCrops, icon: CheckCircle2, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
            { label: 'At Risk', value: atRiskCrops, icon: AlertTriangle, color: 'bg-red-50 text-red-500', border: 'border-red-100' },
            { label: 'Ready to Harvest', value: readyToHarvest, icon: TrendingUp, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white rounded-3xl p-5 border shadow-sm ${stat.border}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-400 font-bold mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
          {['crops', 'plots', 'info'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black capitalize transition-all ${
                activeTab === tab
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── CROPS TAB ── */}
        {activeTab === 'crops' && (
          <div className="space-y-4">
            {farmCrops.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-14 text-center border border-gray-100 shadow-sm">
                <Sprout size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-black text-gray-400 text-lg">No crops on this farm yet</p>
                <p className="text-sm text-gray-300 font-medium mt-1 mb-6">
                  Add your first crop to start tracking
                </p>
                <button
                  onClick={() => setShowAddCrop(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-700 transition-all inline-flex items-center gap-2"
                >
                  <Plus size={16} /> Add Crop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {farmCrops.map((crop) => (
                  <div
                    key={crop.id}
                    className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    {/* Image */}
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={crop.img}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Health badge */}
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black uppercase border ${
                        crop.health === 'Healthy'
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : 'bg-red-50 text-red-500 border-red-100 animate-pulse'
                      }`}>
                        {crop.health}
                      </span>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteCrop(crop.id);
                        }}
                        className="absolute top-3 left-3 bg-white/90 hover:bg-red-50 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 text-gray-400"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Progress */}
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-white/20 rounded-full">
                          <div
                            className="h-full rounded-full bg-green-400"
                            style={{ width: `${crop.progress}%` }}
                          />
                        </div>
                        <span className="text-white text-xs font-black">{crop.progress}%</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-base font-black text-gray-900">{crop.name}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-3">
                        {crop.variety}
                      </p>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <div className="flex items-center gap-1 text-gray-400 font-bold">
                          <Droplets size={12} className="text-blue-400" />
                          {crop.lastWatered}
                        </div>
                        {crop.size && (
                          <div className="flex items-center gap-1 text-gray-400 font-bold">
                            <Ruler size={12} className="text-amber-400" />
                            {crop.size} ha
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/my-farms/${farm.id}/crops/${crop.id}`)}
                        className="w-full text-green-600 font-black text-xs flex items-center justify-center gap-1 hover:underline pt-2 border-t border-gray-50"
                      >
                        View Full Details <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PLOTS TAB ── */}
        {activeTab === 'plots' && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Layers className="text-green-600" size={20} />
                Plots — {farm.plots.length} total
              </h3>
              <button
                onClick={() => setShowAddPlot(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-xs hover:bg-green-700 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Plot
              </button>
            </div>

            {farm.plots.length === 0 ? (
              <div className="p-14 text-center">
                <Layers size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="font-black text-gray-400">No plots yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50">
                      {['Plot Name', 'Size', 'Status'].map(h => (
                        <th key={h} className="text-left text-xs font-black uppercase text-gray-400 tracking-widest px-6 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {farm.plots.map((plot) => (
                      <tr key={plot.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-black text-gray-900">{plot.name}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-500">{plot.size} ha</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                            plot.status === 'Growing' ? 'bg-green-50 text-green-600 border-green-100' :
                            plot.status === 'Harvesting' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            plot.status === 'Planting' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-gray-50 text-gray-400 border-gray-200'
                          }`}>
                            {plot.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── INFO TAB ── */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6">Farm Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: 'District', value: farm.district, color: 'text-green-500' },
                { icon: MapPin, label: 'Location', value: farm.location || '—', color: 'text-blue-500' },
                { icon: Ruler, label: 'Total Size', value: `${farm.size} hectares`, color: 'text-amber-500' },
                { icon: FlaskConical, label: 'Soil Type', value: farm.soilType, color: 'text-purple-500' },
                { icon: Droplets, label: 'Irrigation', value: farm.irrigation, color: 'text-cyan-500' },
                { icon: Layers, label: 'Total Plots', value: farm.plots.length, color: 'text-pink-500' },
                { icon: Sprout, label: 'Total Crops', value: farmCrops.length, color: 'text-green-600' },
                { icon: Calendar, label: 'Added On', value: new Date(farm.createdAt).toLocaleDateString(), color: 'text-gray-400' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <item.icon size={18} className={item.color} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-base font-black text-gray-800 mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── ADD CROP PANEL ── */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showAddCrop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => { setShowAddCrop(false); setStep(0); }}
        />
        <div className={`
          fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem]
          md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[480px] md:rounded-none md:rounded-l-[2.5rem]
          transform transition-transform duration-500 ease-in-out
          ${showAddCrop ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>
          {/* Drag handle */}
          <div className="flex justify-center pt-4 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-8 pt-6 pb-5 border-b border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-xl">
                  <Sprout className="text-green-600" size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">Add Crop</h2>
                  <p className="text-sm text-gray-400 font-medium">
                    to {farm.name} • Step {step + 1} of {STEPS.length}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowAddCrop(false); setStep(0); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step progress */}
            <div className="flex gap-2">
              {STEPS.map((label, i) => (
                <div key={i} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-green-500' : 'bg-gray-100'}`} />
                  <p className={`text-xs font-black uppercase mt-1.5 tracking-wider ${i === step ? 'text-green-600' : 'text-gray-300'}`}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto px-8 py-6">

            {/* STEP 1 */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Crop Type</label>
                  <input
                    name="name"
                    value={cropForm.name}
                    onChange={handleCropChange}
                    placeholder="e.g. Maize"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Variety</label>
                  <input
                    name="variety"
                    value={cropForm.variety}
                    onChange={handleCropChange}
                    placeholder="e.g. Hybrid H624"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Crop Photo</label>
                  <div className="relative h-36 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer">
                    <img src={cropForm.img} alt="crop" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-bold text-gray-700">
                        <Image size={14} /> Change Photo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Field Size (hectares)</label>
                  <div className="relative">
                    <Ruler className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      type="number"
                      name="size"
                      value={cropForm.size}
                      onChange={handleCropChange}
                      placeholder="e.g. 1.5"
                      min="0"
                      step="0.1"
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Farm info card */}
                <div className="p-5 bg-green-50 rounded-3xl border border-green-100 space-y-2">
                  <p className="text-xs font-black uppercase text-green-600 tracking-widest">Farm Details</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400 font-bold text-xs">Farm</p>
                      <p className="font-black text-gray-800">{farm.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold text-xs">District</p>
                      <p className="font-black text-gray-800">{farm.district}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold text-xs">Soil</p>
                      <p className="font-black text-gray-800">{farm.soilType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold text-xs">Irrigation</p>
                      <p className="font-black text-gray-800">{farm.irrigation}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Planting Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      type="date"
                      name="plantingDate"
                      value={cropForm.plantingDate}
                      onChange={handleCropChange}
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Expected Harvest Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      type="date"
                      name="harvestDate"
                      value={cropForm.harvestDate}
                      onChange={handleCropChange}
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                  <p className="text-xs font-black uppercase text-gray-500 tracking-widest">Summary</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-gray-400 font-bold text-xs">Crop</p><p className="font-black text-gray-800">{cropForm.name || '—'}</p></div>
                    <div><p className="text-gray-400 font-bold text-xs">Variety</p><p className="font-black text-gray-800">{cropForm.variety || '—'}</p></div>
                    <div><p className="text-gray-400 font-bold text-xs">Size</p><p className="font-black text-gray-800">{cropForm.size ? `${cropForm.size} ha` : '—'}</p></div>
                    <div><p className="text-gray-400 font-bold text-xs">Farm</p><p className="font-black text-gray-800">{farm.name}</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-500 hover:bg-gray-50 transition-all text-sm"
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={cropNextDisabled}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddCrop}
                disabled={cropNextDisabled}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                Add Crop <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </>

      {/* ── ADD PLOT PANEL ── */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showAddPlot ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setShowAddPlot(false)}
        />
        <div className={`
          fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 top-[40%] rounded-t-[2.5rem]
          md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[420px] md:rounded-none md:rounded-l-[2.5rem]
          transform transition-transform duration-500 ease-in-out
          ${showAddPlot ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>
          <div className="flex justify-center pt-4 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl">
                <Layers className="text-blue-600" size={18} />
              </div>
              <h2 className="text-lg font-black text-gray-900">Add Plot</h2>
            </div>
            <button onClick={() => setShowAddPlot(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 px-8 py-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Plot Name</label>
              <input
                value={plotForm.name}
                onChange={e => setPlotForm({ ...plotForm, name: e.target.value })}
                placeholder="e.g. Plot A"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Size (hectares)</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-4 text-gray-300" size={16} />
                <input
                  type="number"
                  value={plotForm.size}
                  onChange={e => setPlotForm({ ...plotForm, size: e.target.value })}
                  placeholder="e.g. 1.5"
                  min="0"
                  step="0.1"
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Status</label>
              <select
                value={plotForm.status}
                onChange={e => setPlotForm({ ...plotForm, status: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm appearance-none"
              >
                {['Idle', 'Planting', 'Growing', 'Harvesting'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-8 py-5 border-t border-gray-100">
            <button
              onClick={handleAddPlot}
              disabled={!plotForm.name || !plotForm.size}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl transition-all text-sm"
            >
              Add Plot
            </button>
          </div>
        </div>
      </>

      {/* DELETE FARM MODAL */}
      {confirmDeleteFarm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="bg-red-50 w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Farm?</h3>
            <p className="text-sm text-gray-400 font-medium text-center mb-6">
              This will permanently remove <span className="font-black text-gray-700">{farm.name}</span> and all its plots. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteFarm(false)}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-500 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteFarm(farm.id);
                  navigate('/my-farms');
                }}
                className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CROP MODAL */}
      {confirmDeleteCrop && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="bg-red-50 w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Crop?</h3>
            <p className="text-sm text-gray-400 font-medium text-center mb-6">
              This crop will be permanently removed from {farm.name}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteCrop(null)}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-500 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCrop(confirmDeleteCrop);
                  setConfirmDeleteCrop(null);
                }}
                className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-sm"
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

export default FarmDetail;