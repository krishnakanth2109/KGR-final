import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, Clock, Award, Bell, Settings, 
  CreditCard, AlertTriangle, TrendingUp, User, Mail,
  Phone, MapPin, GraduationCap, DollarSign, CheckCircle2,
  XCircle, Loader2
} from 'lucide-react';

const StudentDashboard = () => {
  const student = JSON.parse(sessionStorage.getItem('student-user'));
  const token = sessionStorage.getItem('student-token');
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    student: null,
    fees: null,
    exams: [],
    announcements: []
  });
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile'); // 'profile' | 'password'
  
  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    phone_number: '',
    email: '',
    addresses: [
      { type: 'Current', address_line1: '', city: '', state: '', postal_code: '' }
    ]
  });
  
  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch Dashboard Data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch Student Details
      const studentRes = await fetch(`/api/students/${student.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      
      // Fetch Fees
      const feesRes = await fetch(`/api/fees/${student.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const feesData = await feesRes.json();
      
      // Fetch Exams
      const examsRes = await fetch(`/api/exams/${student.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const examsData = await examsRes.json();
      
      setDashboardData({
        student: studentData,
        fees: feesData,
        exams: examsData,
        announcements: generateAnnouncements(feesData, examsData)
      });
      
      // Initialize Profile Form
      setProfileForm({
        phone_number: studentData.phone_number || '',
        email: studentData.email || '',
        addresses: studentData.addresses?.length > 0 
          ? studentData.addresses 
          : [{ type: 'Current', address_line1: '', city: '', state: '', postal_code: '' }]
      });
      
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate Smart Announcements
  const generateAnnouncements = (fees, exams) => {
    const announcements = [];
    const today = new Date();
    
    // Fee Reminders
    if (fees?.payments) {
      const totalPaid = fees.payments.reduce((sum, p) => sum + p.amount, 0);
      const totalStructure = Object.values(fees.structure || {}).reduce((sum, year) => {
        return sum + Object.values(year || {}).reduce((s, v) => s + (v || 0), 0);
      }, 0);
      const balance = totalStructure - totalPaid;
      
      if (balance > 0) {
        announcements.push({
          id: 'fee-due',
          title: `₹${balance.toLocaleString()} Fee Balance Pending`,
          date: today.toLocaleDateString(),
          type: 'Fee',
          priority: 'high',
          icon: 'alert'
        });
      }
    }
    
    // Upcoming Exams (Next 7 Days)
    const upcomingExams = exams.filter(e => {
      const examDate = new Date(e.examDate);
      const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });
    
    upcomingExams.forEach(exam => {
      const examDate = new Date(exam.examDate);
      const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
      announcements.push({
        id: `exam-${exam._id}`,
        title: `${exam.subject} Exam ${daysLeft === 0 ? 'Today' : `in ${daysLeft} day(s)`}`,
        date: examDate.toLocaleDateString(),
        type: 'Exam',
        priority: daysLeft <= 2 ? 'high' : 'medium',
        icon: 'calendar'
      });
    });
    
    return announcements;
  };

  // Calculate Stats
  const calculateStats = () => {
    const { fees, exams, student: studentData } = dashboardData;
    
    // Attendance (Mock for now - can be replaced with real data)
    const attendance = 85;
    
    // Next Exam
    const upcomingExams = exams.filter(e => new Date(e.examDate) >= new Date())
      .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
    const nextExam = upcomingExams[0];
    
    // Fee Status
    let feeStatus = 'Paid';
    let feeColor = 'green';
    if (fees?.payments) {
      const totalPaid = fees.payments.reduce((sum, p) => sum + p.amount, 0);
      const totalStructure = Object.values(fees.structure || {}).reduce((sum, year) => {
        return sum + Object.values(year || {}).reduce((s, v) => s + (v || 0), 0);
      }, 0);
      const balance = totalStructure - totalPaid;
      
      if (balance > 0) {
        feeStatus = `₹${balance.toLocaleString()} Due`;
        feeColor = 'red';
      }
    }
    
    return { attendance, nextExam, feeStatus, feeColor };
  };

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        await fetchDashboardData();
        setTimeout(() => setShowSettings(false), 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: passwordForm.newPassword })
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowSettings(false), 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to change password.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
              Welcome back, {dashboardData.student?.first_name}! 👋
            </h1>
            <p className="text-amber-100 max-w-xl text-lg">
              {stats.nextExam 
                ? `You have an exam on ${new Date(stats.nextExam.examDate).toLocaleDateString()}`
                : 'No upcoming exams. Keep learning!'}
            </p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-4 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
            title="Settings"
          >
            <Settings size={28} className="text-white" />
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <BookOpen size={250} strokeWidth={1.5} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-500 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overall Attendance</p>
              <h3 className="text-4xl font-bold text-gray-800 mt-2">{stats.attendance}%</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <Clock size={28} />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full shadow-inner" 
                 style={{ width: `${stats.attendance}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Next Exam</p>
              <h3 className="text-xl font-bold text-gray-800 mt-2">
                {stats.nextExam?.subject || 'None'}
              </h3>
              {stats.nextExam && (
                <p className="text-sm text-blue-600 font-medium">
                  {new Date(stats.nextExam.examDate).toLocaleDateString()} at {stats.nextExam.startTime}
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Calendar size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-500 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Fees Status</p>
              <h3 className={`text-xl font-bold mt-2 text-${stats.feeColor}-600`}>
                {stats.feeStatus}
              </h3>
              <p className="text-sm text-gray-400">
                {stats.feeStatus === 'Paid' ? 'All clear!' : 'Payment pending'}
              </p>
            </div>
            <div className={`p-3 bg-${stats.feeColor === 'green' ? 'green' : 'red'}-50 rounded-lg text-${stats.feeColor === 'green' ? 'green' : 'red'}-600`}>
              {stats.feeColor === 'green' ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
            </div>
          </div>
        </div>
      </div>

      {/* Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements & Notifications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="text-amber-500" size={24} /> 
              Notifications & Alerts
            </h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {dashboardData.announcements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No new notifications</p>
            ) : (
              dashboardData.announcements.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-[1.02] ${
                    item.priority === 'high' 
                      ? 'bg-red-50 border-l-4 border-red-500' 
                      : 'bg-amber-50 border-l-4 border-amber-500'
                  }`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    item.priority === 'high' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    {item.icon === 'alert' ? (
                      <AlertTriangle className={item.priority === 'high' ? 'text-red-600' : 'text-amber-600'} size={24} />
                    ) : (
                      <Calendar className={item.priority === 'high' ? 'text-red-600' : 'text-amber-600'} size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.type === 'Fee' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Profile */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg border border-amber-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-amber-600" size={20} />
            My Profile
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {dashboardData.student?.first_name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {dashboardData.student?.first_name} {dashboardData.student?.last_name}
                </h3>
                <p className="text-sm text-gray-500">{dashboardData.student?.admission_number}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-amber-200">
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="text-amber-600" size={18} />
                <span className="text-gray-700">{dashboardData.student?.program}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="text-amber-600" size={18} />
                <span className="text-gray-700 truncate">{dashboardData.student?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="text-amber-600" size={18} />
                <span className="text-gray-700">{dashboardData.student?.phone_number}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setSettingsTab('profile')}
                className={`flex-1 py-3 font-semibold transition ${
                  settingsTab === 'profile'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setSettingsTab('password')}
                className={`flex-1 py-3 font-semibold transition ${
                  settingsTab === 'password'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Change Password
              </button>
            </div>
            
            {/* Message Display */}
            {message.text && (
              <div className={`m-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
            
            {/* Profile Tab */}
            {settingsTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone_number}
                    onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Address</label>
                  <input
                    type="text"
                    placeholder="Address Line"
                    value={profileForm.addresses[0]?.address_line1 || ''}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      addresses: [{
                        ...profileForm.addresses[0],
                        address_line1: e.target.value
                      }]
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={profileForm.addresses[0]?.city || ''}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        addresses: [{
                          ...profileForm.addresses[0],
                          city: e.target.value
                        }]
                      })}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={profileForm.addresses[0]?.state || ''}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        addresses: [{
                          ...profileForm.addresses[0],
                          state: e.target.value
                        }]
                      })}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="PIN"
                      value={profileForm.addresses[0]?.postal_code || ''}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        addresses: [{
                          ...profileForm.addresses[0],
                          postal_code: e.target.value
                        }]
                      })}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-lg font-bold hover:from-amber-600 hover:to-yellow-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                </button>
              </form>
            )}
            
            {/* Password Tab */}
            {settingsTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-lg font-bold hover:from-amber-600 hover:to-yellow-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;