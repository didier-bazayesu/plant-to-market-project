import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, User, Phone, MapPin, ArrowRight, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { RWANDA_DISTRICTS } from '../helper/helpFunction';

const STEPS = ['Personal Info', 'Farm Details', 'Security'];


const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', district: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => { setError(''); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextDisabled =
    (step === 0 && (!formData.name || !formData.email)) ||
    (step === 1 && (!formData.phone || !formData.district)) ||
    (step === 2 && (!formData.password || !formData.confirmPassword));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-100 p-2 rounded-2xl">
            <Sprout className="text-green-600" size={22} />
          </div>
          <span className="text-gray-900 font-black text-xl">PlantToMarket</span>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-1">Create account</h1>
        <p className="text-sm text-gray-400 font-medium mb-8">Start managing your farm today</p>

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">

          {/* Step Progress */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex gap-2">
              {STEPS.map((label, i) => (
                <div key={i} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-green-500' : 'bg-gray-100'}`} />
                  <p className={`text-[10px] font-black uppercase mt-1.5 tracking-wider ${i === step ? 'text-green-600' : 'text-gray-300'}`}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 py-6">
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
                ⚠ {error}
              </div>
            )}

            {/* STEP 1 — Personal Info */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jean Pierre"
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — Farm Details */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+250 7XX XXX XXX"
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">District</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-300 pointer-events-none" size={16} />
                    <select
                      required
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select your district</option>

                      <optgroup label="── Kigali City">
                        {['Gasabo', 'Kicukiro', 'Nyarugenge'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </optgroup>

                      <optgroup label="── Northern Province">
                        {['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </optgroup>

                      <optgroup label="── Southern Province">
                        {['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </optgroup>

                      <optgroup label="── Eastern Province">
                        {['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </optgroup>

                      <optgroup label="── Western Province">
                        {['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rutsiro', 'Rusizi'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </optgroup>
                    </select>

                    {/* Custom chevron */}
                    <div className="absolute right-4 top-4 pointer-events-none">
                      <ChevronRight size={16} className="text-gray-300 rotate-90" />
                    </div>
                  </div>

                  {/* Selected district badge */}
                  {formData.district && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-1.5 flex items-center gap-2">
                        <MapPin size={12} className="text-green-600" />
                        <span className="text-xs font-black text-green-700">{formData.district}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 — Security */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full p-4 pl-11 pr-12 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-300 hover:text-gray-500"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-300" size={16} />
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 space-y-2">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Account Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><p className="text-gray-400 font-bold">Name</p><p className="font-black text-gray-800">{formData.name}</p></div>
                    <div><p className="text-gray-400 font-bold">Email</p><p className="font-black text-gray-800 truncate">{formData.email}</p></div>
                    <div><p className="text-gray-400 font-bold">Phone</p><p className="font-black text-gray-800">{formData.phone}</p></div>
                    <div><p className="text-gray-400 font-bold">District</p><p className="font-black text-gray-800">{formData.district}</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex gap-3">
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
                disabled={nextDisabled}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || nextDisabled}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <> Create Account <ArrowRight size={16} /> </>
                }
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-black hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;