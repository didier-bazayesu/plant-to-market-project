import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { 
  User, Settings, ShoppingBag, LogOut, 
  ChevronDown, Activity, Tractor, Leaf,
  Sprout, LayoutDashboard, Users, BarChart2,
  Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { farmer, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <nav className="h-16 bg-white border-b border-gray-100 sticky top-0 z-50 animate-pulse" />;
  }

  const isAuthenticated = !!farmer;
  const isAdmin = farmer?.role === 'admin';

  // ─── NAV LINKS based on role ──────────────────────────────
  const farmerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    // { to: '/activities', label: 'Activity', icon: <Activity size={16} /> },
    { to: '/my-farms', label: 'My Farms', icon: <Tractor size={16} /> },
    { to: '/my-crops', label: 'My Crops', icon: <Sprout size={16} /> },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/admin/farmers', label: 'Farmers', icon: <Users size={16} /> },
  ];

  const publicLinks = [
    { to: '/about', label: 'About Us', icon: null },
  ];

  const navLinks = isAdmin ? adminLinks : isAuthenticated ? farmerLinks : [];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsMobileOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-bold transition-all px-3 py-1.5 rounded-xl ${
      isActive
        ? 'text-green-600 bg-green-50'
        : 'text-gray-500 hover:text-green-600 hover:bg-gray-50'
    }`;

  return (
    <>
      <nav className="bg-white border-b border-gray-100 py-3 px-6 flex justify-between items-center sticky top-0 z-50">

        {/* LOGO */}
        <NavLink
          to={isAdmin ? '/admin' : isAuthenticated ? '/dashboard' : '/'}
          className="text-xl font-black text-green-600 flex items-center gap-2 shrink-0"
        >
          <Leaf className="text-green-600" size={24} />
          <span className="hidden sm:block tracking-tighter">Plant2Market</span>
          {isAdmin && (
            <span className="hidden sm:block text-[10px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
              Admin
            </span>
          )}
        </NavLink>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-1">
          {/* Public links always visible */}
          {publicLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          {/* Role-based links */}
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.icon} {link.label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {isAuthenticated ? (
            <div className="relative">
              {/* Backdrop */}
              {isMenuOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
              )}

              {/* Avatar button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative z-20 flex items-center gap-2 p-1 pr-3 rounded-full bg-gray-50 hover:bg-gray-100 transition border border-gray-200"
              >
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-black uppercase">
                  {farmer?.name
                    ? farmer.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                    : '??'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-gray-800 leading-tight">
                    {farmer?.name?.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold capitalize">
                    {farmer?.role}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 z-20 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 origin-top-right">
                  {/* Farmer info */}
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-sm font-black text-gray-900 truncate">{farmer?.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                      {farmer?.district}, Rwanda
                    </p>
                    <span className={`inline-block mt-1.5 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      isAdmin
                        ? 'bg-purple-50 text-purple-600'
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {farmer?.role}
                    </span>
                  </div>

                  <MenuLink icon={<User size={15} />} label="Profile" onClick={() => setIsMenuOpen(false)} />
                  <MenuLink icon={<Settings size={15} />} label="Settings" onClick={() => setIsMenuOpen(false)} />
                  <MenuLink icon={<ShoppingBag size={15} />} label="Marketplace" onClick={() => setIsMenuOpen(false)} />
                  {isAdmin && (
                    <MenuLink icon={<BarChart2 size={15} />} label="Analytics" onClick={() => setIsMenuOpen(false)} />
                  )}

                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition font-bold rounded-xl mx-auto"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-green-700 transition"
            >
              Login
            </NavLink>
          )}

          {/* MOBILE hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition text-gray-500"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-1 sticky top-16 z-40 shadow-lg">
          {publicLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileOpen(false)}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileOpen(false)}
              className={linkClass}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition font-bold rounded-xl mt-2"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      )}
    </>
  );
};

const MenuLink = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-green-50 hover:text-green-700 transition font-bold"
  >
    <span className="text-gray-400">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Navbar;