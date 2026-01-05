import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; 
import NotificationPanel from "./NotificationPanel";

import {
  Users,
  UserCog,
  LogOut,
  IndianRupee,
  FileText,
  GraduationCap,
  UsersIcon,
  TrendingUp,
  TrendingDown,
  CreditCard,
  BookOpen,
  Bell,
  Loader2,
  AlertCircle // <--- FIXED: Added missing import
} from "lucide-react";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Stats State
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeFaculty: 0,
    pendingQueries: 0,
    totalRevenue: 0,
    courseEnrollments: 0,
    pendingApplications: 0
  });

  // Chart Data States
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [feeCollectionData, setFeeCollectionData] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch all required data in parallel
      // We wrap promise.all in a try-catch to handle individual failures gracefully if needed
      const [
        studentsRes,
        facultyRes,
        contactRes,
        feesRes, 
        applicationsRes
      ] = await Promise.all([
        api.get('/students'),
        api.get('/faculty'),
        api.get('/contact'),
        api.get('/student-fees/reports/defaulters'), 
        api.get('/admissions')
      ]);

      const students = studentsRes.data?.students || [];
      const faculty = facultyRes.data?.faculty || [];
      const messages = contactRes.data || [];
      // Handle array or object response for fees
      const fees = Array.isArray(feesRes.data) ? feesRes.data : []; 
      const applications = Array.isArray(applicationsRes.data) ? applicationsRes.data : [];

      // 2. Calculate Top-Level Stats
      const totalRevenue = fees.reduce((acc, curr) => acc + (curr.totalPaid || 0), 0);
      
      setStats({
        totalStudents: students.length,
        activeFaculty: faculty.filter(f => f.status === 'Active').length,
        pendingQueries: messages.length,
        totalRevenue: totalRevenue,
        courseEnrollments: students.length,
        pendingApplications: applications.filter(a => a.status === 'Pending').length
      });

      // 3. Process Data for Charts
      setEnrollmentData(processEnrollmentData(students));
      setCourseDistribution(processCourseDistribution(students));
      setPaymentStatusData(processPaymentStatus(fees));
      setFeeCollectionData(processFeeCollection(fees));
      
      // Extract Recent Transactions
      const allTransactions = fees.flatMap(f => 
        (f.transactions || []).map(t => ({
          ...t,
          studentName: f.student?.first_name || 'Student',
          admissionNumber: f.student?.admission_number
        }))
      );
      // Sort by date descending and take top 5
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTransactions(allTransactions.slice(0, 5));

      // Mocking Performance Data (Placeholder)
      setStudentPerformance(generateMockPerformance());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // If 401, the api.js interceptor might redirect, but if not, we can handle it here:
      if (error.response && error.response.status === 401) {
         // Optionally redirect manually if interceptor doesn't
         // navigate('/login/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- DATA PROCESSING HELPERS ---

  const processEnrollmentData = (students) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(m => ({ month: m, students: 0 }));
    
    students.forEach(s => {
      if (s.createdAt) {
        const date = new Date(s.createdAt);
        const monthIdx = date.getMonth();
        data[monthIdx].students += 1;
      }
    });
    return data;
  };

  const processCourseDistribution = (students) => {
    const counts = {};
    students.forEach(s => {
      const course = s.course_type || 'Unknown';
      counts[course] = (counts[course] || 0) + 1;
    });
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
    return Object.keys(counts).map((key, i) => ({
      name: key,
      value: counts[key],
      color: colors[i % colors.length]
    }));
  };

  const processPaymentStatus = (fees) => {
    const statusCounts = { Paid: 0, Partial: 0, Pending: 0, Overdue: 0 };
    fees.forEach(f => {
      const status = f.paymentStatus || 'Pending';
      if (statusCounts[status] !== undefined) statusCounts[status]++;
    });
    return Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
  };

  const processFeeCollection = (fees) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(m => ({ month: m, collected: 0, pending: 0 }));

    fees.forEach(f => {
      if (f.transactions) {
        f.transactions.forEach(t => {
          const mIdx = new Date(t.date).getMonth();
          data[mIdx].collected += t.amount;
        });
      }
      const pending = (f.totalPayable - f.discount) - f.totalPaid;
      if (pending > 0) {
        const currentMonthIdx = new Date().getMonth();
        data[currentMonthIdx].pending += pending;
      }
    });
    return data.filter(d => d.collected > 0 || d.pending > 0);
  };

  const generateMockPerformance = () => {
    const subjects = ['Anatomy', 'Physiology', 'Pharmacology', 'Pathology', 'Microbiology'];
    return subjects.map(subject => ({
      subject,
      averageScore: Math.floor(Math.random() * 20) + 75,
      attendance: Math.floor(Math.random() * 15) + 80
    }));
  };

  const getRandomColor = () => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'addStudent': navigate('/admin/students'); break;
      case 'addFaculty': navigate('/admin/faculty'); break;
      case 'feeStructure': navigate('/admin/fees/structure'); break;
      case 'viewReports': navigate('/admin/fees/reports'); break;
      case 'manageCourses': navigate('/admin/courses'); break;
      case 'viewApplications': navigate('/admin/admissions'); break;
      case 'gallery': navigate('/admin/gallery'); break;
      case 'sendNotification': alert("Notification feature coming soon."); break;
      default: break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    navigate('/login/admin');
  };

  const quickActions = [
    { id: 'addStudent', label: 'Add Student', icon: Users, color: 'bg-blue-500' },
    { id: 'addFaculty', label: 'Add Faculty', icon: UserCog, color: 'bg-purple-500' },
    { id: 'feeStructure', label: 'Fee Structure', icon: IndianRupee, color: 'bg-emerald-500' },
    { id: 'viewReports', label: 'View Reports', icon: FileText, color: 'bg-amber-500' },
    { id: 'manageCourses', label: 'Manage Courses', icon: BookOpen, color: 'bg-indigo-500' },
    { id: 'viewApplications', label: 'Applications', icon: GraduationCap, color: 'bg-pink-500' },
    { id: 'gallery', label: 'Gallery', icon: UsersIcon, color: 'bg-cyan-500' },
    { id: 'sendNotification', label: 'Send Notification', icon: Bell, color: 'bg-red-500' }
  ];

  const statusColors = {
    Paid: 'bg-emerald-100 text-emerald-800',
    Partial: 'bg-amber-100 text-amber-800',
    Pending: 'bg-blue-100 text-blue-800',
    Overdue: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading KGR Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-800">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Overview of KGR College Operations</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationPanel />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-sm font-bold shadow-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Students',
              value: stats.totalStudents,
              change: 'Active Records',
              trend: 'up',
              icon: Users,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              link: '/admin/students'
            },
            {
              title: 'Active Faculty',
              value: stats.activeFaculty,
              change: 'Teaching Staff',
              trend: 'up',
              icon: UserCog,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              link: '/admin/faculty'
            },
            {
              title: 'Total Revenue',
              value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
              change: 'Fee Collected',
              trend: 'up',
              icon: IndianRupee,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              link: '/admin/fees/reports'
            },
            {
              title: 'Pending Applications',
              value: stats.pendingApplications,
              change: 'Needs Review',
              trend: 'down',
              icon: GraduationCap,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              link: '/admin/admissions'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(stat.link)}
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 ${stat.bg} rounded-2xl shadow-inner`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-slate-50 ${stat.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp size={14} /> : <AlertCircle size={14} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-800 mt-5">{stat.value}</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* --- CHARTS ROW 1 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollment Chart */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-800">Enrollment Trend (2025)</h3>
              <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
                <span className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg text-slate-800">Monthly</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={3} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fee Collection Chart */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Revenue Analytics</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeCollectionData} barGap={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                     cursor={{fill: 'transparent'}}
                     contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                     formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}}/>
                  <Bar dataKey="collected" name="Collected" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="pending" name="Pending" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- CHARTS ROW 2 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Distribution */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Student Distribution</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium uppercase tracking-wide">By Department</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Performance Radar */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Academic Overview</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium uppercase tracking-wide">Performance Metrics (Avg)</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={studentPerformance}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#64748B'}} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="averageScore" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Payment Status</h3>
            <div className="space-y-5">
              {paymentStatusData.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-10">No fee records found.</p>
              ) : (
                paymentStatusData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: getRandomColor() }}
                      />
                      <span className="text-sm font-bold text-slate-600">{status.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${(status.value / (paymentStatusData.reduce((a, b) => a + b.value, 0) || 1)) * 100}%`,
                            backgroundColor: getRandomColor()
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{status.value}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* --- BOTTOM ROW: QUICK ACTIONS & TRANSACTIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Navigation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="flex flex-col items-center p-5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group hover:-translate-y-1 border border-transparent hover:border-slate-200"
                >
                  <div className={`p-4 ${action.color} rounded-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform text-white`}>
                    <action.icon size={22} />
                  </div>
                  <span className="text-sm font-bold text-slate-600">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-100/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                            <IndianRupee size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">{transaction.studentName || 'Student'}</p>
                            <p className="text-xs text-slate-500 font-medium">#{transaction.transactionId?.slice(-6) || '---'} • {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-800">₹{transaction.amount?.toLocaleString('en-IN')}</p>
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md ${statusColors[transaction.status] || 'bg-white text-slate-500 border border-slate-200'}`}>
                        {transaction.mode || 'Paid'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No recent transactions</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;