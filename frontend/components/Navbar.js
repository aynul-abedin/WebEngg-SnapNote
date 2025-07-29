import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            SnapNote
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/" className="hover:text-blue-200">
                  Home
                </Link>
                <Link href="/my-notes" className="hover:text-blue-200">
                  My Notes
                </Link>
                <Link href="/create" className="hover:text-blue-200">
                  Create Note
                </Link>
                <span className="text-blue-200">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;