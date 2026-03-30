import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, Sprout, Droplets, Leaf, Shield,
  Edit2, Trash2, X, ChevronRight, Plus,
  CheckCircle2, Calendar, Activity
} from 'lucide-react';

const ACTIVITY_TYPES = ['irrigation', 'fertilization', 'pesticide'];

const getActivityStyle = (type) => {
  switch (type) {
    case 'irrigation': return { color: 'bg-blue-50 text-blue-500' };
    case 'fertilization': return { color: 'bg-green-50 text-green-500' };
    case 'pesticide': return { color: 'bg-purple-50 text-purple-500' };
    default: return { color: 'bg-gray-50 text-gray-500' };
  }
};

const AdminCropDetail = () => {
  const { id: userId, farmId, cropId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // ─── ADD ACTIVITY STATE ───────────────────────────────────
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ type: 'irrigation', date: new Date().toISOString().split('T')[0], notes: '' });
  const [addLoading, setAddLoading] = useState(false);

  // ─── EDIT ACTIVITY STATE ──────────────────────────────────
  const [editActivity, setEditActivity] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // ─── DELETE STATE ─────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchCrop(); }, [cropId]);

  const fetchCrop = async () => {
    try {
      const [cropRes, actRes] = await Promise.all([
        fetch(`/api/crops/${cropId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/activities?cropId=${cropId}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const cropData = await cropRes.json();
      const actData = await actRes.json();
      setCrop(cropData.crop);
      setActivities(actData.activities || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ─── ADD ACTIVITY ─────────────────────────────────────────
  const handleAdd = async () => {
    if (!addForm.notes) return;
    setAddLoading(true);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...addForm, cropId: Number(cropId) })
      });
      if (res.ok) {
        await fetchCrop();
        setShowAdd(false);
        setAddForm({ type: 'irrigation', date: new Date().toISOString().split('T')[0], notes: '' });
        showSuccess('Activity logged successfully');
      }
    } catch (err) { console.error(err); }
    finally { setAddLoading(false); }
  };

  // ─── UPDATE ACTIVITY ──────────────────────────────────────
  const handleUpdate = async () => {
    setEditLoading(true);
    try {
      const res = await fetch(`/api/activities/${editActivity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        await fetchCrop();
        setEditActivity(null);
        showSuccess('Activity updated successfully');
      }
    } catch (err) { console.error(err); }
    finally { setEditLoading(false); }
  };

  // ─── DELETE ACTIVITY ──────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/activities/${confirmDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchCrop();
        setConfirmDelete(null);
        showSuccess('Activity deleted successfully');
      }
    } catch (err) { console.error(err); }
    finally { setDeleteLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!crop) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <p className="font-black text-gray-400">Crop not found</p>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/admin/farmers/${userId}/farms/${farmId}`)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{crop.cropType}</h1>
              <p className="text-sm text-gray-500 font-medium">
                {crop.variety || 'No variety'} •
                <span className={`ml-1 font-black ${crop.status === 'growing' ? 'text-green-600' : crop.status === 'planted' ? 'text-blue-600' : 'text-amber-600'}`}>
                  {crop.status}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-green-600 text-white px-4 py-2.5 rounded-2xl font-black text-sm hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={16} /> Log Activity
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

        {/* CROP INFO */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Crop Type', value: crop.cropType, color: 'text-green-500' },
              { label: 'Variety', value: crop.variety || '—', color: 'text-blue-500' },
              { label: 'Planting Date', value: crop.plantingDate ? new Date(crop.plantingDate).toLocaleDateString() : '—', color: 'text-amber-500' },
              { label: 'Harvest Date', value: crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString() : '—', color: 'text-purple-500' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 font-bold mb-1">{item.label}</p>
                <p className={`text-sm font-black ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITIES */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="text-green-600" size={20} /> Activities ({activities.length})
          </h2>

          {activities.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-14 text-center border border-gray-100">
              <Activity size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="font-black text-gray-400">No activities logged</p>
              <button onClick={() => setShowAdd(true)} className="mt-4 bg-green-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm hover:bg-green-700 inline-flex items-center gap-2">
                <Plus size={14} /> Log First Activity
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {activities.map(activity => {
                  const { color } = getActivityStyle(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                        <Activity size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-gray-900 capitalize">{activity.type}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{activity.notes || '—'}</p>
                      </div>
                      <span className="text-xs text-gray-400 font-bold shrink-0">
                        {activity.date ? new Date(activity.date).toLocaleDateString() : '—'}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => { setEditActivity(activity); setEditForm({ type: activity.type, date: activity.date?.split('T')[0] || '', notes: activity.notes || '' }); }}
                          className="p-1.5 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(activity.id)}
                          className="p-1.5 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD ACTIVITY PANEL */}
      <>
        <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showAdd ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowAdd(false)} />
        <div className={`fixed z-50 bg-white shadow-2xl flex flex-col inset-x-0 bottom-0 top-[30%] rounded-t-[2.5rem] md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[440px] md:rounded-none md:rounded-l-[2.5rem] transform transition-transform duration-500 ease-in-out ${showAdd ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}`}>
          <div className="flex justify-center pt-4 pb-1 md:hidden"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-xl"><Activity className="text-green-600" size={18} /></div>
              <h2 className="text-lg font-black text-gray-900">Log Activity</h2>
            </div>
            <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Activity Type</label>
              <div className="grid grid-cols-3 gap-2">
                {ACTIVITY_TYPES.map(type => (
                  <button key={type} onClick={() => setAddForm({ ...addForm, type })}
                    className={`py-3 rounded-2xl text-xs font-black capitalize transition-all border ${addForm.type === type ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-100'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                <input type="date" value={addForm.date} onChange={e => setAddForm({ ...addForm, date: e.target.value })}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Notes</label>
              <textarea value={addForm.notes} onChange={e => setAddForm({ ...addForm, notes: e.target.value })}
                placeholder="Describe what was done..." rows={3}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm resize-none" />
            </div>
          </div>
          <div className="px-8 py-5 border-t border-gray-100">
            <button onClick={handleAdd} disabled={addLoading || !addForm.notes}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2">
              {addLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Log Activity <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      </>

      {/* EDIT ACTIVITY PANEL */}
      <>
        <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${editActivity ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setEditActivity(null)} />
        <div className={`fixed z-50 bg-white shadow-2xl flex flex-col inset-x-0 bottom-0 top-[30%] rounded-t-[2.5rem] md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[440px] md:rounded-none md:rounded-l-[2.5rem] transform transition-transform duration-500 ease-in-out ${editActivity ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}`}>
          <div className="flex justify-center pt-4 pb-1 md:hidden"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl"><Edit2 className="text-blue-600" size={18} /></div>
              <h2 className="text-lg font-black text-gray-900">Edit Activity</h2>
            </div>
            <button onClick={() => setEditActivity(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Activity Type</label>
              <div className="grid grid-cols-3 gap-2">
                {ACTIVITY_TYPES.map(type => (
                  <button key={type} onClick={() => setEditForm({ ...editForm, type })}
                    className={`py-3 rounded-2xl text-xs font-black capitalize transition-all border ${editForm.type === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-100'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                <input type="date" value={editForm.date || ''} onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Notes</label>
              <textarea value={editForm.notes || ''} onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm resize-none" />
            </div>
          </div>
          <div className="px-8 py-5 border-t border-gray-100">
            <button onClick={handleUpdate} disabled={editLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2">
              {editLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Save Changes <ChevronRight size={16} /></>}
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
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Activity?</h3>
            <p className="text-sm text-gray-400 font-medium text-center mb-6">This activity will be permanently removed.</p>
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

export default AdminCropDetail;

