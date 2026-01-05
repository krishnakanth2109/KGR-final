import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, 
  Save, ShieldCheck, Calendar, Hash, 
  Briefcase, CheckCircle, Users // Added Users import
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// API Configuration
const API_URL = 'http://localhost:5000/api/students';

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // --- State: Student Data ---
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    dob: '',
    gender: '',
    category: '',
    admission_number: '',
    program: '',
    admission_year: '',
    status: ''
  });

  // --- State: Password ---
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // --- Helper: Get Auth Headers ---
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('student-token');
    return { 
      'x-auth-token': token, // FIX: Matches backend middleware expectation
      'Content-Type': 'application/json'
    };
  };

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: getAuthHeaders()
        });

        const data = response.data.student || response.data;

        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
          gender: data.gender || '',
          category: data.category || '',
          admission_number: data.admission_number || '',
          program: data.program || '',
          admission_year: data.admission_year || '',
          status: data.status || 'Active'
        });

      } catch (error) {
        console.error("Profile Fetch Error:", error);
        if (error.response?.status === 401) {
            toast.error("Session expired. Please login again.");
        } else {
            toast.error("Failed to load profile data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone_number: formData.phone_number,
      dob: formData.dob,
      gender: formData.gender,
      category: formData.category
    };

    try {
      await axios.put(`${API_URL}/profile`, payload, {
        headers: getAuthHeaders()
      });
      
      toast.success("Profile updated successfully!");
      
      const currentUser = JSON.parse(sessionStorage.getItem('student-user') || '{}');
      sessionStorage.setItem('student-user', JSON.stringify({ 
        ...currentUser, 
        name: `${formData.first_name} ${formData.last_name}` 
      }));

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setSubmitting(true);
    try {
      await axios.put(`${API_URL}/change-password`, {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      }, {
        headers: getAuthHeaders()
      });
      
      toast.success("Password changed successfully!");
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p className="text-amber-500 font-medium animate-pulse">Loading Profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-10 animate-fadeIn">
      <Toaster position="top-right" toastOptions={{ 
        style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
        success: { iconTheme: { primary: '#f59e0b', secondary: '#fff' } }
      }} />

      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="relative mb-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 p-1 shadow-lg shadow-amber-500/20">
                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-4xl font-bold text-amber-500 uppercase">
                  {formData.first_name.charAt(0)}
                </div>
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 h-5 w-5 rounded-full border-4 border-slate-900"></div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {formData.first_name} {formData.last_name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 w-fit mx-auto md:mx-0">
                  {formData.status} Student
                </span>
              </div>
              
              <p className="text-slate-400 mb-4 flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {formData.email}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Badge icon={Hash} label={formData.admission_number} />
                <Badge icon={Briefcase} label={formData.program} />
                <Badge icon={Calendar} label={`Batch ${formData.admission_year}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <TabButton 
              id="personal" 
              label="Personal Details" 
              icon={User} 
              active={activeTab} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="security" 
              label="Security" 
              icon={ShieldCheck} 
              active={activeTab} 
              onClick={setActiveTab} 
            />
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl min-h-[500px]">
              
              {activeTab === 'personal' && (
                <form onSubmit={handleProfileUpdate} className="space-y-6 animate-fadeIn">
                  <SectionHeader title="Personal Information" subtitle="Update your basic profile details" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} icon={User} />
                    <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} icon={User} />
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} icon={Mail} disabled={true} />
                    <InputField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} icon={Phone} />
                    
                    <div className="space-y-2">
                      <Label text="Date of Birth" icon={Calendar} />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all [color-scheme:dark]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label text="Gender" icon={User} />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label text="Category" icon={Users} />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="">Select Category</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                    </div>
                  </div>
                  <SaveButton submitting={submitting} />
                </form>
              )}

              {activeTab === 'security' && (
                <div className="max-w-lg animate-fadeIn">
                  <SectionHeader title="Security Settings" subtitle="Update your password to keep account safe" />
                  
                  <form onSubmit={handlePasswordChange} className="space-y-5 mt-6">
                    <div className="space-y-2">
                      <Label text="Current Password" icon={Lock} />
                      <div className="relative">
                        <input
                          type={showCurrentPass ? "text" : "password"}
                          value={passData.currentPassword}
                          onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-600"
                          placeholder="Enter current password"
                        />
                        <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-3.5 text-slate-500 hover:text-amber-400">
                          {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label text="New Password" icon={Lock} />
                      <div className="relative">
                        <input
                          type={showNewPass ? "text" : "password"}
                          value={passData.newPassword}
                          onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-600"
                          placeholder="Min 6 characters"
                        />
                        <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-3.5 text-slate-500 hover:text-amber-400">
                          {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label text="Confirm New Password" icon={Lock} />
                      <input
                        type="password"
                        value={passData.confirmPassword}
                        onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="Re-enter new password"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3.5 rounded-xl border border-slate-700 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submitting ? 'Updating...' : <><ShieldCheck size={18} /> Update Password</>}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const Badge = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs font-medium text-slate-300">
    <Icon size={14} className="text-amber-500" /> {label}
  </div>
);

const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 border font-medium
      ${active === id 
        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 border-transparent shadow-lg shadow-amber-500/20 scale-105' 
        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-amber-500/30 hover:text-amber-400'
      }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} /> {label}
    </div>
    {active === id && <div className="h-2 w-2 rounded-full bg-slate-900"></div>}
  </button>
);

const Label = ({ text, icon: Icon }) => (
  <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-1.5">
    {Icon && <Icon size={16} className="text-amber-500/80" />} {text}
  </label>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <p className="text-sm text-slate-500">{subtitle}</p>
  </div>
);

const InputField = ({ label, name, type = "text", value, onChange, icon: Icon, placeholder, disabled = false }) => (
  <div className="space-y-1">
    <Label text={label} icon={Icon} />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white 
        focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-600
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    />
  </div>
);

const SaveButton = ({ submitting }) => (
  <div className="flex justify-end pt-6 border-t border-slate-800 mt-6">
    <button
      type="submit"
      disabled={submitting}
      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 transform active:scale-95"
    >
      {submitting ? 'Saving...' : <><Save size={18} /> Save Changes</>}
    </button>
  </div>
);

export default StudentProfile;