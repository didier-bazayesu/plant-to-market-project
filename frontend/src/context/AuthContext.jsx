import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // --- HARDCODED MOCK DATA ---
  const MOCK_FARMER = {
    id: 1,
    name: 'didier bazayesu',
    email: 'didierbazayesu@gmail.com',
    phone: '+250 788 123 456',
    district: 'Musanze',
    role: 'farmer',
  };

  const MOCK_CREDENTIALS = {
    email: 'didierbazayesu@gmail.com',
    password: 'didier123',
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        // Try to fetch real data, if it fails, fallback to Mock
        const success = await fetchMe();
        if (!success) {
          console.log("Backend offline: Using Mock Farmer session");
          setFarmer(MOCK_FARMER);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return false;
      const data = await res.json();
      setFarmer(data);
      return true;
    } catch {
      return false; // Silently fail to trigger fallback
    }
  };

  const login = async (email, password) => {
    try {
      // 1. Attempt Real Login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setFarmer(data.farmer);
        return;
      }
    } catch (err) {
      console.warn("Auth API error: Switching to Mock Login check.");
    }

    // 2. FALLBACK: Check Hardcoded Credentials
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      const mockToken = "mock-jwt-token-12345";
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setFarmer(MOCK_FARMER);
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const register = async (formData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setFarmer(data.farmer);
    } catch {
      // Mock registration for testing
      const mockToken = "mock-jwt-token-12345";
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setFarmer({ ...formData, id: Date.now(), role: 'farmer' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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