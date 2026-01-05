import React, { useState, useEffect } from 'react';
import api from '../../api/api'; // Ensure this points to your axios instance
import { User, Lock, Save, Shield, Mail, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminSettings = () => {
  // State for Profile Form
  const [profile, setProfile] = useState({ 
    name: '', 
    email: '' 
  });

  // State for Password Form
  const [passwords, setPasswords] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- 1. FETCH ADMIN PROFILE ON LOAD ---
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Ensure token exists before call (optional check, axios interceptor usually handles this)
      const token = localStorage.getItem('admin-token');
      if (!token) {
        setMessage({ type: 'error', text: 'No authentication token found. Please log in again.' });
        setLoading(false);
        return;
      }

      // API Call: GET /api/auth/me
      const res = await api.get('/auth/me');
      
      setProfile({ 
        name: res.data.name || 'Admin User', 
        email: res.data.email 
      });
      setLoading(false);

    } catch (error) {
      console.error("Error fetching profile", error);
      // Handle 401 specifically
      if (error.response && error.response.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please log out and log in again.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      }
      setLoading(false);
    }
  };

  // --- 2. UPDATE PROFILE HANDLER ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmittingProfile(true);
    setMessage({ type: '', text: '' });

    try {
      // API Call: PUT /api/auth/update-profile
      const res = await api.put('/auth/update-profile', {
        name: profile.name,
        email: profile.email
      });

      setMessage({ type: 'success', text: res.data.message || 'Profile updated successfully!' });
      
      // Update local state if backend returns updated data
      if(res.data.admin) {
          setProfile({
              name: res.data.admin.name,
              email: res.data.admin.email
          });
      }

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Failed to update profile.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmittingProfile(false);
    }
  };

  // --- 3. CHANGE PASSWORD HANDLER ---
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Client-side validation
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setSubmittingPassword(true);

    try {
      // API Call: PUT /api/auth/change-password
      const res = await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      setMessage({ type: 'success', text: res.data.message || 'Password changed successfully!' });
      
      // Clear password fields on success
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Failed to change password.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmittingPassword(false);
    }
  };

  // --- RENDER LOADING STATE ---
  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Shield className="text-blue-600" size={32} /> Admin Settings
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
            Manage your account details and update your security preferences.
        </p>
      </div>

      {/* Notification Message */}
      {message.text && (
        <div className={`p-4 mb-8 rounded-lg flex items-center gap-3 shadow-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20}/> : <AlertTriangle size={20}/>}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- FORM 1: PROFILE DETAILS --- */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
            <User size={22} className="text-blue-500"/> Profile Details
          </h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="Enter your email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
            </div>

            <button 
                type="submit" 
                disabled={submittingProfile}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-2 font-semibold shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submittingProfile ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} 
              {submittingProfile ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* --- FORM 2: CHANGE PASSWORD --- */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
            <Lock size={22} className="text-purple-500"/> Security Settings
          </h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Enter current password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Re-enter new password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                required
              />
            </div>

            <button 
                type="submit" 
                disabled={submittingPassword}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 active:scale-95 transition-all flex justify-center items-center gap-2 font-semibold shadow-lg shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submittingPassword ? <Loader2 className="animate-spin" size={20}/> : <Lock size={20} />} 
              {submittingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;