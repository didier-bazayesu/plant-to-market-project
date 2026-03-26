import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCrops } from '../../context/CropContext';
import {
  Users, Sprout, Layers, TrendingUp,
  AlertTriangle, CheckCircle2, MapPin,
  ArrowRight, Activity, BarChart2,
  ShieldCheck, Bell, Search
} from 'lucide-react';
import { marketPrices } from '../../data/mockData';

// ─── HARDCODED ADMIN DATA ─────────────────────────────────────
const MOCK_FARMERS = [
  { id: 1, name: 'Didier Bazayesu', district: 'Musanze', farms: 2, crops: 3, status: 'Active', joined: '2025-01-10' },
  { id: 2, name: 'Ange Uwimana', district: 'Huye', farms: 1, crops: 2, status: 'Active', joined: '2025-01-15' },
  { id: 3, name: 'Eric Nkurunziza', district: 'Bugesera', farms: 3, crops: 5, status: 'Active', joined: '2025-02-01' },
  { id: 4, name: 'Marie Mukamana', district: 'Rubavu', farms: 1, crops: 1, status: 'Inactive', joined: '2025-02-10' },
  { id: 5, name: 'Jean Habimana', district: 'Gasabo', farms: 2, crops: 4, status: 'Active', joined: '2025-02-20' },
];

const RECENT_ACTIVITIES = [
  { id: 1, farmer: 'Didier Bazayesu', action: 'Registered new crop', crop: 'Maize', time: '2 hours ago', type: 'crop' },
  { id: 2, farmer: 'Ange Uwimana', action: 'Reported disease', crop: 'Potato', time: '4 hours ago', type: 'alert' },
  { id: 3, farmer: 'Eric Nkurunziza', action: 'Logged harvest', crop: 'Beans', time: '6 hours ago', type: 'harvest' },
  { id: 4, farmer: 'Jean Habimana', action: 'Added new farm', crop: '—', time: '1 day ago', type: 'farm' },
  { id: 5, farmer: 'Marie Mukamana', action: 'Registered new crop', crop: 'Rice', time: '2 days ago', type: 'crop' },
];
// ─────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const { farmer } = useAuth();
  const { crops } = useCrops();
  const [search, setSearch] = useState('');

  // ─── STATS ────────────────────────────────────────────────
  const totalFarmers = MOCK_FARMERS.length;
  const activeFarmers = MOCK_FARMERS.filter(f => f.status === 'Active').length;
  const totalCrops = crops.length;
  const atRiskCrops = crops.filter(c => c.health === 'At Risk').length;
  const totalFarms = MOCK_FARMERS.reduce((sum, f) => sum + f.farms, 0);

  // ─── FILTERED FARMERS ─────────────────────────────────────
  const filteredFarmers = MOCK_FARMERS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-green-600" />
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <MapPin size={14} className="text-green-600" />
              Rwanda • {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <button className="bg-gray-50 border border-gray-100 p-3 rounded-2xl hover:bg-gray-100 transition-all">
                <Bell size={18} className="text-gray-500" />
              </button>
              {atRiskCrops > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {atRiskCrops}
                </span>
              )}
            </div>

            {/* Admin badge */}
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

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Farmers', value: totalFarmers, icon: Users, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
            { label: 'Active Farmers', value: activeFarmers, icon: CheckCircle2, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
            { label: 'Total Farms', value: totalFarms, icon: Layers, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
            { label: 'Total Crops', value: totalCrops, icon: Sprout, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
            { label: 'At Risk Crops', value: atRiskCrops, icon: AlertTriangle, color: 'bg-red-50 text-red-500', border: 'border-red-100' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* AT RISK ALERT */}
            {atRiskCrops > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-[2rem] p-5 flex items-center gap-4">
                <div className="bg-red-100 p-2.5 rounded-2xl shrink-0">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-red-700">
                    {atRiskCrops} crop{atRiskCrops > 1 ? 's are' : ' is'} at risk across all farms
                  </p>
                  <p className="text-xs text-red-400 font-medium mt-0.5">
                    Review affected crops and notify farmers immediately
                  </p>
                </div>
                <span className="bg-red-500 text-white px-4 py-2 rounded-2xl font-black text-xs shrink-0">
                  Review
                </span>
              </div>
            )}

            {/* FARMERS TABLE */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Users className="text-green-600" size={20} /> Registered Farmers
                </h2>
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

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      {['Farmer', 'District', 'Farms', 'Crops', 'Joined', 'Status'].map(h => (
                        <th key={h} className="text-left text-[10px] font-black uppercase text-gray-400 tracking-widest px-6 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredFarmers.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-green-100 rounded-2xl flex items-center justify-center font-black text-green-600 text-sm shrink-0">
                              {f.name.charAt(0)}
                            </div>
                            <span className="font-black text-gray-900 text-sm">{f.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                            <MapPin size={12} className="text-green-500" />
                            {f.district}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-gray-900">{f.farms}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-gray-900">{f.crops}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-400">
                            {new Date(f.joined).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                            f.status === 'Active'
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : 'bg-gray-50 text-gray-400 border-gray-100'
                          }`}>
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredFarmers.length === 0 && (
                  <div className="text-center py-10">
                    <Users size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="font-black text-gray-400 text-sm">No farmers found</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-50 flex justify-end">
                <button className="text-green-600 font-black text-xs flex items-center gap-1 hover:underline">
                  View All Farmers <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Activity className="text-green-600" size={20} /> Recent Activity
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {RECENT_ACTIVITIES.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                      item.type === 'crop' ? 'bg-green-50' :
                      item.type === 'alert' ? 'bg-red-50' :
                      item.type === 'harvest' ? 'bg-amber-50' :
                      'bg-blue-50'
                    }`}>
                      {item.type === 'crop' && <Sprout size={16} className="text-green-600" />}
                      {item.type === 'alert' && <AlertTriangle size={16} className="text-red-500" />}
                      {item.type === 'harvest' && <BarChart2 size={16} className="text-amber-600" />}
                      {item.type === 'farm' && <Layers size={16} className="text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-900">{item.farmer}</p>
                      <p className="text-xs font-medium text-gray-400">
                        {item.action} {item.crop !== '—' && `— ${item.crop}`}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

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
                  { label: 'Farmers this month', value: '+3', positive: true },
                  { label: 'Crops registered', value: `${totalCrops}`, positive: true },
                  { label: 'At risk crops', value: `${atRiskCrops}`, positive: false },
                  { label: 'Districts covered', value: '5', positive: true },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 rounded-2xl px-4 py-3 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold">{item.label}</span>
                    <span className={`text-sm font-black ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DISTRICTS COVERAGE */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
                <MapPin className="text-green-600" size={18} /> Districts Coverage
              </h3>
              <div className="space-y-3">
                {[
                  { district: 'Musanze', farmers: 1, color: 'bg-green-500' },
                  { district: 'Huye', farmers: 1, color: 'bg-blue-500' },
                  { district: 'Bugesera', farmers: 1, color: 'bg-amber-500' },
                  { district: 'Rubavu', farmers: 1, color: 'bg-purple-500' },
                  { district: 'Gasabo', farmers: 1, color: 'bg-pink-500' },
                ].map((item) => (
                  <div key={item.district} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-sm font-bold text-gray-700 flex-1">{item.district}</span>
                    <span className="text-xs font-black text-gray-400">
                      {item.farmers} farmer{item.farmers > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

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
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-sm">{item.price} RWF</p>
                      <p className={`text-[10px] font-black ${
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
    </div>
  );
};

export default AdminDashboard;