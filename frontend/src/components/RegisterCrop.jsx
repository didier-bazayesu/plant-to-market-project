import React, { useState } from 'react';
import { X, Leaf, MapPin, ChevronRight, Calendar, Ruler, Image, Sprout } from 'lucide-react';

const STEPS = ['Crop Info', 'Location & Size', 'Schedule'];

const RegisterCrop = ({ isOpen, onClose, onAddCrop }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    location: '',
    size: '',
    plantingDate: '',
    harvestDate: '',
    img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCrop(formData);
    setFormData({ name: '', variety: '', location: '', size: '', plantingDate: '', harvestDate: '', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400' });
    setStep(0);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* HEADER */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <Sprout className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Register Crop</h2>
                <p className="text-xs text-gray-400 font-medium">Step {step + 1} of {STEPS.length}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Step Progress Bar */}
          <div className="flex gap-2">
            {STEPS.map((label, i) => (
              <div key={i} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-green-500' : 'bg-gray-100'}`} />
                <p className={`text-[10px] font-black uppercase mt-1.5 tracking-wider ${i === step ? 'text-green-600' : 'text-gray-300'}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FORM BODY */}
        <div className="flex-grow overflow-y-auto px-8 py-6">

          {/* STEP 1 — Crop Info */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Crop Type</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maize"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Variety</label>
                <input
                  required
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  placeholder="e.g. Hybrid H624"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
                />
              </div>

              {/* Image preview */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Crop Photo</label>
                <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer">
                  <img src={formData.img} alt="crop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-bold text-gray-700">
                      <Image size={14} /> Change Photo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Location & Size */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-gray-300" size={18} />
                  <input
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Sector / Plot name"
                    className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Field Size</label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-4 text-gray-300" size={18} />
                  <input
                    required
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="e.g. 2.5 hectares"
                    className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Info card */}
              <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4">
                <MapPin className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                  Your plot will be mapped using satellite data. Make sure the location name matches your registered farm zone.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3 — Schedule */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Planting Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-gray-300" size={18} />
                  <input
                    required
                    type="date"
                    name="plantingDate"
                    value={formData.plantingDate}
                    onChange={handleChange}
                    className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Expected Harvest Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-gray-300" size={18} />
                  <input
                    required
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Summary card */}
              <div className="p-5 bg-green-50 rounded-3xl border border-green-100 space-y-3">
                <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Summary</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-gray-400 font-bold">Crop</p><p className="font-black text-gray-800">{formData.name || '—'}</p></div>
                  <div><p className="text-gray-400 font-bold">Variety</p><p className="font-black text-gray-800">{formData.variety || '—'}</p></div>
                  <div><p className="text-gray-400 font-bold">Location</p><p className="font-black text-gray-800">{formData.location || '—'}</p></div>
                  <div><p className="text-gray-400 font-bold">Size</p><p className="font-black text-gray-800">{formData.size || '—'}</p></div>
                </div>
              </div>

              <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                <Leaf className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                  Registration will trigger automatic satellite monitoring for your selected plot.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="px-8 py-6 border-t border-gray-100 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-500 hover:bg-gray-50 transition-all text-sm"
            >
              Back
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 0 && (!formData.name || !formData.variety)) ||
                (step === 1 && (!formData.location || !formData.size))
              }
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.plantingDate || !formData.harvestDate}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2 text-sm"
            >
              Complete Registration <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterCrop;