import React, { useState, useEffect } from 'react';
import { 
  DollarSign, AlertCircle, Users, CheckCircle, Loader2, 
  Search, Phone, Mail, Filter, TrendingUp, Download, Eye,
  BookOpen, Calendar, X, CreditCard, User, FileText, BadgeCheck
} from 'lucide-react';
import * as XLSX from 'xlsx'; 
import { getFeeDashboardStats, getFeeDefaulters } from '../../../api/feeApi';
import api from '../../../api/api'; 

const FeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  // Filters
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Selected Student for Modal
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- EXPORT ---
  const handleExport = (dataToExport) => {
    if (!dataToExport || dataToExport.length === 0) return alert("No data to export");
    const exportData = dataToExport.map(item => ({
        "Admission No": item.student?.admission_number,
        "Student Name": `${item.student?.first_name} ${item.student?.last_name || ''}`,
        "Total Fee": item.totalPayable,
        "Paid Amount": item.totalPaid,
        "Due Amount": item.dueAmount,
        "Status": item.dueAmount > 0 ? 'Pending' : 'Paid'
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fee_Report");
    XLSX.writeFile(wb, `Fee_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-10 font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fee Management Dashboard</h1>
           <p className="text-slate-500 mt-2 text-lg font-medium">Real-time financial overview and student fee status.</p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0 flex-wrap">
           {/* Course Icons Filter */}
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button onClick={() => setCourseFilter('')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${courseFilter === '' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>
                 <Users size={16}/> All
              </button>
              <button onClick={() => setCourseFilter('GNM')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${courseFilter === 'GNM' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:bg-purple-50'}`}>
                 <BookOpen size={16}/> GNM
              </button>
              <button onClick={() => setCourseFilter('Vocational')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${courseFilter === 'Vocational' ? 'bg-amber-500 text-white shadow' : 'text-slate-500 hover:bg-amber-50'}`}>
                 <BookOpen size={16}/> Vocational
              </button>
           </div>

           <div className="relative group">
               <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18}/>
               <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 text-sm shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                  <option value="">All Years</option><option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option>
               </select>
           </div>
           
           <button onClick={() => handleExport()} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition flex items-center gap-2 text-sm">
              <Download size={18}/> Export
           </button>
        </div>
      </div>

      {/* Overview */}
      <section className="animate-fade-in-up">
         <OverviewSection stats={stats} loading={loadingStats} setStats={setStats} setLoading={setLoadingStats} activeFilter={activeFilter} setActiveFilter={setActiveFilter}/>
      </section>

      {/* Main Table */}
      <section className="animate-fade-in-up delay-100">
        <FilteredStudentTable 
            filterType={activeFilter} 
            courseFilter={courseFilter}
            yearFilter={yearFilter}
            onExport={handleExport}
            onView={(student) => setSelectedStudent(student)} // Open Modal
        />
      </section>

      {/* Student Detail Modal */}
      {selectedStudent && (
          <StudentDetailsModal 
              data={selectedStudent} 
              onClose={() => setSelectedStudent(null)} 
          />
      )}

    </div>
  );
};

/* --- 1. OVERVIEW SECTION --- */
const OverviewSection = ({ stats, loading, setStats, setLoading, activeFilter, setActiveFilter }) => {
  useEffect(() => {
    getFeeDashboardStats().then(data => setStats(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-32 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32}/></div>;

  const Card = ({ title, value, icon: Icon, colorClass, bgClass, filterKey, subText }) => (
    <div onClick={() => setActiveFilter(filterKey)} className={`p-6 rounded-[1.5rem] shadow-sm border transition-all duration-300 cursor-pointer group relative overflow-hidden ${activeFilter === filterKey ? `ring-2 ring-offset-2 ${colorClass.replace('text-', 'ring-')}` : 'hover:shadow-lg border-gray-100 bg-white'}`}>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 shadow-sm ${bgClass} ${colorClass}`}><Icon size={24}/></div>
            {activeFilter === filterKey && <span className={`absolute top-1 right-1 h-2 w-2 rounded-full animate-ping ${colorClass.replace('text-', 'bg-')}`}></span>}
        </div>
        <div className="relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
            {subText && <div className={`text-[10px] mt-3 font-bold uppercase tracking-wide px-2 py-1 rounded-md w-fit ${bgClass} ${colorClass}`}>{subText}</div>}
        </div>
        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${colorClass.replace('text-', 'bg-')}`}></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Collected" value={`₹ ${stats?.collected?.toLocaleString() || 0}`} icon={CheckCircle} colorClass="text-emerald-600" bgClass="bg-emerald-50" filterKey="ALL" subText="View All Records"/>
        <Card title="Total Pending" value={`₹ ${stats?.pending?.toLocaleString() || 0}`} icon={AlertCircle} colorClass="text-rose-600" bgClass="bg-rose-50" filterKey="PENDING" subText="Action Required"/>
        <Card title="Fully Paid" value={stats?.totalStudentsPaid || 0} icon={Users} colorClass="text-blue-600" bgClass="bg-blue-50" filterKey="PAID" subText="Students Cleared"/>
        <Card title="Defaulters" value={stats?.totalStudentsPending || 0} icon={AlertCircle} colorClass="text-amber-600" bgClass="bg-amber-50" filterKey="DEFAULTER" subText="Needs Follow-up"/>
    </div>
  );
};

/* --- 2. DYNAMIC TABLE SECTION --- */
const FilteredStudentTable = ({ filterType, courseFilter, yearFilter, onExport, onView }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, [filterType]); 

  const fetchData = async () => {
    setLoading(true);
    try {
        if (filterType === 'PENDING' || filterType === 'DEFAULTER') {
             const res = await getFeeDefaulters();
             setData(res);
        } else {
             const res = await api.get('/students?limit=100'); 
             const transformed = res.data.students.map(s => ({
                 _id: s._id,
                 student: s,
                 totalPayable: s.fees?.total_fee || 0, 
                 totalPaid: s.fees?.fee_paid || 0,
                 dueAmount: (s.fees?.total_fee || 0) - (s.fees?.fee_paid || 0),
                 paymentStatus: ((s.fees?.total_fee || 0) - (s.fees?.fee_paid || 0)) <= 0 ? 'Paid' : 'Pending'
             }));
             if(filterType === 'PAID') setData(transformed.filter(t => t.dueAmount === 0));
             else setData(transformed);
        }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filteredData = data.filter(d => {
    const matchesSearch = d.student?.first_name?.toLowerCase().includes(search.toLowerCase()) || d.student?.admission_number?.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter ? (d.student?.course_type === courseFilter || courseFilter === '') : true;
    const matchesYear = yearFilter ? (d.student?.academic_year || d.student?.admission_year)?.includes(yearFilter) : true;
    return matchesSearch && matchesCourse && matchesYear;
  });

  return (
    <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-white flex flex-wrap gap-4 items-center justify-between">
         <div className="flex items-center gap-4 flex-1">
             <h2 className="text-lg font-bold text-slate-700 whitespace-nowrap">{filterType === 'ALL' ? 'All Students' : filterType === 'PAID' ? 'Paid Students' : 'Pending Dues'}</h2>
             <div className="relative w-full max-w-md group"><Search className="absolute left-4 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18}/><input className="w-full pl-11 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm font-semibold text-slate-700" placeholder="Search name or ID..." value={search} onChange={e => setSearch(e.target.value)}/></div>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 text-slate-400 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
            <tr><th className="p-6 pl-8">Student Details</th><th className="p-6">Status</th><th className="p-6 text-right">Total Fee</th><th className="p-6 text-right">Paid</th><th className="p-6 text-right">Balance</th><th className="p-6 text-center">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {loading ? <tr><td colSpan="6" className="p-16 text-center text-slate-400"><Loader2 className="animate-spin text-blue-500 mx-auto" size={32}/> Loading...</td></tr> : filteredData.length === 0 ? <tr><td colSpan="6" className="p-16 text-center text-slate-400">No records found.</td></tr> :
            filteredData.map((d) => (
                <tr key={d._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-6 pl-8"><div className="font-bold text-slate-800 text-base">{d.student?.first_name} {d.student?.last_name}</div><div className="text-xs font-mono text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded w-fit border border-slate-200">{d.student?.admission_number} • {d.student?.course_type || d.student?.program}</div></td>
                    <td className="p-6"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${d.dueAmount > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{d.dueAmount > 0 ? 'Pending' : 'Cleared'}</span></td>
                    <td className="p-6 text-right font-bold text-slate-600">₹ {(d.totalPayable || 0).toLocaleString()}</td>
                    <td className="p-6 text-right font-bold text-emerald-600">₹ {(d.totalPaid || 0).toLocaleString()}</td>
                    <td className="p-6 text-right"><div className={`font-black text-lg ${d.dueAmount > 0 ? 'text-rose-600' : 'text-slate-300'}`}>₹ {(d.dueAmount || 0).toLocaleString()}</div></td>
                    <td className="p-6"><div className="flex justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity"><button onClick={() => onView(d)} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm" title="View Details"><Eye size={18}/></button></div></td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- 3. STUDENT DETAILS MODAL --- */
const StudentDetailsModal = ({ data, onClose }) => {
  if (!data) return null;
  const s = data.student || {};
  const progress = (data.totalPaid / data.totalPayable) * 100 || 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>
           <div className="relative z-10 flex justify-between items-start">
              <div>
                 <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/10">
                    <BadgeCheck size={14}/> {s.course_type} Student
                 </div>
                 <h2 className="text-3xl font-black tracking-tight">{s.first_name} {s.last_name}</h2>
                 <p className="text-slate-400 mt-1 font-mono text-sm">{s.admission_number}</p>
              </div>
              <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"><X size={20}/></button>
           </div>
        </div>

        <div className="p-8">
           {/* Top Stats Row */}
           <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fee</p>
                 <p className="text-xl font-black text-slate-800">₹{data.totalPayable?.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                 <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Paid Amount</p>
                 <p className="text-xl font-black text-emerald-700">₹{data.totalPaid?.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                 <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Balance Due</p>
                 <p className="text-xl font-black text-rose-700">₹{data.dueAmount?.toLocaleString()}</p>
              </div>
           </div>

           {/* Progress Bar */}
           <div className="mb-8">
              <div className="flex justify-between text-xs font-bold mb-2 text-slate-500 uppercase tracking-wide">
                 <span>Fee Progress</span>
                 <span>{Math.round(progress)}% Paid</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                 <div className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{width: `${progress}%`}}></div>
              </div>
           </div>

           {/* Detailed Info Grid */}
           <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                 <h4 className="font-bold text-slate-800 flex items-center gap-2"><User size={16} className="text-indigo-500"/> Personal Info</h4>
                 <div className="space-y-2 text-slate-600">
                    <p><span className="font-medium text-slate-400 w-24 inline-block">Father:</span> {s.father_name}</p>
                    <p><span className="font-medium text-slate-400 w-24 inline-block">Mobile:</span> {s.student_mobile}</p>
                    <p><span className="font-medium text-slate-400 w-24 inline-block">DOB:</span> {new Date(s.dob).toLocaleDateString()}</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <h4 className="font-bold text-slate-800 flex items-center gap-2"><CreditCard size={16} className="text-emerald-500"/> Fee Breakdown</h4>
                 <div className="space-y-2 text-slate-600">
                    <p><span className="font-medium text-slate-400 w-24 inline-block">1st Year:</span> ₹{s.fees?.year_1_fee}</p>
                    <p><span className="font-medium text-slate-400 w-24 inline-block">2nd Year:</span> ₹{s.fees?.year_2_fee}</p>
                    <p><span className="font-medium text-slate-400 w-24 inline-block">3rd Year:</span> ₹{s.fees?.year_3_fee || 0}</p>
                 </div>
              </div>
           </div>

           {/* Footer Action */}
           <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => window.location.href=`tel:${s.student_mobile}`} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition flex items-center gap-2">
                 <Phone size={18}/> Call Student
              </button>
              <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">
                 Close Details
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default FeeDashboard;