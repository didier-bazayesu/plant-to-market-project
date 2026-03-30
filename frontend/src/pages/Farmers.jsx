import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users, MapPin, Search, Filter,
  ChevronRight, Phone, Mail, Sprout,
  Layers, CheckCircle2, XCircle, Eye,
  X, TrendingUp, Calendar
} from 'lucide-react';

const STATUS_FILTERS = ['All', 'Active', 'Inactive'];

const Farmers = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // ─── FETCH FARMERS ────────────────────────────────────────
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await fetch('/api/farmers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch farmers');
        const data = await res.json();

        const mapped = data.farmers.map(f => ({
          id: f.id,
          name: f.name,
          email: f.email,
          phone: f.phone || '—',
          district: f.user?.district || '—',
          status: 'Active',
          role: f.user?.role || 'farmer',
          farms: f.farms?.length || 0,
          crops: f.farms?.reduce((sum, farm) => sum + (farm.crops?.length || 0), 0) || 0,
          joined: f.user?.createdAt || new Date().toISOString(),
          totalArea: f.farms?.reduce((sum, farm) => sum + (farm.size || 0), 0) || 0,
          revenue: '—',
        }));
        setFarmers(mapped);
      } catch (err) {
        console.error('fetchFarmers error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchFarmers();
  }, [token]);

  // ─── STATS ────────────────────────────────────────────────
  const total = farmers.length;
  const active = farmers.filter(f => f.status === 'Active').length;
  const inactive = farmers.filter(f => f.status === 'Inactive').length;
  const districts = [...new Set(farmers.map(f => f.district).filter(d => d !== '—'))].length;
  const totalArea = farmers.reduce((sum, f) => sum + f.totalArea, 0);

  // ─── FILTERED ─────────────────────────────────────────────
  const filtered = farmers.filter(f => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400">Loading farmers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Farmers</h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <MapPin size={14} className="text-green-600" />
              Rwanda • {total} farmer{total !== 1 ? 's' : ''} registered
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-3.5 text-gray-300" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, district..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-800 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Farmers', value: total, icon: Users, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
            { label: 'Active', value: active, icon: CheckCircle2, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
            { label: 'Inactive', value: inactive, icon: XCircle, color: 'bg-red-50 text-red-500', border: 'border-red-100' },
            { label: 'Districts', value: districts, icon: MapPin, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
            { label: 'Total Area (ha)', value: totalArea, icon: Layers, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
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
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Status</span>
          </div>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all border ${
                statusFilter === f
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-green-200'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="text-xs text-gray-400 font-bold ml-auto">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Farmer', 'District', 'Contact', 'Farms', 'Crops', 'Area', 'Joined', 'Status', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-black uppercase text-gray-400 tracking-widest px-6 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((f) => (
                  <tr
                    key={f.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/farmers/${f.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center font-black text-green-600 text-sm shrink-0">
                          {f.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">{f.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold capitalize">{f.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{f.district}</td>
                    <td className="px-6 py-4">{f.phone}<br/><span className="text-[10px] text-gray-400 font-medium truncate max-w-[140px]">{f.email}</span></td>
                    <td className="px-6 py-4">{f.farms}</td>
                    <td className="px-6 py-4">{f.crops}</td>
                    <td className="px-6 py-4">{f.totalArea} ha</td>
                    <td className="px-6 py-4">{new Date(f.joined).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                        f.status === 'Active'
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Eye size={16} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Users size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-black text-gray-400 text-lg">No farmers found</p>
                <p className="text-sm text-gray-300 font-medium mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Farmers;
