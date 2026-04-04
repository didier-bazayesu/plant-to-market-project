import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrops } from '../../context/CropContext';
import { useFarms } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, Sprout, MapPin, Droplets,
  Ruler, Calendar, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, Layers, X, ChevronRight,
  Microscope, Leaf, FlaskConical, Shield,
  Camera, Trash2, Plus, Activity, Loader2, Edit2
} from 'lucide-react';

const DISEASE_TYPES = [
  'Late Blight', 'Early Blight', 'Mosaic Virus',
  'Powdery Mildew', 'Root Rot', 'Leaf Rust',
  'Bacterial Wilt', 'Downy Mildew', 'Other'
];

const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const ACTIVITY_TYPES = ['irrigation', 'fertilization', 'pesticide'];
const CROP_STATUSES = ['planted', 'growing', 'harvested'];

const getActivityStyle = (type) => {
  switch (type) {
    case 'irrigation': return { icon: Droplets, color: 'text-blue-500 bg-blue-50' };
    case 'fertilization': return { icon: Leaf, color: 'text-green-500 bg-green-50' };
    case 'pesticide': return { icon: Shield, color: 'text-purple-500 bg-purple-50' };
    default: return { icon: Activity, color: 'text-gray-500 bg-gray-50' };
  }
};

const CropDetail = () => {
  const { farmId, cropId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { crops, updateCrop, deleteCrop } = useCrops();
  const { getFarm } = useFarms();

  const farm = getFarm(Number(farmId));
  const crop = crops.find(c => c.id === Number(cropId));

  const [activeTab, setActiveTab] = useState('overview');
  const [showDiseaseForm, setShowDiseaseForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showEditCropForm, setShowEditCropForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ─── EDIT CROP STATE ──────────────────────────────────────
  const [editCropForm, setEditCropForm] = useState({
    cropType: '',
    variety: '',
    plantingDate: '',
    harvestDate: '',
    status: '',
    size: '',
    progress: 0
  });
  const [editingCrop, setEditingCrop] = useState(false);
  const [editCropSuccess, setEditCropSuccess] = useState(false);
  const [editCropError, setEditCropError] = useState('');

  // ─── ACTIVITIES STATE ─────────────────────────────────────
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const [activitySuccess, setActivitySuccess] = useState(false);
  const [activityError, setActivityError] = useState('');

  // ─── DISEASE STATE ────────────────────────────────────────
  const [diseaseForm, setDiseaseForm] = useState({
    disease: '', severity: 'Low', affectedArea: '',
    symptoms: '', treatment: '', notes: ''
  });
  const [diseaseReports, setDiseaseReports] = useState([]);
  const [loadingDiseases, setLoadingDiseases] = useState(true);
  const [submittingDisease, setSubmittingDisease] = useState(false);
  const [diseaseSuccess, setDiseaseSuccess] = useState(false);
  const [diseaseError, setDiseaseError] = useState('');

  // ─── ACTIVITY FORM STATE ──────────────────────────────────
  const [activityForm, setActivityForm] = useState({
    type: 'irrigation',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  // ─── FETCH ACTIVITIES ─────────────────────────────────────
  useEffect(() => {
    if (token && crop) {
      fetchActivities();
      fetchDiseaseReports();
    }
  }, [token, crop]);

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const res = await fetch(`/api/activities?cropId=${crop.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch activities');
      const data = await res.json();
      setActivities(data.activities || []);
    } catch (err) {
      console.error('fetchActivities error:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchDiseaseReports = async () => {
    try {
      setLoadingDiseases(true);
      const res = await fetch(`/api/diseases?cropId=${crop.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch disease reports');
      const data = await res.json();
      setDiseaseReports(data.diseases || []);
    } catch (err) {
      console.error('fetchDiseaseReports error:', err);
      setDiseaseReports([]);
    } finally {
      setLoadingDiseases(false);
    }
  };

  // ─── EDIT CROP HANDLERS ───────────────────────────────────
  const handleEditClick = () => {
    setEditCropForm({
      cropType: crop.name || '',
      variety: crop.variety || '',
      plantingDate: crop.plantingDate?.split('T')[0] || '',
      harvestDate: crop.harvestDate?.split('T')[0] || '',
      status: crop.status || 'planted',
      size: crop.size || '',
      progress: crop.progress || 0
    });
    setShowEditCropForm(true);
  };

  const handleUpdateCrop = async () => {
    if (!editCropForm.cropType || !editCropForm.plantingDate) {
      setEditCropError('Please fill in all required fields');
      return;
    }

    setEditingCrop(true);
    setEditCropError('');

    try {
      const res = await fetch(`/api/crops/${crop.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cropType: editCropForm.cropType,
          variety: editCropForm.variety,
          plantingDate: editCropForm.plantingDate,
          harvestDate: editCropForm.harvestDate,
          status: editCropForm.status,
          size: editCropForm.size,
          progress: editCropForm.progress
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update crop');
      }

      await updateCrop(crop.id, {
        name: editCropForm.cropType,
        variety: editCropForm.variety,
        plantingDate: editCropForm.plantingDate,
        harvestDate: editCropForm.harvestDate,
        status: editCropForm.status,
        size: editCropForm.size,
        progress: editCropForm.progress
      });

      setEditCropSuccess(true);
      setTimeout(() => {
        setEditCropSuccess(false);
        setShowEditCropForm(false);
      }, 1500);
    } catch (err) {
      console.error('handleUpdateCrop error:', err);
      setEditCropError(err.message);
    } finally {
      setEditingCrop(false);
    }
  };

  // ─── LOG ACTIVITY ─────────────────────────────────────────
  const handleActivitySubmit = async () => {
    if (!activityForm.notes) return;
    setSubmittingActivity(true);
    setActivityError('');
    
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cropId: crop.id,
          type: activityForm.type,
          date: activityForm.date,
          notes: activityForm.notes
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to log activity');
      }
      
      await fetchActivities();
      setActivitySuccess(true);
      setTimeout(() => {
        setActivitySuccess(false);
        setShowActivityForm(false);
        setActivityForm({
          type: 'irrigation',
          notes: '',
          date: new Date().toISOString().split('T')[0]
        });
      }, 1500);
    } catch (err) {
      console.error('handleActivitySubmit error:', err);
      setActivityError(err.message);
    } finally {
      setSubmittingActivity(false);
    }
  };

  // ─── DISEASE SUBMIT ──────────────────────────────────────
  const handleDiseaseSubmit = async () => {
    if (!diseaseForm.disease || !diseaseForm.symptoms) return;
    setSubmittingDisease(true);
    setDiseaseError('');
    
    try {
      const res = await fetch('/api/diseases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cropId: crop.id,
          disease: diseaseForm.disease,
          severity: diseaseForm.severity,
          affectedArea: diseaseForm.affectedArea,
          symptoms: diseaseForm.symptoms,
          treatment: diseaseForm.treatment,
          notes: diseaseForm.notes,
          date: new Date().toISOString().split('T')[0]
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit disease report');
      }
      
      await fetchDiseaseReports();
      
      if (diseaseForm.severity === 'High' || diseaseForm.severity === 'Critical') {
        await updateCrop(crop.id, { health: 'At Risk' });
      }
      
      setDiseaseSuccess(true);
      setTimeout(() => {
        setDiseaseSuccess(false);
        setShowDiseaseForm(false);
        setDiseaseForm({ 
          disease: '', severity: 'Low', affectedArea: '', 
          symptoms: '', treatment: '', notes: '' 
        });
      }, 1500);
    } catch (err) {
      console.error('handleDiseaseSubmit error:', err);
      setDiseaseError(err.message);
    } finally {
      setSubmittingDisease(false);
    }
  };

  const handleDeleteCrop = async () => {
    try {
      await deleteCrop(crop.id);
      navigate(`/my-farms/${farmId}`);
    } catch (err) {
      console.error('Delete crop error:', err);
    }
  };

  const daysUntilHarvest = crop?.harvestDate
    ? Math.max(0, Math.ceil((new Date(crop.harvestDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  if (!crop || !farm) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Sprout size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="font-black text-gray-400 text-lg">Crop not found</p>
          <button
            onClick={() => navigate(`/my-farms/${farmId}`)}
            className="mt-4 text-green-600 font-black text-sm hover:underline flex items-center gap-1 mx-auto"
          >
            <ArrowLeft size={14} /> Back to Farm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/my-farms/${farmId}`)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">{crop.name}</h1>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <Layers size={13} className="text-green-600" />
                {farm.name} • {crop.variety || 'Unknown variety'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEditClick}
              className="bg-blue-50 text-blue-600 px-4 py-2.5 rounded-2xl hover:bg-blue-100 transition-all flex items-center gap-2 font-black text-sm border border-blue-100"
            >
              <Edit2 size={16} /> Edit Crop
            </button>
            <button
              onClick={() => setShowActivityForm(true)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 font-black text-sm"
            >
              <Plus size={16} /> Log Activity
            </button>
            <button
              onClick={() => setShowDiseaseForm(true)}
              className="bg-red-500 text-white px-4 py-2.5 rounded-2xl shadow-lg hover:bg-red-600 transition-all flex items-center gap-2 font-black text-sm"
            >
              <AlertTriangle size={16} /> Report Disease
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="bg-gray-50 text-gray-400 p-2.5 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

        {/* CROP HERO */}
        <div className="relative h-52 md:h-64 rounded-[2rem] overflow-hidden shadow-xl">
          <img 
            src={crop.img || "https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=600"} 
            alt={crop.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <span className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-black uppercase border ${
            crop.health === 'Healthy'
              ? 'bg-green-50 text-green-600 border-green-100'
              : 'bg-red-50 text-red-500 border-red-100 animate-pulse'
          }`}>
            {crop.health || 'Healthy'}
          </span>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex justify-between text-white text-sm font-bold mb-2">
              <span>Growth Progress</span>
              <span>{crop.progress || 0}%</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  crop.health === 'Healthy' ? 'bg-green-400' : 'bg-amber-400'
                }`}
                style={{ width: `${crop.progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Days to Harvest', value: daysUntilHarvest !== null ? `${daysUntilHarvest}d` : '—', icon: Clock, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
            { label: 'Field Size', value: crop.size ? `${crop.size} ha` : '—', icon: Ruler, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
            { label: 'Activities', value: activities.length, icon: Activity, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
            { label: 'Disease Reports', value: diseaseReports.length, icon: AlertTriangle, color: diseaseReports.length > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600', border: diseaseReports.length > 0 ? 'border-red-100' : 'border-green-100' },
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
          {['overview', 'activities', 'diseases'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black capitalize transition-all ${
                activeTab === tab ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab === 'activities' && activities.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {activities.length}
                </span>
              )}
              {tab === 'diseases' && diseaseReports.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {diseaseReports.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                <Sprout className="text-green-600" size={20} /> Crop Details
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Sprout, label: 'Crop Name', value: crop.name, color: 'text-green-500' },
                  { icon: Leaf, label: 'Variety', value: crop.variety || '—', color: 'text-green-400' },
                  { icon: MapPin, label: 'Location', value: farm.location || '—', color: 'text-blue-500' },
                  { icon: Layers, label: 'Farm', value: farm.name, color: 'text-purple-500' },
                  { icon: Ruler, label: 'Field Size', value: crop.size ? `${crop.size} ha` : '—', color: 'text-amber-500' },
                  { icon: Calendar, label: 'Planting Date', value: crop.plantingDate ? new Date(crop.plantingDate).toLocaleDateString() : '—', color: 'text-cyan-500' },
                  { icon: Calendar, label: 'Harvest Date', value: crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString() : '—', color: 'text-orange-500' },
                  { icon: TrendingUp, label: 'Status', value: crop.status || '—', color: 'text-emerald-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                    <item.icon size={16} className={item.color} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-bold">{item.label}</p>
                      <p className="text-sm font-black text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <Calendar className="text-green-600" size={20} /> Timeline
                </h3>
                <div className="space-y-3">
                  {crop.plantingDate && (
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                        <Sprout size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-green-600 tracking-widest">Planted</p>
                        <p className="text-base font-black text-gray-800">
                          {new Date(crop.plantingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {crop.harvestDate && (
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <TrendingUp size={18} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-amber-600 tracking-widest">Expected Harvest</p>
                        <p className="text-base font-black text-gray-800">
                          {new Date(crop.harvestDate).toLocaleDateString()}
                        </p>
                        {daysUntilHarvest !== null && (
                          <p className="text-xs text-amber-500 font-bold mt-0.5">{daysUntilHarvest} days remaining</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={`rounded-[2rem] border p-6 ${crop.health === 'Healthy' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${crop.health === 'Healthy' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {crop.health === 'Healthy'
                      ? <CheckCircle2 size={24} className="text-green-600" />
                      : <AlertTriangle size={24} className="text-red-500" />
                    }
                  </div>
                  <div>
                    <p className={`text-lg font-black ${crop.health === 'Healthy' ? 'text-green-700' : 'text-red-700'}`}>
                      {crop.health === 'Healthy' ? 'Crop is Healthy' : 'Crop is At Risk'}
                    </p>
                    <p className={`text-sm font-medium mt-0.5 ${crop.health === 'Healthy' ? 'text-green-500' : 'text-red-400'}`}>
                      {crop.health === 'Healthy' ? 'No issues detected. Keep monitoring regularly.' : 'Disease reported. Take action immediately.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVITIES TAB ── */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">Activity Log</h3>
              <button
                onClick={() => setShowActivityForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-sm hover:bg-green-700 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> Log Activity
              </button>
            </div>

            {loadingActivities ? (
              <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-100">
                <Loader2 size={32} className="text-green-600 animate-spin mx-auto" />
              </div>
            ) : activities.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-14 text-center border border-gray-100">
                <Activity size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="font-black text-gray-400">No activities logged yet</p>
                <p className="text-sm text-gray-300 font-medium mt-1">Log your first activity for this crop</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {activities.map((activity) => {
                    const { icon: Icon, color } = getActivityStyle(activity.type);
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
                          <p className="text-sm text-gray-500 font-medium mt-1">{activity.notes}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── DISEASES TAB ── */}
        {activeTab === 'diseases' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">Disease Reports</h3>
              <button
                onClick={() => setShowDiseaseForm(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl font-black text-sm hover:bg-red-600 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> Report Disease
              </button>
            </div>

            {loadingDiseases ? (
              <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-100">
                <Loader2 size={32} className="text-green-600 animate-spin mx-auto" />
              </div>
            ) : diseaseReports.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-14 text-center border border-gray-100 shadow-sm">
                <CheckCircle2 size={40} className="text-green-200 mx-auto mb-4" />
                <p className="font-black text-gray-400 text-lg">No diseases reported</p>
                <p className="text-sm text-gray-300 font-medium mt-1">Your crop appears healthy.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {diseaseReports.map((report) => (
                  <div key={report.id} className="bg-white rounded-[2rem] border border-red-100 shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-black text-gray-900">{report.disease}</h4>
                        <p className="text-sm text-gray-400 font-bold">{report.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                        report.severity === 'Critical' ? 'bg-red-100 text-red-600 border-red-200' :
                        report.severity === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        report.severity === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                      }`}>
                        {report.severity}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50 rounded-2xl p-4">
                        <p className="text-xs font-black uppercase text-red-500 tracking-widest mb-2">Symptoms</p>
                        <p className="text-sm font-medium text-gray-700">{report.symptoms}</p>
                      </div>
                      {report.treatment && (
                        <div className="bg-green-50 rounded-2xl p-4">
                          <p className="text-xs font-black uppercase text-green-600 tracking-widest mb-2">Treatment</p>
                          <p className="text-sm font-medium text-gray-700">{report.treatment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── EDIT CROP PANEL ── */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showEditCropForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => !editingCrop && setShowEditCropForm(false)}
        />
        <div className={`
          fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem]
          md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[500px] md:rounded-none md:rounded-l-[2.5rem]
          transform transition-transform duration-500 ease-in-out
          ${showEditCropForm ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>
          <div className="flex justify-center pt-4 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl">
                <Edit2 className="text-blue-600" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Edit Crop</h2>
                <p className="text-sm text-gray-400 font-medium">Update crop details</p>
              </div>
            </div>
            <button 
              onClick={() => !editingCrop && setShowEditCropForm(false)} 
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={editingCrop}
            >
              <X size={20} />
            </button>
          </div>

          {editCropSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Crop Updated!</h3>
              <p className="text-sm text-gray-400 font-medium text-center">Crop details updated successfully.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                {editCropError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">
                    ⚠ {editCropError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Crop Name *</label>
                  <input
                    type="text"
                    value={editCropForm.cropType}
                    onChange={(e) => setEditCropForm({ ...editCropForm, cropType: e.target.value })}
                    placeholder="e.g. Maize"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Variety</label>
                  <input
                    type="text"
                    value={editCropForm.variety}
                    onChange={(e) => setEditCropForm({ ...editCropForm, variety: e.target.value })}
                    placeholder="e.g. Hybrid H624"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Planting Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      type="date"
                      value={editCropForm.plantingDate}
                      onChange={(e) => setEditCropForm({ ...editCropForm, plantingDate: e.target.value })}
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Harvest Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      type="date"
                      value={editCropForm.harvestDate}
                      onChange={(e) => setEditCropForm({ ...editCropForm, harvestDate: e.target.value })}
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Field Size (ha)</label>
                  <div className="relative">
                    <Ruler className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      type="number"
                      step="0.1"
                      value={editCropForm.size}
                      onChange={(e) => setEditCropForm({ ...editCropForm, size: e.target.value })}
                      placeholder="e.g. 2.5"
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Growth Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CROP_STATUSES.map(status => (
                      <button
                        key={status}
                        onClick={() => setEditCropForm({ ...editCropForm, status })}
                        className={`py-3 rounded-2xl text-xs font-black capitalize transition-all border ${
                          editCropForm.status === status
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Growth Progress (%)</label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editCropForm.progress}
                      onChange={(e) => setEditCropForm({ ...editCropForm, progress: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-center mt-2 text-sm font-black text-gray-700">
                      {editCropForm.progress}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-5 border-t border-gray-100">
                <button
                  onClick={handleUpdateCrop}
                  disabled={editingCrop || !editCropForm.cropType || !editCropForm.plantingDate}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {editingCrop ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>Update Crop <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </>

      {/* ── DISEASE REPORT PANEL ── */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showDiseaseForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => !submittingDisease && setShowDiseaseForm(false)}
        />
        <div className={`
          fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 top-[5%] rounded-t-[2.5rem]
          md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[500px] md:rounded-none md:rounded-l-[2.5rem]
          transform transition-transform duration-500 ease-in-out
          ${showDiseaseForm ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>
          <div className="flex justify-center pt-4 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-xl">
                <AlertTriangle className="text-red-500" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Report Disease</h2>
                <p className="text-sm text-gray-400 font-medium">{crop.name} — {farm.name}</p>
              </div>
            </div>
            <button 
              onClick={() => !submittingDisease && setShowDiseaseForm(false)} 
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={submittingDisease}
            >
              <X size={20} />
            </button>
          </div>

          {diseaseSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Report Submitted!</h3>
              <p className="text-sm text-gray-400 font-medium text-center">Disease report logged successfully.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                {diseaseError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">
                    ⚠ {diseaseError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Disease Type</label>
                  <div className="relative">
                    <Microscope className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                    <select
                      value={diseaseForm.disease}
                      onChange={e => setDiseaseForm({ ...diseaseForm, disease: e.target.value })}
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-400 outline-none text-gray-800 text-sm appearance-none"
                    >
                      <option value="" disabled>Select disease type</option>
                      {DISEASE_TYPES.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-4 text-gray-300 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Severity Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {SEVERITY_LEVELS.map(level => (
                      <button
                        key={level}
                        onClick={() => setDiseaseForm({ ...diseaseForm, severity: level })}
                        className={`py-3 rounded-2xl text-xs font-black transition-all border ${
                          diseaseForm.severity === level
                            ? level === 'Critical' ? 'bg-red-600 text-white border-red-600' :
                              level === 'High' ? 'bg-orange-500 text-white border-orange-500' :
                              level === 'Medium' ? 'bg-amber-500 text-white border-amber-500' :
                              'bg-yellow-400 text-white border-yellow-400'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Symptoms Observed</label>
                  <textarea
                    value={diseaseForm.symptoms}
                    onChange={e => setDiseaseForm({ ...diseaseForm, symptoms: e.target.value })}
                    placeholder="Describe what you see..."
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-400 outline-none text-gray-800 text-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Treatment Applied (optional)</label>
                  <textarea
                    value={diseaseForm.treatment}
                    onChange={e => setDiseaseForm({ ...diseaseForm, treatment: e.target.value })}
                    placeholder="e.g. Applied Mancozeb fungicide..."
                    rows={2}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-400 outline-none text-gray-800 text-sm resize-none"
                  />
                </div>
              </div>

              <div className="px-8 py-5 border-t border-gray-100">
                <button
                  onClick={handleDiseaseSubmit}
                  disabled={!diseaseForm.disease || !diseaseForm.symptoms || submittingDisease}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {submittingDisease ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <AlertTriangle size={16} /> Submit Disease Report
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </>

      {/* ── ACTIVITY PANEL ── */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${showActivityForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => !submittingActivity && setShowActivityForm(false)}
        />
        <div className={`
          fixed z-50 bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 top-[35%] rounded-t-[2.5rem]
          md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[440px] md:rounded-none md:rounded-l-[2.5rem]
          transform transition-transform duration-500 ease-in-out
          ${showActivityForm ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>
          <div className="flex justify-center pt-4 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-xl">
                <Activity className="text-green-600" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Log Activity</h2>
                <p className="text-sm text-gray-400 font-medium">{crop.name}</p>
              </div>
            </div>
            <button 
              onClick={() => !submittingActivity && setShowActivityForm(false)} 
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={submittingActivity}
            >
              <X size={20} />
            </button>
          </div>

          {activitySuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Activity Logged!</h3>
              <p className="text-sm text-gray-400 font-medium text-center">Saved to database successfully.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 px-8 py-6 space-y-5 overflow-y-auto">
                {activityError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">
                    ⚠ {activityError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Activity Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ACTIVITY_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setActivityForm({ ...activityForm, type })}
                        className={`py-3 px-2 rounded-2xl text-xs font-black capitalize transition-all border ${
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
                  onClick={handleActivitySubmit}
                  disabled={!activityForm.notes || submittingActivity}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {submittingActivity ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Activity size={16} /> Log Activity
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </>

      {/* DELETE CROP MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="bg-red-50 w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Crop?</h3>
            <p className="text-sm text-gray-400 font-medium text-center mb-6">
              This will permanently remove <span className="font-black text-gray-700">{crop.name}</span> and all its data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-500 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCrop}
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

export default CropDetail;