import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // ✅ Get returned farmer for role-based redirect
      const loggedInFarmer = await login(formData.email, formData.password);

      // ✅ Redirect based on role
      if (loggedInFarmer.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      
      {/* LEFT PANEL — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 bg-white/10 rounded-full" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/20 p-2 rounded-2xl">
            <Sprout className="text-white" size={24} />
          </div>
          <span className="text-white font-black text-xl">PlantToMarket</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Grow smarter.<br />Sell better.
          </h2>
          <p className="text-green-100 text-lg font-medium leading-relaxed">
            Manage your entire farming cycle — from planting to market — all in one place.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: 'Active Farmers', value: '2,400+' },
              { label: 'Crops Tracked', value: '18,000+' },
              { label: 'Districts', value: '30' },
              { label: 'Market Price Updates', value: 'Daily' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <p className="text-white font-black text-2xl">{stat.value}</p>
                <p className="text-green-100 text-xs font-bold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-green-200 text-xs font-medium relative z-10">
          © 2025 PlantToMarket · Rwanda
        </p>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md ">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="bg-green-100 p-2 rounded-2xl">
              <Sprout className="text-green-600" size={22} />
            </div>
            <span className="text-gray-900 font-black text-xl">PlantToMarket</span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-400 font-medium mb-8">Sign in to your farm dashboard</p>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
              ⚠ {error}
            </div>
          )}

          {/* Hint box */}
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl space-y-1">
            <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Test Credentials</p>
            <p className="text-xs font-bold text-gray-600">
              Farmer: <span className="text-gray-900">didierbazayesu@gmail.com / didier123</span>
            </p>
            <p className="text-xs font-bold text-gray-600">
              Admin: <span className="text-gray-900">admin@farm.rw / admin123</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
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
                  className="absolute right-4 top-4 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-green-600 font-black hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <> Sign In <ArrowRight size={16} /> </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 font-medium mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-black hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;