import { useEffect, useState } from 'react';
import { Sprout, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STAGES = [
  { key: 'germination',      label: 'Germination', pct: 0   },
  { key: 'vegetative',       label: 'Vegetative',  pct: 15  },
  { key: 'flowering',        label: 'Flowering',   pct: 35  },
  { key: 'grain_fill',       label: 'Grain Fill',  pct: 60  },
  { key: 'maturation',       label: 'Maturation',  pct: 80  },
  { key: 'ready_to_harvest', label: 'Ready',       pct: 100 },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ProgressBar({ pct, isOverdue, isReady }) {
  const color = isOverdue ? 'bg-red-500' : isReady ? 'bg-green-500' : 'bg-blue-500';
  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div className={`h-3 rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">Planted</span>
        <span className="text-xs font-bold text-gray-600">{pct}%</span>
        <span className="text-xs text-gray-400">Harvest</span>
      </div>
    </div>
  );
}

function StageIndicator({ currentStage }) {
  const currentIndex = STAGES.findIndex(s => s.key === currentStage);
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {STAGES.map((stage, i) => {
        const isDone    = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={stage.key} className="flex items-center gap-1 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full border-2 ${isDone ? 'bg-green-500 border-green-500' : isCurrent ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`} />
              <p className={`text-xs mt-1 whitespace-nowrap ${isCurrent ? 'font-black text-blue-600' : isDone ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                {stage.label}
              </p>
            </div>
            {i < STAGES.length - 1 && <div className={`w-6 h-0.5 mb-4 flex-shrink-0 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function CropProgressTracker({ cropId }) {
  const { token } = useAuth();
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!cropId || !token) return;
    setLoading(true);
    fetch(`/api/crops/${cropId}/calendar`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message);
        setCalendar(data.calendar);
      })
      .catch(err => setError(err.message || 'Failed to load progress'))
      .finally(() => setLoading(false));
  }, [cropId, token]);

  if (loading) return (
    <div className="space-y-3 animate-pulse">
      <div className="h-6 bg-gray-100 rounded-xl w-32" />
      <div className="h-12 bg-gray-100 rounded-xl" />
      <div className="h-20 bg-gray-100 rounded-xl" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-sm text-red-600 font-semibold">⚠ {error}</p>
    </div>
  );

  if (!calendar) return null;

  const eta = calendar.harvestETA;

  if (!eta?.available) return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <p className="text-sm text-gray-500">{eta?.message || 'No planting date recorded.'}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className={`rounded-xl p-4 flex items-start gap-3 ${eta.isOverdue ? 'bg-red-50 border border-red-200' : eta.isReadyToHarvest ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
        <span className={eta.isOverdue ? 'text-red-500' : eta.isReadyToHarvest ? 'text-green-500' : 'text-blue-500'}>
          {eta.isOverdue ? <AlertTriangle size={20} /> : eta.isReadyToHarvest ? <CheckCircle size={20} /> : <Sprout size={20} />}
        </span>
        <div>
          <p className={`text-sm font-black ${eta.isOverdue ? 'text-red-700' : eta.isReadyToHarvest ? 'text-green-700' : 'text-blue-700'}`}>
            {eta.isOverdue ? 'Overdue for harvest' : eta.isReadyToHarvest ? 'Ready to harvest' : `${eta.stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Stage`}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{eta.message}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={15} className="text-gray-400" />
          <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Growth Progress</h4>
        </div>
        <ProgressBar pct={eta.progressPct} isOverdue={eta.isOverdue} isReady={eta.isReadyToHarvest} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sprout size={15} className="text-gray-400" />
          <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Growth Stage</h4>
        </div>
        <StageIndicator currentStage={eta.stage} />
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={15} className="text-gray-400" />
          <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Key Dates</h4>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs"><span className="text-gray-400">Planted</span><span className="font-semibold text-gray-700">{formatDate(eta.plantingDate)}</span></div>
          <div className="flex justify-between text-xs"><span className="text-gray-400">Days in ground</span><span className="font-semibold text-gray-700">{eta.daysPlanted} days</span></div>
          <div className="border-t border-gray-200 pt-2 mt-1">
            <div className="flex justify-between text-xs"><span className="text-gray-400">Earliest harvest</span><span className="font-semibold text-green-700">{formatDate(eta.earliestHarvest)}</span></div>
            <div className="flex justify-between text-xs mt-1"><span className="text-gray-400">Latest harvest</span><span className="font-semibold text-gray-700">{formatDate(eta.latestHarvest)}</span></div>
            {!eta.isReadyToHarvest && (
              <div className="flex justify-between text-xs mt-1"><span className="text-gray-400">Days remaining</span><span className="font-semibold text-blue-700">{eta.daysToEarliestHarvest}–{eta.daysToLatestHarvest} days</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}