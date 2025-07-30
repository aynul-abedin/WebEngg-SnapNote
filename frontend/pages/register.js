import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      login(response.data.token, response.data.user);
      router.push('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-emerald-500'];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength();
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4 relative overflow-hidden">
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="max-w-lg w-full relative z-10">
        {/* Main card with glassmorphism */}
        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">🌟</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Join SnapNote
            </h2>
            <p className="text-gray-600">Create your account and start sharing ideas</p>
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-600 mx-auto rounded-full mt-3"></div>
          </div>
          
          {/* Error message with enhanced styling */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center shadow-sm">
              <span className="mr-2 text-lg">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">
                👤 Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                  required
                  placeholder="Choose a unique username"
                />
                <span className="absolute left-4 top-3.5 text-gray-400 text-lg">👤</span>
              </div>
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                📧 Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                  required
                  placeholder="Enter your email address"
                />
                <span className="absolute left-4 top-3.5 text-gray-400 text-lg">📧</span>
              </div>
            </div>

            {/* Password field with strength indicator */}
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                  required
                  placeholder="Create a strong password"
                />
                <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔒</span>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{passwordStrength.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Use 8+ characters with uppercase, numbers, and symbols</p>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                🔐 Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm ${
                    formData.confirmPassword 
                      ? (passwordsMatch ? 'border-green-300 focus:ring-green-500' : 'border-red-300 focus:ring-red-500')
                      : 'border-gray-200 focus:ring-green-500'
                  }`}
                  required
                  placeholder="Confirm your password"
                />
                <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔐</span>
                {formData.confirmPassword && (
                  <span className={`absolute right-4 top-3.5 text-lg ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                    {passwordsMatch ? '✅' : '❌'}
                  </span>
                )}
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>🎉</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 font-semibold transition-colors duration-200 relative group"
              >
                Sign in here
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </div>

          {/* Benefits section */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-center text-sm text-gray-600">
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">🚀</span>
                <span>Quick Setup</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">✨</span>
                <span>Feature Rich</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">🌍</span>
                <span>Global Community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative message */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <span>🎉</span>
            <span>Join our growing community of creators</span>
            <span>🎉</span>
          </div>
        </div>
      </div>
    </div>
  );
}