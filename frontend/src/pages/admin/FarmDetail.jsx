import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, Sprout, MapPin, Ruler, FlaskConical,
  Edit2, Trash2, X, ChevronRight, Plus,
  CheckCircle2, Calendar, Layers
} from 'lucide-react';

const CROP_STATUSES = ['planted', 'growing', 'harvested'];

const AdminFarmDetail = () => {
  const { id: userId, farmId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // ─── ADD CROP STATE ───────────────────────────────────────
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [addCropForm, setAddCropForm] = useState({ cropType: '', variety: '', plantingDate: '', harvestDate: '', status: 'planted' });
  const [addCropLoading, setAddCropLoading] = useState(false);

  // ─── EDIT CROP STATE ──────────────────────────────────────
  const [editCrop, setEditCrop] = useState(null);
  const [editCropForm, setEditCropForm] = useState({});
  const [editCropLoading, setEditCropLoading] = useState(false);

  // ─── DELETE STATE ─────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchFarm(); }, [farmId]);

  const fetchFarm = async () => {
    try {
      const res = await fetch(`/api/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFarm(data.farm);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ─── ADD CROP ─────────────────────────────────────────────
  const handleAddCrop = async () => {
    if (!addCropForm.cropType || !addCropForm.plantingDate) return;
    setAddCropLoading(true);
    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...addCropForm, farmId: Number(farmId) })
      });
      if (res.ok) {
        await fetchFarm();
        setShowAddCrop(false);
        setAddCropForm({ cropType: '', variety: '', plantingDate: '', harvestDate: '', status: 'planted' });
        showSuccess('Crop added successfully');
      }
    } catch (err) { console.error(err); }
    finally { setAddCropLoading(false); }
  };

  // ─── UPDATE CROP ──────────────────────────────────────────
  const handleUpdateCrop = async () => {
    setEditCropLoading(true);
    try {
      const res = await fetch(`/api/crops/${editCrop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editCropForm)
      });
      if (res.ok) {
        await fetchFarm();
        setEditCrop(null);
        showSuccess('Crop updated successfully');
      }
    } catch (err) { console.error(err); }
    finally { setEditCropLoading(false); }
  };

  // ─── DELETE CROP ──────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/crops/${confirmDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchFarm();
        setConfirmDelete(null);
        showSuccess('Crop deleted successfully');
      }
    } catch (err) { console.error(err); }
    finally { setDeleteLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!farm) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <p className="font-black text-gray-400">Farm not found</p>
    </div>
  );

  const crops = farm.crops || [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/admin/farmers/${userId}`)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{farm.name}</h1>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <MapPin size={13} className="text-green-600" /> {farm.location} • {farm.size} ha
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddCrop(true)}
            className="bg-green-600 text-white px-4 py-2.5 rounded-2xl font-black text-sm hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Add Crop
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

        {/* SUCCESS */}
        {successMsg && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-green-600" />
            <p className="text-sm font-black text-green-700">{successMsg}</p>
          </div>
        )}

        {/* FARM INFO */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Ruler, label: 'Size', value: `${farm.size} ha`, color: 'text-amber-500' },
              { icon: MapPin, label: 'Location', value: farm.location || '—', color: 'text-green-500' },
              { icon: FlaskConical, label: 'Soil Type', value: farm.soilType || '—', color: 'text-purple-500' },
              { icon: Sprout, label: 'Total Crops', value: crops.length, color: 'text-blue-500' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                <item.icon size={16} className={item.color} />
                <div>
                  <p className="text-xs text-gray-400 font-bold">{item.label}</p>
                  <p className="text-sm font-black text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CROPS LIST */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Sprout className="text-green-600" size={20} /> Crops ({crops.length})
          </h2>

          {crops.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-14 text-center border border-gray-100">
              <Sprout size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="font-black text-gray-400">No crops registered</p>
              <button onClick={() => setShowAddCrop(true)} className="mt-4 bg-green-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm hover:bg-green-700 transition-all inline-flex items-center gap-2">
                <Plus size={14} /> Add First Crop
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50">
                    {['Crop', 'Variety', 'Status', 'Planting Date', 'Harvest Date', 'Activities', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-black uppercase text-gray-400 tracking-widest px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {crops.map(crop => (
                    <tr key={crop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Sprout size={15} className="text-green-500" />
                          <span className="font-black text-gray-900 text-sm">{crop.cropType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-500">{crop.variety || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                          crop.status === 'growing' ? 'bg-green-50 text-green-600' :
                          crop.status === 'planted' ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {crop.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-500">
                        {crop.plantingDate ? new Date(crop.plantingDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-500">
                        {crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-gray-900">
                        {crop.activities?.length || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/farmers/${userId}/farms/${farmId}/crops/${crop.id}`)}
                            className="p-1.5 hover:bg-green-50 rounded-xl text-gray-400 hover:text-green-600"
                            title="View activities"
                          >
                            <Sprout size={15} />
                          </button>
                          <button
                            onClick={() => { setEditCrop(crop); setEditCropForm({ cropType: crop.cropType, variety: crop.variety || '', plantingDate: crop.plantingDate?.split('T')[0] || '', harvestDate: crop.harvestDate?.split('T')[0] || '', status: crop.status }); }}
                            className="p-1.5 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ id: crop.id, name: crop.cropType })}
                            className="p-1.5 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD CROP PANEL */}
      <>
        <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showAddCrop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowAddCrop(false)} />
        <div className={`fixed z-50 bg-white shadow-2xl flex flex-col inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem] md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[460px] md:rounded-none md:rounded-l-[2.5rem] transform transition-transform duration-500 ease-in-out ${showAddCrop ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}`}>
          <div className="flex justify-center pt-4 pb-1 md:hidden"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-xl"><Plus className="text-green-600" size={18} /></div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Add Crop</h2>
                <p className="text-sm text-gray-400">{farm.name}</p>
              </div>
            </div>
            <button onClick={() => setShowAddCrop(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Crop Type</label>
              <input value={addCropForm.cropType} onChange={e => setAddCropForm({ ...addCropForm, cropType: e.target.value })}
                placeholder="e.g. Maize" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Variety (optional)</label>
              <input value={addCropForm.variety} onChange={e => setAddCropForm({ ...addCropForm, variety: e.target.value })}
                placeholder="e.g. Hybrid H624" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Planting Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                <input type="date" value={addCropForm.plantingDate} onChange={e => setAddCropForm({ ...addCropForm, plantingDate: e.target.value })}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Expected Harvest Date (optional)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                <input type="date" value={addCropForm.harvestDate} onChange={e => setAddCropForm({ ...addCropForm, harvestDate: e.target.value })}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {CROP_STATUSES.map(s => (
                  <button key={s} onClick={() => setAddCropForm({ ...addCropForm, status: s })}
                    className={`py-3 rounded-2xl text-xs font-black capitalize transition-all border ${addCropForm.status === s ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-100'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-8 py-5 border-t border-gray-100">
            <button onClick={handleAddCrop} disabled={addCropLoading || !addCropForm.cropType || !addCropForm.plantingDate}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2">
              {addCropLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Add Crop <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      </>

      {/* EDIT CROP PANEL */}
      <>
        <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${editCrop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setEditCrop(null)} />
        <div className={`fixed z-50 bg-white shadow-2xl flex flex-col inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem] md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[460px] md:rounded-none md:rounded-l-[2.5rem] transform transition-transform duration-500 ease-in-out ${editCrop ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}`}>
          <div className="flex justify-center pt-4 pb-1 md:hidden"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl"><Edit2 className="text-blue-600" size={18} /></div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Edit Crop</h2>
                <p className="text-sm text-gray-400">{editCrop?.cropType}</p>
              </div>
            </div>
            <button onClick={() => setEditCrop(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Crop Type</label>
              <input value={editCropForm.cropType || ''} onChange={e => setEditCropForm({ ...editCropForm, cropType: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Variety</label>
              <input value={editCropForm.variety || ''} onChange={e => setEditCropForm({ ...editCropForm, variety: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Planting Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                <input type="date" value={editCropForm.plantingDate || ''} onChange={e => setEditCropForm({ ...editCropForm, plantingDate: e.target.value })}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Harvest Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                <input type="date" value={editCropForm.harvestDate || ''} onChange={e => setEditCropForm({ ...editCropForm, harvestDate: e.target.value })}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {CROP_STATUSES.map(s => (
                  <button key={s} onClick={() => setEditCropForm({ ...editCropForm, status: s })}
                    className={`py-3 rounded-2xl text-xs font-black capitalize transition-all border ${editCropForm.status === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-100'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-8 py-5 border-t border-gray-100">
            <button onClick={handleUpdateCrop} disabled={editCropLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2">
              {editCropLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Save Changes <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      </>

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="bg-red-50 w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete {confirmDelete.name}?</h3>
            <p className="text-sm text-gray-400 font-medium text-center mb-6">
              This will permanently delete the crop and all its activities.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-500 text-sm">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-black text-sm">
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFarmDetail;