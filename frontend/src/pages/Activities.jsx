import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrops } from '../context/CropContext';
import { 
  Sprout, Droplets, TrendingUp, MapPin, 
  CloudRain, Plus, ArrowRight, Microscope,
  Activity, Leaf, Shield, X, Calendar, ChevronRight
} from 'lucide-react';
import RegisterCrop from '../components/RegisterCrop';

const ActivityPage = () => {
  const { token } = useAuth();
  const { crops, addCrop } = useCrops();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [activities, setActivities] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // ─── ACTIVITY FORM ────────────────────────────────────────
  const [activityForm, setActivityForm] = useState({
    cropId: '',
    type: 'irrigation',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── FETCH ACTIVITIES ─────────────────────────────────────
  useEffect(() => {
    if (token) {
      fetchActivities();
      fetchMarketPrices();
    }
  }, [token]);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setActivities(data.activities || []);
    } catch (err) {
      console.error('fetchActivities error:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      const res = await fetch('/api/marketprices');
      const data = await res.json();
      setMarketPrices(data);
    } catch (err) {
      console.error('fetchMarketPrices error:', err);
    }
  };

  // ─── LOG ACTIVITY ─────────────────────────────────────────
  const handleLogActivity = async () => {
    if (!activityForm.cropId || !activityForm.notes) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cropId: parseInt(activityForm.cropId),
          type: activityForm.type,
          date: activityForm.date,
          notes: activityForm.notes
        })
      });
      if (!res.ok) throw new Error('Failed to log activity');
      await fetchActivities(); // refresh
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowLogActivity(false);
        setActivityForm({
          cropId: '',
          type: 'irrigation',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
      }, 1500);
    } catch (err) {
      console.error('logActivity error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── ACTIVITY ICON ────────────────────────────────────────
  const getActivityIcon = (type) => {
    switch (type) {
      case 'irrigation': return { icon: Droplets, color: 'text-blue-500 bg-blue-50' };
      case 'fertilization': return { icon: Leaf, color: 'text-green-500 bg-green-50' };
      case 'pesticide': return { icon: Shield, color: 'text-purple-500 bg-purple-50' };
      default: return { icon: Activity, color: 'text-gray-500 bg-gray-50' };
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Farm Activity</h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <MapPin size={14} className="text-green-600"/> Rwanda • {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-3 border border-blue-100">
              <CloudRain className="text-blue-600" size={20} />
              <p className="text-sm font-black text-blue-900">24°C • Light Rain</p>
            </div>
            <button
              onClick={() => setShowLogActivity(true)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 font-black text-sm"
            >
              <Activity size={16} /> Log Activity
            </button>
            <button 
              onClick={() => setShowRegister(true)}
              className="bg-green-600 text-white p-3 rounded-2xl shadow-lg hover:bg-green-700 transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-8">

            {/* ACTIVE CROPS */}
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sprout className="text-green-600" /> Active Cultivations
              <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {crops.length} crops
              </span>
            </h2>

            {crops.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-sm">
                <Sprout size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-black text-gray-400 text-lg">No crops registered yet</p>
                <p className="text-sm text-gray-300 font-medium mt-1 mb-6">Click the + button to register your first crop</p>
                <button
                  onClick={() => setShowRegister(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-700 transition-all inline-flex items-center gap-2"
                >
                  <Plus size={16} /> Register Crop
                </button>
              </div>
            ) : (
              crops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-48 h-48 rounded-[2rem] overflow-hidden shrink-0">
                      <img src={crop.img} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-grow p-4 pr-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">{crop.name}</h3>
                          <p className="text-sm text-gray-400 font-medium uppercase tracking-tighter">
                            {crop.variety} • {crop.location}
                          </p>
                          {crop.farm && (
                            <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                              <MapPin size={10} /> {crop.farm}
                            </p>
                          )}
                        </div>
                        <StatusBadge health={crop.health} />
                      </div>
                      <div className="mb-6">
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-gray-400">Growth Progress</span>
                          <span className="text-green-600">{crop.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              crop.health === 'Healthy' ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${crop.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-blue-500" />
                          <span className="text-xs font-bold text-gray-600">{crop.lastWatered}</span>
                        </div>
                        {crop.plantingDate && (
                          <div className="text-xs font-bold text-gray-400">
                            Planted: {new Date(crop.plantingDate).toLocaleDateString()}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setActivityForm(prev => ({ ...prev, cropId: crop.id }));
                            setShowLogActivity(true);
                          }}
                          className="ml-auto text-green-600 font-bold text-xs flex items-center gap-1 hover:underline"
                        >
                          Log Activity <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* RECENT ACTIVITIES */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Activity className="text-green-600" size={20} /> Recent Activities
                <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {activities.length} logged
                </span>
              </h2>

              {loadingActivities ? (
                <div className="bg-white rounded-[2rem] p-8 text-center border border-gray-100">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : activities.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-100">
                  <Activity size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="font-black text-gray-400">No activities logged yet</p>
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-50">
                    {activities.map((activity) => {
                      const { icon: Icon, color } = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-black text-gray-900 text-sm capitalize">{activity.type}</p>
                              <span className="text-xs text-gray-400 font-bold shrink-0">
                                {new Date(activity.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium mt-0.5">{activity.notes}</p>
                            {activity.crop && (
                              <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                                <Sprout size={10} /> {activity.crop.cropType}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Microscope className="text-green-500" size={20}/> AI Health Scan
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                  <p className="text-sm font-medium italic opacity-80">
                    "Analyzing latest uploads for potato sectors..."
                  </p>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-2xl font-black text-xs transition-colors">
                  Run New AI Scan
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-600" size={20}/> Live Market
              </h3>
              <div className="space-y-6">
                {marketPrices.length === 0 ? (
                  <p className="text-sm text-gray-400 font-medium text-center py-4">No market data</p>
                ) : (
                  marketPrices.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0">
                      <div>
                        <p className="font-bold text-gray-900">{item.crop_type}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.market_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">{item.price} RWF</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTER CROP PANEL */}
      {showRegister && (
        <RegisterCrop
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onAddCrop={addCrop}
        />
      )}

      {/* LOG ACTIVITY PANEL */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showLogActivity ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setShowLogActivity(false)}
        />
        <div className={`
          fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 top-[35%] rounded-t-[2.5rem]
          md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[440px] md:rounded-none md:rounded-l-[2.5rem]
          transform transition-transform duration-500 ease-in-out
          ${showLogActivity ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>
          <div className="flex justify-center pt-4 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-xl">
                <Activity className="text-green-600" size={18} />
              </div>
              <h2 className="text-lg font-black text-gray-900">Log Activity</h2>
            </div>
            <button onClick={() => setShowLogActivity(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          {submitSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
                <Sprout size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Activity Logged!</h3>
              <p className="text-sm text-gray-400 font-medium text-center">
                Activity has been saved successfully.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 px-8 py-6 space-y-5 overflow-y-auto">

                {/* Crop selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Select Crop</label>
                  <select
                    value={activityForm.cropId}
                    onChange={e => setActivityForm({ ...activityForm, cropId: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm appearance-none"
                  >
                    <option value="" disabled>Select a crop</option>
                    {crops.map(c => (
                      <option key={c.id} value={c.id}>{c.name} — {c.farm}</option>
                    ))}
                  </select>
                </div>

                {/* Activity type */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Activity Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['irrigation', 'fertilization', 'pesticide'].map(type => (
                      <button
                        key={type}
                        onClick={() => setActivityForm({ ...activityForm, type })}
                        className={`py-3 rounded-2xl text-xs font-black capitalize transition-all border ${
                          activityForm.type === type
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-green-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      type="date"
                      value={activityForm.date}
                      onChange={e => setActivityForm({ ...activityForm, date: e.target.value })}
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Notes</label>
                  <textarea
                    value={activityForm.notes}
                    onChange={e => setActivityForm({ ...activityForm, notes: e.target.value })}
                    placeholder="Describe what was done..."
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm resize-none"
                  />
                </div>
              </div>

              <div className="px-8 py-5 border-t border-gray-100">
                <button
                  onClick={handleLogActivity}
                  disabled={!activityForm.cropId || !activityForm.notes || submitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <> Log Activity <ChevronRight size={16} /> </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </>

    </div>
  );
};

const StatusBadge = ({ health }) => (
  <span className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
    health === 'Healthy' 
      ? 'bg-green-50 text-green-600 border-green-100' 
      : 'bg-red-50 text-red-600 border-red-100 animate-pulse'
  }`}>
    {health}
  </span>
);

export default ActivityPage;