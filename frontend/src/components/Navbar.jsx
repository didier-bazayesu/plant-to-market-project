import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { 
  User, Settings, ShoppingBag, LogOut, 
  ChevronDown, Activity, Tractor, Leaf 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Access auth state, logout, and loading from your context
  const { farmer, logout, loading } = useAuth(); 

  // Prevent UI flickering while the app checks for a stored token
  if (loading) {
    return <nav className="h-16 bg-white border-b border-gray-100 sticky top-0 z-50 animate-pulse" />;
  }

  const isAuthenticated = !!farmer;

  return (
    <nav className="bg-white border-b border-gray-100 py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      
      {/* Brand Logo */}
      <NavLink to="/" className="text-xl font-black text-green-600 flex items-center gap-2 shrink-0">
        <Leaf className="text-green-600" size={24} /> 
        <span className="hidden sm:block tracking-tighter">Plant2Market</span>
      </NavLink>

      {/* Main Navigation Links */}
      <div className="flex items-center space-x-4 font-bold text-sm text-gray-500">
        <NavLink 
          to="/about" 
          className={({isActive}) => isActive ? "text-green-600" : "hover:text-green-500 transition"}
        >
          About Us
        </NavLink>

        {/* Private Links - Only visible when logged in */}
        {isAuthenticated && (
          <>
            <NavLink 
              to="/activities" 
              className={({isActive}) => isActive ? "text-green-600 flex items-center gap-1" : "hover:text-green-500 transition flex items-center gap-1"}
            >
              <Activity size={16} /> Activity
            </NavLink>
            <NavLink 
              to="/farms" 
              className={({isActive}) => isActive ? "text-green-600 flex items-center gap-1" : "hover:text-green-500 transition flex items-center gap-1"}
            >
              <Tractor size={16} /> My Farm
            </NavLink>
            <NavLink 
              to="/crops" 
              className={({isActive}) => isActive ? "text-green-600" : "hover:text-green-500 transition"}
            >
              Inventory
            </NavLink>
          </>
        )}
      </div>

      {/* Right Side: Auth / User Dropdown */}
      <div className="relative ml-4">
        {isAuthenticated ? (
          <div className="flex items-center">
            {/* Overlay to close menu when clicking outside */}
            {isMenuOpen && (
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-20 flex items-center gap-1.5 p-1 pr-2 rounded-full bg-gray-50 hover:bg-gray-100 transition border border-gray-200"
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                {/* Generate Initials safely */}
                {farmer?.name ? farmer.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '??'}
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-150 origin-top-right">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs font-black text-gray-800 truncate">{farmer?.name || 'User'}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{farmer?.district || 'Rwanda'}</p>
                </div>

                <MenuLink icon={<User size={16}/>} label="Profile" />
                <MenuLink icon={<Settings size={16}/>} label="Settings" />
                <MenuLink icon={<ShoppingBag size={16}/>} label="Market" />
                
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition font-bold"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-green-700 transition">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

// Sub-component for Dropdown Items
const MenuLink = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-green-50 hover:text-green-700 transition font-bold"
  >
    <span className="text-gray-400">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Navbar;