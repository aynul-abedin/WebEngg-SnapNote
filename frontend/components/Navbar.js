import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration layers */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute -top-2 -left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute -bottom-2 -right-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo with enhanced styling */}
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 hover:from-yellow-200 hover:to-pink-200 transition-all duration-300 flex items-center space-x-2">
            <span className="text-2xl">✨</span>
            <span>SnapNote</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* Navigation links with animated underlines */}
                <Link href="/" className="relative group">
                  <span className="hover:text-yellow-200 transition-colors duration-200 font-medium">🏠 Home</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                <Link href="/my-notes" className="relative group">
                  <span className="hover:text-yellow-200 transition-colors duration-200 font-medium">📝 My Notes</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                <Link href="/create" className="relative group">
                  <span className="hover:text-yellow-200 transition-colors duration-200 font-medium">✍️ Create Note</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </Link>

                <Link href="/profile" className="relative group">
                  <span className="hover:text-yellow-200 transition-colors duration-200 font-medium">👤 Profile</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                {/* User profile section with glassmorphism */}
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 shadow-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-yellow-100 font-medium">Hi, {user.username}!</span>
                </div>
                
                {/* Enhanced logout button */}
                <button
                  onClick={handleLogout}
                  className="group bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-4 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span className="group-hover:rotate-12 transition-transform duration-200">🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login link */}
                <Link href="/login" className="relative group">
                  <span className="hover:text-yellow-200 transition-colors duration-200 font-medium flex items-center space-x-1">
                    <span>🔐</span>
                    <span>Login</span>
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                {/* Enhanced register button */}
                <Link href="/register" className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-6 py-2 rounded-full font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <span className="group-hover:rotate-12 transition-transform duration-200">🌟</span>
                  <span>Join Now</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </nav>
  );
};

export default Navbar;