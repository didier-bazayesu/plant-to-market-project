import { useState } from 'react';
import { TrendingUp, Calendar, Ruler, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useHarvests } from '../../context/HarvestContext';

const HarvestPanel = ({ cropId, cropName, onClose, onSuccess }) => {
  const { addHarvest } = useHarvests();

  const [form, setForm] = useState({
    quantity: '',
    quality: 'Good',
    revenue: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.quantity || !form.revenue || !form.date) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await addHarvest({
        cropId,
        quantity: parseFloat(form.quantity),
        quality: form.quality,
        revenue: parseFloat(form.revenue),
        date: form.date,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
        onClose?.();
        setForm({
          quantity: '', quality: 'Good', revenue: '',
          date: new Date().toISOString().split('T')[0]
        });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to log harvest');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500`}
        onClick={() => !submitting && onClose?.()}
      />

      {/* Panel */}
      <div className="fixed z-50 bg-white shadow-2xl flex flex-col inset-x-0 bottom-0 top-[25%] rounded-t-[2.5rem] md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[440px] md:rounded-none md:rounded-l-[2.5rem] transform transition-transform duration-500 ease-in-out translate-y-0 md:translate-x-0">

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-4 pb-1 md:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-8 pt-6 pb-5 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-2 rounded-xl">
              <TrendingUp className="text-amber-600" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">Log Harvest</h2>
              <p className="text-sm text-gray-400 font-medium">{cropName}</p>
            </div>
          </div>
          <button
            onClick={() => !submitting && onClose?.()}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={submitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Harvest Logged!</h3>
            <p className="text-sm text-gray-400 font-medium text-center">
              Harvest record saved successfully.
            </p>
          </div>
        ) : (
          <>
            {/* Form */}
            <div className="flex-1 px-8 py-6 space-y-5 overflow-y-auto">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">
                  ⚠ {error}
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
                  Quantity (kg) *
                </label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-4 text-gray-300" size={16} />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: e.target.value })}
                    placeholder="e.g. 150"
                    className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-800 text-sm"
                  />
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
                  Quality *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Excellent', 'Good', 'Fair', 'Poor'].map(q => (
                    <button
                      key={q}
                      onClick={() => setForm({ ...form, quality: q })}
                      className={`py-3 rounded-2xl text-xs font-black transition-all border ${
                        form.quality === q
                          ? q === 'Excellent' ? 'bg-green-600 text-white border-green-600'
                          : q === 'Good'      ? 'bg-blue-600 text-white border-blue-600'
                          : q === 'Fair'      ? 'bg-amber-500 text-white border-amber-500'
                          :                    'bg-red-500 text-white border-red-500'
                          : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Revenue */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
                  Revenue (RWF) *
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-4 text-gray-300" size={16} />
                  <input
                    type="number"
                    min="0"
                    value={form.revenue}
                    onChange={e => setForm({ ...form, revenue: e.target.value })}
                    placeholder="e.g. 75000"
                    className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-800 text-sm"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
                  Harvest Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-gray-300" size={16} />
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-800 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="px-8 py-5 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.quantity || !form.revenue}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                {submitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <><TrendingUp size={16} /> Save Harvest Record</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HarvestPanel;