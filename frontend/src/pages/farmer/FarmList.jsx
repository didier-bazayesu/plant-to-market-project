import { useState } from 'react';
import { useFarms } from '../../context/FarmContext';
import { useCrops } from '../../context/CropContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Plus, Layers, Sprout, Ruler,
  FlaskConical, ChevronRight, X,
  Droplets, Sun, ArrowRight, Trash2, Edit2,
  CheckCircle2
} from 'lucide-react';

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Sandy Loam', 'Silty', 'Peaty'];

const FarmList = () => {
  const { farms, addFarm, updateFarm, deleteFarm, loading } = useFarms();
  const { crops } = useCrops();
  const navigate = useNavigate();

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: '', district: '', location: '', size: '', soilType: '', irrigation: 'Manual'
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── STATS ────────────────────────────────────────────────
  const totalArea = farms.reduce((sum, f) => sum + Number(f.size || 0), 0);
  const activeFarms = farms.filter(f => f.status === 'Active').length;
  const totalCrops = crops.length;

  // ─── GET CROPS PER FARM ── using farm id (reliable) ──────
  const getCropCount = (farmId) =>
    crops.filter(c => c.farm_id === farmId).length;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ name: '', district: '', location: '', size: '', soilType: '', irrigation: 'Manual' });
    setFormError('');
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddFarm = async () => {
    if (!formData.name || !formData.district || !formData.size || !formData.soilType) {
      setFormError('Please fill in all required fields');
      return;
    }
    setAddLoading(true);
    setFormError('');
    try {
      await addFarm({
        name: formData.name,
        location: formData.location || formData.district,
        district: formData.district,
        size: parseFloat(formData.size),
        soilType: formData.soilType,
        irrigation: formData.irrigation,
      });
      resetForm();
      setShowAddPanel(false);
      showSuccess('Farm added successfully!');
    } catch (err) {
      setFormError(err.message || 'Failed to add farm');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditClick = (e, farm) => {
    e.stopPropagation();
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      district: farm.district || '',
      location: farm.location || '',
      size: farm.size.toString(),
      soilType: farm.soilType || '',
      irrigation: farm.irrigation || 'Manual'
    });
    setShowEditPanel(true);
  };

  const handleUpdateFarm = async () => {
    if (!formData.name || !formData.district || !formData.size || !formData.soilType) {
      setFormError('Please fill in all required fields');
      return;
    }
    setUpdateLoading(true);
    setFormError('');
    try {
      await updateFarm(editingFarm.id, {
        name: formData.name,
        location: formData.location || formData.district,
        district: formData.district,
        size: parseFloat(formData.size),
        soilType: formData.soilType,
        irrigation: formData.irrigation,
      });
      resetForm();
      setShowEditPanel(false);
      setEditingFarm(null);
      showSuccess('Farm updated successfully!');
    } catch (err) {
      setFormError(err.message || 'Failed to update farm');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteFarm = (e, id) => {
    e.stopPropagation();
    setConfirmDelete(id);
  };

  const confirmDeleteFarm = async () => {
    setDeleteLoading(true);
    try {
      await deleteFarm(confirmDelete);
      setConfirmDelete(null);
      showSuccess('Farm deleted successfully!');
    } catch (err) {
      setFormError(err.message || 'Failed to delete farm');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Farms</h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <MapPin size={14} className="text-green-600" />
              Rwanda • {farms.length} farm{farms.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <button
            onClick={() => setShowAddPanel(true)}
            className="bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:bg-green-700 transition-all flex items-center gap-2 font-black text-sm self-start md:self-auto"
          >
            <Plus size={18} /> Add Farm
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle2 size={18} className="text-green-600" />
            <p className="text-sm font-black text-green-700">{successMessage}</p>
          </div>
        )}

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Farms', value: farms.length, icon: Layers, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
            { label: 'Active Farms', value: activeFarms, icon: Sun, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
            { label: 'Total Area', value: `${totalArea} ha`, icon: Ruler, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
            { label: 'Total Crops', value: totalCrops, icon: Sprout, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
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

        {/* FARMS GRID */}
        {loading ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400">Loading farms...</p>
          </div>
        ) : farms.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-sm">
            <Layers size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="font-black text-gray-400 text-lg">No farms yet</p>
            <p className="text-sm text-gray-300 font-medium mt-1 mb-6">
              Add your first farm to get started
            </p>
            <button
              onClick={() => setShowAddPanel(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-700 transition-all inline-flex items-center gap-2"
            >
              <Plus size={16} /> Add Farm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <div
                key={farm.id}
                onClick={() => navigate(`/my-farms/${farm.id}`)}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* Farm image */}
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={farm.img || "https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=600"}
                    alt={farm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Status badge */}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                    farm.status === 'Active'
                      ? 'bg-green-50 text-green-600 border-green-100'
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    {farm.status}
                  </span>

                  {/* Action buttons container */}
                  <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Edit button */}
                    <button
                      onClick={(e) => handleEditClick(e, farm)}
                      className="bg-white/90 hover:bg-blue-50 p-2 rounded-xl transition-all hover:text-blue-600 text-gray-400"
                    >
                      <Edit2 size={14} />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteFarm(e, farm.id)}
                      className="bg-white/90 hover:bg-red-50 p-2 rounded-xl transition-all hover:text-red-500 text-gray-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Farm name overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-black text-white">{farm.name}</h3>
                    <p className="text-xs text-white/70 font-bold flex items-center gap-1">
                      <MapPin size={11} /> {farm.district || farm.location}
                    </p>
                  </div>
                </div>

                {/* Farm info */}
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-50 rounded-2xl p-3 text-center">
                      <p className="text-base font-black text-gray-900">{farm.size}</p>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">ha</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-3 text-center">
                      <p className="text-base font-black text-gray-900">{getCropCount(farm.id)}</p>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">Crops</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-3 text-center">
                      <p className="text-base font-black text-gray-900">{farm.crops?.length || 0}</p>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">Registered</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 font-bold">
                      <FlaskConical size={14} className="text-amber-500" />
                      {farm.soilType || '—'}
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 font-bold">
                      <Droplets size={14} className="text-blue-400" />
                      {farm.irrigation || 'Manual'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400 font-bold">
                      Added {new Date(farm.createdAt).toLocaleDateString()}
                    </span>
                    <button className="text-green-600 font-black text-sm flex items-center gap-1 hover:underline">
                      Enter Farm <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD FARM SLIDE-IN PANEL */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showAddPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => {
            setShowAddPanel(false);
            resetForm();
          }}
        />
        <div className={`
          fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem]
          md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[460px] md:rounded-none md:rounded-l-[2.5rem]
          transform transition-transform duration-500 ease-in-out
          ${showAddPanel ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>
          <div className="flex justify-center pt-4 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <Layers className="text-green-600" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Add New Farm</h2>
                <p className="text-sm text-gray-400 font-medium">Fill in your farm details</p>
              </div>
            </div>
            <button onClick={() => {
              setShowAddPanel(false);
              resetForm();
            }} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            {formError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">
                ⚠ {formError}
              </div>
            )}

            {/* Form fields (same as before) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Farm Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kagera Valley Farm"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">District *</label>
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

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Specific Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-300" size={16} />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kagera Sector, Musanze"
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Farm Size (hectares) *</label>
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

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Soil Type *</label>
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

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Irrigation Type</label>
              <div className="relative">
                <Droplets className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                <select
                  name="irrigation"
                  value={formData.irrigation}
                  onChange={handleChange}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm appearance-none cursor-pointer"
                >
                  {['Manual', 'Drip', 'Sprinkler', 'Flood', 'None'].map(i => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
                <ChevronRight size={16} className="absolute right-4 top-4 text-gray-300 rotate-90 pointer-events-none" />
              </div>
            </div>

            <div className="p-5 bg-green-50 rounded-3xl border border-green-100 flex gap-3">
              <Sprout className="text-green-600 shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-green-700 leading-relaxed font-medium">
                After adding your farm you can enter it to register crops and manage plots.
              </p>
            </div>
          </div>

          <div className="px-8 py-5 border-t border-gray-100">
            <button
              onClick={handleAddFarm}
              disabled={addLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-100"
            >
              {addLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Register Farm <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </>

      {/* EDIT FARM SLIDE-IN PANEL */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showEditPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => {
            setShowEditPanel(false);
            resetForm();
          }}
        />
        <div className={`
          fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem]
          md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[460px] md:rounded-none md:rounded-l-[2.5rem]
          transform transition-transform duration-500 ease-in-out
          ${showEditPanel ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>
          <div className="flex justify-center pt-4 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Edit2 className="text-blue-600" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Edit Farm</h2>
                <p className="text-sm text-gray-400 font-medium">{editingFarm?.name}</p>
              </div>
            </div>
            <button onClick={() => {
              setShowEditPanel(false);
              resetForm();
            }} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            {formError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">
                ⚠ {formError}
              </div>
            )}

            {/* Form fields (same as add panel) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Farm Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kagera Valley Farm"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">District *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm appearance-none cursor-pointer"
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

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Specific Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-300" size={16} />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kagera Sector, Musanze"
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Farm Size (hectares) *</label>
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
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Soil Type *</label>
              <div className="relative">
                <FlaskConical className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select soil type</option>
                  {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronRight size={16} className="absolute right-4 top-4 text-gray-300 rotate-90 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Irrigation Type</label>
              <div className="relative">
                <Droplets className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                <select
                  name="irrigation"
                  value={formData.irrigation}
                  onChange={handleChange}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm appearance-none cursor-pointer"
                >
                  {['Manual', 'Drip', 'Sprinkler', 'Flood', 'None'].map(i => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
                <ChevronRight size={16} className="absolute right-4 top-4 text-gray-300 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="px-8 py-5 border-t border-gray-100">
            <button
              onClick={handleUpdateFarm}
              disabled={updateLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              {updateLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Update Farm <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </>

      {/* CONFIRM DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="bg-red-50 w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Farm?</h3>
            <p className="text-sm text-gray-400 font-medium text-center mb-6">
              This will permanently remove the farm and all its crops. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-500 hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFarm}
                disabled={deleteLoading}
                className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-black text-sm transition-all"
              >
                {deleteLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmList;