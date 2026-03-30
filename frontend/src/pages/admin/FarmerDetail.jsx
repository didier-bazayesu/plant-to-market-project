import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, MapPin, Mail, Phone, Layers,
  Sprout, Ruler, FlaskConical, Droplets,
  Edit2, Trash2, X, ChevronRight, Plus,
  CheckCircle2
} from 'lucide-react';

const RWANDA_DISTRICTS = [
  'Gasabo', 'Kicukiro', 'Nyarugenge',
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo',
  'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe',
  'Nyanza', 'Nyaruguru', 'Ruhango',
  'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma',
  'Nyagatare', 'Rwamagana',
  'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke',
  'Rubavu', 'Rutsiro', 'Rusizi',
];

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Sandy Loam', 'Silty', 'Peaty'];

const AdminFarmerDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // ─── EDIT USER STATE ──────────────────────────────────────
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUserForm, setEditUserForm] = useState({});
  const [editUserLoading, setEditUserLoading] = useState(false);

  // ─── EDIT FARM STATE ──────────────────────────────────────
  const [editFarm, setEditFarm] = useState(null);
  const [editFarmForm, setEditFarmForm] = useState({});
  const [editFarmLoading, setEditFarmLoading] = useState(false);

  // ─── DELETE STATE ─────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'farm', id }
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchUser(); }, [id]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ─── UPDATE USER ──────────────────────────────────────────
  const handleUpdateUser = async () => {
    setEditUserLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editUserForm)
      });
      if (res.ok) {
        await fetchUser();
        setShowEditUser(false);
        showSuccess('User updated successfully');
      }
    } catch (err) { console.error(err); }
    finally { setEditUserLoading(false); }
  };

  // ─── UPDATE FARM ──────────────────────────────────────────
  const handleUpdateFarm = async () => {
    setEditFarmLoading(true);
    try {
      const res = await fetch(`/api/farms/${editFarm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editFarmForm)
      });
      if (res.ok) {
        await fetchUser();
        setEditFarm(null);
        showSuccess('Farm updated successfully');
      }
    } catch (err) { console.error(err); }
    finally { setEditFarmLoading(false); }
  };

  // ─── DELETE FARM ──────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const { type, id: deleteId } = confirmDelete;
      const url = type === 'farm' ? `/api/farms/${deleteId}` : `/api/admin/users/${deleteId}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        if (type === 'user') {
          navigate('/admin/farmers');
        } else {
          await fetchUser();
          showSuccess('Farm deleted successfully');
        }
        setConfirmDelete(null);
      }
    } catch (err) { console.error(err); }
    finally { setDeleteLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <p className="font-black text-gray-400 text-lg">User not found</p>
        <button onClick={() => navigate('/admin/farmers')} className="mt-4 text-green-600 font-black text-sm hover:underline">← Back</button>
      </div>
    </div>
  );

  const farms = user.farmerProfile?.farms || [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin/farmers')} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500 font-medium capitalize flex items-center gap-1">
                <MapPin size={13} className="text-green-600" />
                {user.district || '—'} • {user.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
           <button
            onClick={() => {
                setShowEditUser(true);
                setEditUserForm({
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                district: user.district || '',
                role: user.role
                });
            }}
            disabled={user.role === 'admin'}
            className={`px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all
                ${user.role === 'admin'
                ? 'bg-blue-200 text-blue-300 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
            `}
            >
            <Edit2 size={15} /> Edit
            </button>
            <button
            onClick={() => setConfirmDelete({ type: 'user', id: user.id })}
            disabled={user.role === 'admin'}
            className={`px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all
                ${user.role === 'admin'
                ? 'bg-red-200 text-red-300 cursor-not-allowed'
                : 'bg-red-50 text-red-500 hover:bg-red-100'}
            `}
            >
            <Trash2 size={15} /> Delete
            </button>
          </div>
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

        {/* USER PROFILE CARD */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center font-black text-green-600 text-2xl shrink-0">
              {user.name?.charAt(0)}
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: Mail, label: 'Email', value: user.email },
                { icon: Phone, label: 'Phone', value: user.phone || '—' },
                { icon: MapPin, label: 'District', value: user.district || '—' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3">
                  <item.icon size={15} className="text-green-500 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold">{item.label}</p>
                    <p className="text-sm font-black text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FARMS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Layers className="text-green-600" size={20} />
              Farms ({farms.length})
            </h2>
          </div>

          {farms.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-14 text-center border border-gray-100">
              <Layers size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="font-black text-gray-400">No farms registered</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {farms.map(farm => (
                <div
                  key={farm.id}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(`/admin/farmers/${id}/farms/${farm.id}`)}
                >
                  {/* Farm image */}
                  <div className="h-36 overflow-hidden relative bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=600"
                      alt={farm.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditFarm(farm);
                          setEditFarmForm({ name: farm.name, location: farm.location, size: farm.size, soilType: farm.soilType || '' });
                        }}
                        className="bg-white/90 hover:bg-blue-50 p-2 rounded-xl text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete({ type: 'farm', id: farm.id }); }}
                        className="bg-white/90 hover:bg-red-50 p-2 rounded-xl text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-4">
                      <p className="text-white font-black">{farm.name}</p>
                      <p className="text-white/70 text-xs font-bold flex items-center gap-1">
                        <MapPin size={10} /> {farm.location}
                      </p>
                    </div>
                  </div>

                  {/* Farm info */}
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="font-black text-gray-900 text-sm">{farm.size}</p>
                        <p className="text-xs text-gray-400 font-bold">ha</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="font-black text-gray-900 text-sm">{farm.crops?.length || 0}</p>
                        <p className="text-xs text-gray-400 font-bold">Crops</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="font-black text-gray-900 text-xs truncate">{farm.soilType || '—'}</p>
                        <p className="text-xs text-gray-400 font-bold">Soil</p>
                      </div>
                    </div>
                    <button className="w-full text-green-600 font-black text-xs flex items-center justify-center gap-1 hover:underline">
                      View Crops <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDIT USER PANEL */}
      <>
        <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showEditUser ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowEditUser(false)} />
        <div className={`fixed z-50 bg-white shadow-2xl flex flex-col inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem] md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[460px] md:rounded-none md:rounded-l-[2.5rem] transform transition-transform duration-500 ease-in-out ${showEditUser ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}`}>
          <div className="flex justify-center pt-4 pb-1 md:hidden"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl"><Edit2 className="text-blue-600" size={18} /></div>
              <h2 className="text-lg font-black text-gray-900">Edit User</h2>
            </div>
            <button onClick={() => setShowEditUser(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            {[
              { key: 'name', label: 'Full Name', type: 'text' },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'phone', label: 'Phone', type: 'text' },
            ].map(f => (
              <div key={f.key} className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">{f.label}</label>
                <input type={f.type} value={editUserForm[f.key] || ''} onChange={e => setEditUserForm({ ...editUserForm, [f.key]: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm" />
              </div>
            ))}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">District</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                <select value={editUserForm.district || ''} onChange={e => setEditUserForm({ ...editUserForm, district: e.target.value })}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm appearance-none">
                  <option value="">Select district</option>
                  {RWANDA_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
                <ChevronRight size={16} className="absolute right-4 top-4 text-gray-300 rotate-90 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Role</label>
              <div className="grid grid-cols-2 gap-3">
                {['farmer', 'admin'].map(role => (
                  <button key={role} onClick={() => setEditUserForm({ ...editUserForm, role })}
                    className={`py-3 rounded-2xl text-sm font-black capitalize transition-all border ${editUserForm.role === role ? role === 'admin' ? 'bg-purple-600 text-white border-purple-600' : 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-100'}`}>
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-8 py-5 border-t border-gray-100">
            <button onClick={handleUpdateUser} disabled={editUserLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2">
              {editUserLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Save Changes <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      </>

      {/* EDIT FARM PANEL */}
      <>
        <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${editFarm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setEditFarm(null)} />
        <div className={`fixed z-50 bg-white shadow-2xl flex flex-col inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem] md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[460px] md:rounded-none md:rounded-l-[2.5rem] transform transition-transform duration-500 ease-in-out ${editFarm ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}`}>
          <div className="flex justify-center pt-4 pb-1 md:hidden"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 p-2 rounded-xl"><Edit2 className="text-amber-600" size={18} /></div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Edit Farm</h2>
                <p className="text-sm text-gray-400">{editFarm?.name}</p>
              </div>
            </div>
            <button onClick={() => setEditFarm(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            {[
              { key: 'name', label: 'Farm Name', placeholder: 'Farm name' },
              { key: 'location', label: 'Location', placeholder: 'Sector, District' },
            ].map(f => (
              <div key={f.key} className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">{f.label}</label>
                <input value={editFarmForm[f.key] || ''} onChange={e => setEditFarmForm({ ...editFarmForm, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-800 text-sm" />
              </div>
            ))}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Size (ha)</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-4 text-gray-300" size={16} />
                <input type="number" min="0" step="0.1" value={editFarmForm.size || ''} onChange={e => setEditFarmForm({ ...editFarmForm, size: e.target.value })}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-800 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Soil Type</label>
              <div className="relative">
                <FlaskConical className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                <select value={editFarmForm.soilType || ''} onChange={e => setEditFarmForm({ ...editFarmForm, soilType: e.target.value })}
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-800 text-sm appearance-none">
                  <option value="">Select soil type</option>
                  {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronRight size={16} className="absolute right-4 top-4 text-gray-300 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="px-8 py-5 border-t border-gray-100">
            <button onClick={handleUpdateFarm} disabled={editFarmLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2">
              {editFarmLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Save Farm <ChevronRight size={16} /></>}
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
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">
              Delete {confirmDelete.type === 'user' ? 'User' : 'Farm'}?
            </h3>
            <p className="text-sm text-gray-400 font-medium text-center mb-6">
              {confirmDelete.type === 'user'
                ? 'This will permanently delete the user and ALL their farms, crops and activities.'
                : 'This will permanently delete the farm and all its crops and activities.'
              }
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

export default AdminFarmerDetail;