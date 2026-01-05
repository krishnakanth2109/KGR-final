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
      
      const studentRes = await fetch(`/api/students/${student.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const studentData = await studentRes.json();
      
      const feesRes = await fetch(`/api/fees/${student.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const feesData = await feesRes.json();
      
      const examsRes = await fetch(`/api/exams/${student.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const examsData = await examsRes.json();
      
      setDashboardData({
        student: studentData,
        fees: feesData,
        exams: examsData,
        announcements: generateAnnouncements(feesData, examsData)
      });
      
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

  const generateAnnouncements = (fees, exams) => {
    const announcements = [];
    const today = new Date();
    
    if (fees?.payments) {
      const totalPaid = fees.payments.reduce((sum, p) => sum + p.amount, 0);
      const totalStructure = Object.values(fees.structure || {}).reduce((sum, year) => sum + Object.values(year || {}).reduce((s, v) => s + (v || 0), 0), 0);
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

  const calculateStats = () => {
    const { fees, exams } = dashboardData;
    const attendance = 85; 
    
    const upcomingExams = exams.filter(e => new Date(e.examDate) >= new Date()).sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
    const nextExam = upcomingExams[0];
    
    let feeStatus = 'Paid';
    let feeColor = 'green';
    if (fees?.payments) {
      const totalPaid = fees.payments.reduce((sum, p) => sum + p.amount, 0);
      const totalStructure = Object.values(fees.structure || {}).reduce((sum, year) => sum + Object.values(year || {}).reduce((s, v) => s + (v || 0), 0), 0);
      const balance = totalStructure - totalPaid;
      
      if (balance > 0) {
        feeStatus = `₹${balance.toLocaleString()} Due`;
        feeColor = 'amber';
      }
    }
    
    return { attendance, nextExam, feeStatus, feeColor };
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        await fetchDashboardData();
        setTimeout(() => setShowSettings(false), 2000);
      } else setMessage({ type: 'error', text: 'Failed to update profile.' });
    } catch { setMessage({ type: 'error', text: 'Network error occurred.' }); }
    finally { setSubmitting(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' }); return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ password: passwordForm.newPassword })
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setTimeout(() => setShowSettings(false), 2000);
      } else setMessage({ type: 'error', text: 'Failed to change password.' });
    } catch { setMessage({ type: 'error', text: 'Network error occurred.' }); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-amber-400" size={48} /></div>;

  const stats = calculateStats();

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-[#fdfdf9] min-h-screen">
      
      {/* Welcome Banner - Shiny Champagne Gold */}
      <div className="bg-gradient-to-r from-yellow-300 via-amber-100 to-yellow-50 rounded-2xl p-8 text-amber-900 shadow-xl shadow-amber-200/50 relative overflow-hidden border border-white/50">
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 drop-shadow-sm text-amber-900 tracking-tight">
              Welcome back, {dashboardData.student?.first_name}! 👋
            </h1>
            <p className="text-amber-800 font-medium text-lg">
              {stats.nextExam 
                ? `You have an exam on ${new Date(stats.nextExam.examDate).toLocaleDateString()}`
                : 'No upcoming exams. Keep learning!'}
            </p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 bg-white/60 hover:bg-white/90 rounded-full backdrop-blur-md transition-all shadow-md hover:shadow-lg border border-white/60 hover:scale-105"
            title="Settings"
          >
            <Settings size={26} className="text-amber-700" />
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10 text-amber-600 mix-blend-overlay">
          <BookOpen size={250} strokeWidth={1.5} />
        </div>
      </div>

      {/* Stats Grid - Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Attendance */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:border-emerald-200 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Attendance</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.attendance}%</h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-white rounded-xl shadow-sm text-emerald-600 border border-emerald-100"><Clock size={24} /></div>
          </div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2 shadow-inner">
            <div className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-2 rounded-full shadow-md" style={{ width: `${stats.attendance}%` }}></div>
          </div>
        </div>

        {/* Next Exam */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:border-blue-200 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Next Exam</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1 truncate max-w-[150px]">
                {stats.nextExam?.subject || 'None'}
              </h3>
              {stats.nextExam && (
                <p className="text-xs text-blue-600 font-bold mt-1 bg-blue-50 px-2 py-1 rounded-md inline-block border border-blue-100">
                  {new Date(stats.nextExam.examDate).toLocaleDateString()} • {stats.nextExam.startTime}
                </p>
              )}
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm text-blue-600 border border-blue-100"><Calendar size={24} /></div>
          </div>
        </div>

        {/* Fee Status */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:border-amber-200 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Fees Status</p>
              <h3 className={`text-xl font-black mt-1 ${stats.feeColor === 'green' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {stats.feeStatus}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {stats.feeStatus === 'Paid' ? 'No Dues Pending' : 'Action Required'}
              </p>
            </div>
            <div className={`p-3 rounded-xl shadow-sm border ${stats.feeColor === 'green' ? 'bg-gradient-to-br from-emerald-50 to-white text-emerald-600 border-emerald-100' : 'bg-gradient-to-br from-amber-50 to-white text-amber-600 border-amber-100'}`}>
              {stats.feeColor === 'green' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Notifications */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <div className="p-2 bg-yellow-100 rounded-lg text-amber-600"><Bell size={20} /></div> 
            Updates & Alerts
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
            {dashboardData.announcements.length === 0 ? (
              <p className="text-slate-400 text-center py-10 italic">No new notifications</p>
            ) : (
              dashboardData.announcements.map((item) => (
                <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-gradient-to-r hover:from-white hover:to-slate-50 ${
                    item.priority === 'high' ? 'border-l-4 border-l-red-400 bg-red-50/20' : 'border-l-4 border-l-amber-300 bg-yellow-50/30'
                }`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                    item.priority === 'high' ? 'bg-white text-red-500 border border-red-100' : 'bg-white text-amber-500 border border-amber-100'
                  }`}>
                    {item.icon === 'alert' ? <AlertTriangle size={18} /> : <Calendar size={18} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profile Card - Shiny Pearl Effect */}
        <div className="bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-amber-100/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
            <User className="text-amber-500" size={20} /> My Profile
          </h2>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-200 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-amber-200 border-2 border-white">
              {dashboardData.student?.first_name?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                {dashboardData.student?.first_name} {dashboardData.student?.last_name}
              </h3>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold rounded-md uppercase tracking-wider">
                {dashboardData.student?.admission_number}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-3 text-sm p-3 bg-white/80 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm">
              <GraduationCap className="text-amber-500" size={18} />
              <span className="font-medium text-slate-700">{dashboardData.student?.program || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 bg-white/80 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm">
              <Mail className="text-amber-500" size={18} />
              <span className="font-medium text-slate-700 truncate">{dashboardData.student?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 bg-white/80 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm">
              <Phone className="text-amber-500" size={18} />
              <span className="font-medium text-slate-700">{dashboardData.student?.phone_number || 'N/A'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Settings Modal - Shiny Gold Theme */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-white/50">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-300 p-5 flex justify-between items-center text-white shadow-md">
              <h2 className="text-xl font-bold flex items-center gap-2"><Settings size={20}/> Account Settings</h2>
              <button onClick={() => setShowSettings(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors"><XCircle/></button>
            </div>
            
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {['profile', 'password'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSettingsTab(tab)}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
                    settingsTab === tab ? 'text-amber-600 border-b-2 border-amber-500 bg-white shadow-sm' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'profile' ? 'Edit Profile' : 'Security'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {message.text && (
                <div className={`mb-4 p-3 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                  {message.text}
                </div>
              )}

              {settingsTab === 'profile' ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone</label>
                    <input type="tel" value={profileForm.phone_number} onChange={e => setProfileForm({...profileForm, phone_number: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all"/>
                  </div>
                  <button disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-amber-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Password</label>
                    <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirm Password</label>
                    <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all"/>
                  </div>
                  <button disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-amber-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;