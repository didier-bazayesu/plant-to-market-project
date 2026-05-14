import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCrops } from '../../context/CropContext';
import {
  Users, Sprout, Layers, TrendingUp,
  AlertTriangle, CheckCircle2, MapPin,
  ArrowRight, Activity, BarChart2,
  ShieldCheck, Bell, Search, Trash2,
  Eye, X
} from 'lucide-react';
import { marketPrices } from '../../data/mockData';

const AdminDashboard = () => {
  const { farmer, token } = useAuth();
  const { crops } = useCrops();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  // ─── FETCH ALL USERS ──────────────────────────────────────
  useEffect(() => {
    fetchUsers();
     fetchStats();
  }, [token]);

    //fetching the stats 

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error('fetchStats error:', err);
      } finally {
        setStatsLoading(false);
      }
    };
     

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data.users || data);
    } catch (err) {
      console.error('fetchUsers error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── DELETE USER ──────────────────────────────────────────
  const handleDeleteUser = async (id) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        setConfirmDelete(null);
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('deleteUser error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── COMPUTED STATS ───────────────────────────────────────
  const farmers = users.filter(u => u.role === 'farmer');
  const admins = users.filter(u => u.role === 'admin');
  const totalFarms = farmers.reduce((sum, u) =>
    sum + (u.farmerProfile?.farms?.length || 0), 0);
  const totalCrops = farmers.reduce((sum, u) =>
    sum + (u.farmerProfile?.farms?.reduce((s, f) =>
      s + (f.crops?.length || 0), 0) || 0), 0);
  const activeFarmers = farmers.filter(u =>
    (u.farmerProfile?.farms?.length || 0) > 0).length;
  const districts = [...new Set(
    farmers.map(u => u.district).filter(Boolean)
  )].length;

  // ─── RECENT ACTIVITIES ────────────────────────────────────
  const recentActivities = farmers
    .flatMap(u => u.farmerProfile?.farms || [])
    .flatMap(f => f.crops || [])
    .flatMap(c => (c.activities || []).map(a => ({
      ...a,
      cropType: c.cropType,
      farmName: c.farmName,
    })))
    .slice(0, 5);

  // ─── FILTERED USERS ───────────────────────────────────────
  const filteredUsers = search
  ? farmers.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.district?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    )
  : farmers.slice(0, 5);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-green-600" />
              <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <MapPin size={14} className="text-green-600" />
              Rwanda • {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-gray-50 border border-gray-100 p-3 rounded-2xl hover:bg-gray-100 transition-all relative">
              <Bell size={18} className="text-gray-500" />
            </button>
            <div className="bg-green-50 border border-green-100 px-4 py-2 rounded-2xl flex items-center gap-2">
              <div className="w-7 h-7 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                {farmer?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">{farmer?.name}</p>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

      {/* HERO BANNER */}
      <div className="relative h-56 md:h-64 rounded-[2rem] overflow-hidden shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1200"
          alt="Rwanda farmland"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-green-400" />
            <span className="text-green-400 text-xs font-black uppercase tracking-widest">
              Admin Control Panel
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
            Welcome back, {farmer?.name?.split(' ')[0] || 'Admin'}
          </h2>
          <p className="text-white/60 text-sm font-medium mb-6">
            {new Date().toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' '}· Rwanda Smart Farm Platform
          </p>

          {/* Inline mini stats */}
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: 'Farmers',    value: stats?.totalFarmers  ?? '—' },
              { label: 'Farms',      value: stats?.totalFarms    ?? '—' },
              { label: 'Crops',      value: stats?.totalCrops    ?? '—' },
              { label: 'Activities', value: stats?.totalActivities ?? '—' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-xl font-black text-white">{item.value}</p>
                <p className="text-xs text-white/50 font-bold">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location accuracy pill — top right */}
        {stats?.locationAccuracy && (
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-2 text-right">
            <p className="text-xs text-white/50 font-bold mb-1">Location Accuracy</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-green-400">
                {stats.locationAccuracy.gpsAtFarm} GPS
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs font-black text-blue-400">
                {stats.locationAccuracy.mapPin} Map
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs font-black text-amber-400">
                {stats.locationAccuracy.districtFallback} District
              </span>
            </div>
          </div>
        )}
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Users',  value: stats?.totalUsers     ?? '—', icon: Users,        color: 'bg-blue-50 text-blue-600',   border: 'border-blue-100'    },
          { label: 'Farmers',      value: stats?.totalFarmers   ?? '—', icon: CheckCircle2, color: 'bg-green-50 text-green-600', border: 'border-green-100'   },
          { label: 'Total Farms',  value: stats?.totalFarms     ?? '—', icon: Layers,       color: 'bg-amber-50 text-amber-600', border: 'border-amber-100'   },
          { label: 'Total Crops',  value: stats?.totalCrops     ?? '—', icon: Sprout,       color: 'bg-purple-50 text-purple-600', border: 'border-purple-100'},
          { label: 'Districts',    value: stats?.districtsCount ?? '—', icon: MapPin,       color: 'bg-pink-50 text-pink-600',   border: 'border-pink-100'    },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAIN COLUMN */}
         
          <div className="lg:col-span-2 space-y-6">

  {/* PLATFORM IMAGE CARD */}
  <div className="relative h-44 rounded-[2rem] overflow-hidden shadow-lg">
    <img
      src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200"
      alt="Rwanda farm"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
    <div className="absolute inset-0 flex flex-col justify-center px-8">
      <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-1">
        Plant-to-Market Platform
      </p>
      <h3 className="text-xl font-black text-white mb-3">
        Empowering Rwanda's Farmers
      </h3>
      <div className="flex items-center gap-6">
        {[
          { label: 'Active Farmers',   value: stats?.activeFarmers  ?? '—' },
          { label: 'Farms Registered', value: stats?.totalFarms     ?? '—' },
          { label: 'Crops Tracked',    value: stats?.totalCrops     ?? '—' },
        ].map(item => (
          <div key={item.label}>
            <p className="text-xl font-black text-white">{item.value}</p>
            <p className="text-xs text-white/50 font-bold">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* FARMERS TABLE */}
  <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <Users className="text-green-600" size={20} /> Registered Farmers
        </h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          {search ? 'Search results' : 'Last 5 registered'} · {stats?.totalFarmers ?? 0} total
        </p>
      </div>

                {/* </h2>/sdffffffffffffffffffffffffff */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-300" size={14} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search farmers..."
                    className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:ring-2 focus:ring-green-500 outline-none text-gray-800 font-medium w-full sm:w-52"
                  />
                </div>
              </div>

              {loading ? (
                <div className="p-10 text-center">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-50 bg-gray-50">
                        {['Farmer', 'District', 'Farms', 'Crops', 'Actions'].map(h => (
                          <th key={h} className="text-left text-xs font-black uppercase text-gray-400 tracking-widest px-6 py-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredUsers.map((u) => {
                        const farmerFarms = u.farmerProfile?.farms || [];
                        const farmerCrops = farmerFarms.reduce((sum, f) =>
                          sum + (f.crops?.length || 0), 0);
                        return (
                          <tr
                            key={u.id}
                            className={`hover:bg-gray-50 transition-colors ${selectedUser?.id === u.id ? 'bg-green-50' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-green-100 rounded-2xl flex items-center justify-center font-black text-green-600 text-sm shrink-0">
                                  {u.name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-black text-gray-900 text-sm">{u.name}</p>
                                  <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                                <MapPin size={12} className="text-green-500" />
                                {u.district || '—'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-black text-gray-900">{farmerFarms.length}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-black text-gray-900">{farmerCrops}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedUser(
                                    selectedUser?.id === u.id ? null : u
                                  )}
                                  className="p-1.5 hover:bg-green-50 rounded-xl transition-colors text-gray-400 hover:text-green-600"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(u.id)}
                                  className="p-1.5 hover:bg-red-50 rounded-xl transition-colors text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && !loading && (
                    <div className="text-center py-10">
                      <Users size={32} className="text-gray-200 mx-auto mb-3" />
                      <p className="font-black text-gray-400 text-sm">No farmers found</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* FARMER DETAIL */}
            {selectedUser && (
              <div className="bg-white rounded-[2rem] border border-green-100 shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-3xl flex items-center justify-center font-black text-green-600 text-2xl">
                      {selectedUser.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{selectedUser.name}</h3>
                      <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-green-500" />
                        {selectedUser.district || '—'}, Rwanda
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{selectedUser.email}</p>
                    </div>
                  </div>


                 <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/farmers/${selectedUser.id}`)}
                      className="bg-green-50 text-green-600 px-4 py-2 rounded-xl font-black text-xs hover:bg-green-100 transition-all flex items-center gap-1"
                    >
                      Full Profile <ArrowRight size={12} />
                    </button>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X size={18} className="text-gray-400" />
                    </button>
                  </div>

                </div>

                {/* Farms */}
                {(selectedUser.farmerProfile?.farms || []).length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-6 text-center">
                    <Layers size={28} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-black text-gray-400">No farms registered</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedUser.farmerProfile.farms.map(farm => (
                      <div key={farm.id} className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-black text-gray-900">{farm.name}</p>
                            <p className="text-xs text-gray-400 font-bold">
                              {farm.location} • {farm.size} ha • {farm.soilType || 'Unknown soil'}
                            </p>
                          </div>
                          <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            {farm.crops?.length || 0} crops
                          </span>
                        </div>

                        {/* Crops */}
                        {(farm.crops || []).length > 0 && (
                          <div className="space-y-2 mt-3">
                            {farm.crops.map(crop => (
                              <div key={crop.id} className="bg-white rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Sprout size={14} className="text-green-500" />
                                  <span className="text-sm font-black text-gray-800">{crop.cropType}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                                    crop.status === 'growing' ? 'bg-green-50 text-green-600' :
                                    crop.status === 'planted' ? 'bg-blue-50 text-blue-600' :
                                    'bg-amber-50 text-amber-600'
                                  }`}>
                                    {crop.status}
                                  </span>
                                  <span className="text-xs text-gray-400 font-bold">
                                    {crop.activities?.length || 0} activities
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* SYSTEM OVERVIEW */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-6 text-white shadow-xl">
              <h3 className="text-base font-black mb-5 flex items-center gap-2">
                <BarChart2 className="text-green-400" size={18} /> System Overview
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Farmers',     value: stats?.totalFarmers     ?? '—' },
                  { label: 'Active Farmers',    value: stats?.activeFarmers    ?? '—' },
                  { label: 'Total Farms',       value: stats?.totalFarms       ?? '—' },
                  { label: 'Total Crops',       value: stats?.totalCrops       ?? '—' },
                  { label: 'Total Activities',  value: stats?.totalActivities  ?? '—' },
                  { label: 'Total Harvests',    value: stats?.totalHarvests    ?? '—' },
                  { label: 'Districts Covered', value: stats?.districtsCount   ?? '—' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 rounded-2xl px-4 py-3 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold">{item.label}</span>
                    <span className="text-sm font-black text-green-400">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Location accuracy breakdown */}
              {stats?.locationAccuracy && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">Location Accuracy</p>
                  <div className="space-y-2">
                    {[
                      { label: 'GPS at Farm',   value: stats.locationAccuracy.gpsAtFarm,       color: 'text-green-400' },
                      { label: 'Map Pin',       value: stats.locationAccuracy.mapPin,           color: 'text-blue-400'  },
                      { label: 'District Only', value: stats.locationAccuracy.districtFallback, color: 'text-amber-400' },
                    ].map(item => (
                      <div key={item.label} className="bg-white/10 rounded-2xl px-4 py-2 flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-bold">{item.label}</span>
                        <span className={`text-sm font-black ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RECENT ACTIVITIES */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
                <Activity className="text-green-600" size={18} /> Recent Activities
              </h3>
              {recentActivities.length === 0 ? (
                <div className="text-center py-6">
                  <Activity size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-sm font-black text-gray-400">No activities yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        activity.type === 'irrigation' ? 'bg-blue-50' :
                        activity.type === 'fertilization' ? 'bg-green-50' :
                        'bg-purple-50'
                      }`}>
                        <Activity size={14} className={
                          activity.type === 'irrigation' ? 'text-blue-500' :
                          activity.type === 'fertilization' ? 'text-green-500' :
                          'text-purple-500'
                        } />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 capitalize">{activity.type}</p>
                        <p className="text-xs text-gray-400 font-medium truncate">
                          {activity.cropType}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* TOP CROPS */}
            {stats?.cropBreakdown?.length > 0 && (
              <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                <h3 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
                  <Sprout className="text-green-600" size={18} /> Top Crops
                </h3>
                <div className="space-y-3">
                  {stats.cropBreakdown.map((crop, i) => (
                    <div key={crop.cropType} className="flex items-center gap-3">
                      <span className="text-xs font-black text-gray-400 w-4">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black text-gray-800 capitalize">
                            {crop.cropType}
                          </span>
                          <span className="text-xs font-bold text-gray-400">{crop.count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-700"
                            style={{ width: `${Math.round((crop.count / stats.totalCrops) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      <p className="text-xs text-gray-400 font-bold uppercase">{item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-sm">{item.price} RWF</p>
                      <p className={`text-xs font-black ${
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

      {/* DELETE CONFIRM MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="bg-red-50 w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete User?</h3>
            <p className="text-sm text-gray-400 font-medium text-center mb-6">
              This will permanently delete the farmer and ALL their farms, crops and activities.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-500 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(confirmDelete)}
                disabled={deleteLoading}
                className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-black text-sm"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;