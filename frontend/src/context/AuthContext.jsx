import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// ─── MOCK USERS ───────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 1,
    name: 'Didier Bazayesu',
    email: 'didierbazayesu@gmail.com',
    password: 'didier123',
    phone: '+250 788 123 456',
    district: 'Musanze',
    role: 'farmer',
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@farm.rw',
    password: 'admin123',
    phone: '+250 788 000 000',
    district: 'Gasabo',
    role: 'admin',
  },
];
// ─────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        // Try real backend first
        const success = await fetchMe();
        if (!success) {
          // Fallback — restore farmer from localStorage
          const saved = localStorage.getItem('farmer');
          if (saved) {
            setFarmer(JSON.parse(saved));
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return false;
      const data = await res.json();
      setFarmer(data);
      return true;
    } catch {
      return false;
    }
  };

  const login = async (email, password) => {
    // 1. Try real backend
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('farmer', JSON.stringify(data.farmer));
        setToken(data.token);
        setFarmer(data.farmer);
        return data.farmer; // ✅ return for role-based redirect
      }
    } catch {
      console.warn('Backend offline — using mock login');
    }

    // 2. Fallback — mock login
    await new Promise((res) => setTimeout(res, 800)); // simulate delay

    const found = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (found) {
      const { password: _, ...farmerData } = found; // strip password
      const mockToken = 'mock-jwt-token-' + found.id;
      localStorage.setItem('token', mockToken);
      localStorage.setItem('farmer', JSON.stringify(farmerData));
      setToken(mockToken);
      setFarmer(farmerData);
      return farmerData; // ✅ return for role-based redirect
    }

    throw new Error('Invalid email or password');
  };

  const register = async (formData) => {
    // 1. Try real backend
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('farmer', JSON.stringify(data.farmer));
        setToken(data.token);
        setFarmer(data.farmer);
        return data.farmer;
      }
    } catch {
      console.warn('Backend offline — using mock register');
    }

    // 2. Fallback — mock register
    await new Promise((res) => setTimeout(res, 800));

    const newFarmer = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      district: formData.district,
      role: 'farmer',
    };
    const mockToken = 'mock-jwt-token-' + newFarmer.id;
    localStorage.setItem('token', mockToken);
    localStorage.setItem('farmer', JSON.stringify(newFarmer));
    setToken(mockToken);
    setFarmer(newFarmer);
    return newFarmer;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('farmer');
    setToken(null);
    setFarmer(null);
  };

  return (
    <AuthContext.Provider value={{ farmer, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);