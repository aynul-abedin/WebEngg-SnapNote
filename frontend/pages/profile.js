import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatar) return null;
    
    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const response = await axios.post('/api/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (!response.data || !response.data.avatarUrl) {
        throw new Error('Invalid response from server');
      }
      
      return response.data.avatarUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response) {
        throw new Error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Failed to upload avatar: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaveLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSaveLoading(false);
      return;
    }

    try {
      let avatarUrl = null;
      if (avatar) {
        try {
          avatarUrl = await uploadAvatar();
        } catch (error) {
          setError('Failed to upload avatar. Profile update cancelled.');
          setSaveLoading(false);
          return;
        }
      }

      const updateData = {
        username: formData.username,
        email: formData.email,
        ...(avatarUrl && { avatar: avatarUrl }),
        ...(formData.currentPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      };

      await axios.put('/api/profile', updateData);
      setSuccess('Profile updated successfully');
      setEditing(false);
      setAvatar(null);
      setAvatarPreview('');
      fetchProfile();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-medium text-gray-700">Loading your profile...</div>
          <div className="text-gray-500 mt-2">Please wait while we fetch your information</div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold flex items-center space-x-3 mb-2">
                <span className="text-5xl">👤</span>
                <span>Profile Settings</span>
              </h1>
              <p className="text-blue-100 text-lg">Manage your account information and preferences</p>
            </div>
          </div>

          <div className="p-8">
            {/* Alert Messages */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center animate-fadeIn">
                <span className="text-2xl mr-3">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center animate-fadeIn">
                <span className="text-2xl mr-3">✅</span>
                <span className="font-medium">{success}</span>
              </div>
            )}

            {!editing ? (
              /* View Mode */
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
                  <div className="relative group">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 p-1 shadow-2xl">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        {profile.avatar ? (
                          <Image
                            src={profile.avatar}
                            alt="Profile"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 text-5xl font-bold">
                            {profile.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">✓</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{profile.username}</h2>
                    <p className="text-gray-600 text-lg mb-4 flex items-center justify-center md:justify-start space-x-2">
                      <span>📧</span>
                      <span>{profile.email}</span>
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                        <span className="mr-1">🎯</span>
                        Active User
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                        <span className="mr-1">✅</span>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">👤</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Username</h3>
                    </div>
                    <p className="text-gray-600 text-xl font-medium">{profile.username}</p>
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">📧</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Email Address</h3>
                    </div>
                    <p className="text-gray-600 text-xl font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-3"
                  >
                    <span>✏️</span>
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                    <span>🖼️</span>
                    <span>Profile Picture</span>
                  </h3>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative group">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 p-1 shadow-2xl">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                          {(avatarPreview || profile.avatar) ? (
                            <Image
                              src={avatarPreview || profile.avatar}
                              alt="Profile"
                              layout="fill"
                              objectFit="cover"
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 text-5xl font-bold">
                              {profile.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      {avatarPreview && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
                      >
                        <span>📷</span>
                        <span>Change Picture</span>
                      </button>
                      
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatar(null);
                            setAvatarPreview('');
                            fileInputRef.current.value = '';
                          }}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
                        >
                          <span>🗑️</span>
                          <span>Remove</span>
                        </button>
                      )}
                      
                      <p className="text-sm text-gray-600 text-center md:text-left">
                        Maximum file size: 5MB<br />
                        Supported formats: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                    <span>📝</span>
                    <span>Basic Information</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        👤 Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        required
                        placeholder="Enter your username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        📧 Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Change Password (Optional)</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        🔐 Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          🆕 New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          ✅ Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700 flex items-center space-x-2">
                        <span>💡</span>
                        <span>Leave password fields empty if you don't want to change your password.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-3"
                  >
                    {saveLoading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setAvatar(null);
                      setAvatarPreview('');
                      setFormData({
                        username: profile.username,
                        email: profile.email,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setError('');
                      setSuccess('');
                    }}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                  >
                    <span>❌</span>
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}