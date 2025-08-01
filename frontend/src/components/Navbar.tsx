import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-md rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-4">
          <img src="Sheet2DBLogo.png" alt="Sheet2DB Logo" className="h-12 w-12 scale-[1.8] object-contain"/>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sheet2DB</h1>
            <p className="text-gray-500 text-sm">Import and export Excel data easily</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links & User Menu */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Authentication Links for non-authenticated users */}
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar