import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SEASON_COLORS = {
  A: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  B: { bg: 'bg-blue-50',  border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'  },
  C: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' });
}

function PlantingWindowCard({ window }) {
  const colors = SEASON_COLORS[window.season] || SEASON_COLORS.A;
  return (
    <div className={`border rounded-xl p-4 ${window.isWindowOpen ? colors.bg : 'bg-gray-50'} ${window.isWindowOpen ? colors.border : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${colors.badge}`}>
          Season {window.season} {window.isWindowOpen ? '● Now' : ''}
        </span>
        {window.isWindowOpen
          ? <span className="text-xs font-bold text-green-600">✓ Window Open</span>
          : <span className="text-xs text-gray-400">In {window.daysUntilWindow} days</span>
        }
      </div>
      <p className="text-xs text-gray-400 mb-3">{window.description}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Planting window</span>
          <span className="font-semibold text-gray-700">{formatDate(window.plantingWindowStart)} – {formatDate(window.plantingWindowEnd)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Peak planting date</span>
          <span className="font-semibold text-gray-700">{formatDate(window.peakPlantingDate)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Est. harvest</span>
            <span className="font-semibold text-gray-700">{formatDate(window.estimatedHarvest.earliest)} – {formatDate(window.estimatedHarvest.latest)}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-400">Days to harvest</span>
            <span className="font-semibold text-gray-700">{window.estimatedHarvest.daysToHarvestMin}–{window.estimatedHarvest.daysToHarvestMax} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlantingCalendarCard({ cropId }) {
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
      .catch(err => setError(err.message || 'Failed to load calendar'))
      .finally(() => setLoading(false));
  }, [cropId, token]);

  if (loading) return (
    <div className="space-y-3 animate-pulse">
      <div className="h-8 bg-gray-100 rounded-xl w-48" />
      <div className="h-40 bg-gray-100 rounded-xl" />
      <div className="h-40 bg-gray-100 rounded-xl" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-sm text-red-600 font-semibold">⚠ {error}</p>
    </div>
  );

  if (!calendar) return null;

  const { seasonSummary, plantingWindows } = calendar;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-green-600" />
          <div>
            <p className="text-xs text-gray-400 font-medium">Current Season</p>
            <p className="text-sm font-black text-gray-800">{seasonSummary.currentSeasonName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{seasonSummary.currentSeasonDescription}</p>
          <p className="text-xs text-gray-400 mt-0.5">Today: {seasonSummary.today}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {seasonSummary.seasons.map(s => (
          <div key={s.key} className={`flex-1 rounded-xl p-2 text-center border ${s.isCurrent ? `${SEASON_COLORS[s.key].bg} ${SEASON_COLORS[s.key].border}` : 'bg-gray-50 border-gray-200'}`}>
            <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${s.isCurrent ? SEASON_COLORS[s.key].dot : 'bg-gray-300'}`} />
            <p className={`text-xs font-black ${s.isCurrent ? 'text-gray-800' : 'text-gray-400'}`}>{s.name}</p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3">Planting Windows</h4>
        {plantingWindows?.length > 0
          ? <div className="space-y-3">{plantingWindows.map((w, i) => <PlantingWindowCard key={i} window={w} />)}</div>
          : <div className="bg-gray-50 rounded-xl p-4"><p className="text-sm text-gray-500">No planting windows available for this crop type.</p></div>
        }
      </div>
    </div>
  );
}