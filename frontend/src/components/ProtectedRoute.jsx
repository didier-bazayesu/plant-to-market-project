import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { farmer, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <div className="bg-green-100 p-4 rounded-3xl">
          <Sprout className="text-green-600 animate-pulse" size={32} />
        </div>
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400">Loading your farm...</p>
      </div>
    );
  }

  return farmer ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;