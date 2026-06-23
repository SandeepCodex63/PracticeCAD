import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-900 dark:text-gray-100 bg-mesh">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-brand-500/10 border-t-brand-500 animate-spin" />
          <Loader2 className="w-6 h-6 text-brand-400 absolute animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-semibold text-gray-400 tracking-widest uppercase">
          Initializing Session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
