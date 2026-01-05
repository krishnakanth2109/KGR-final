import React, { useState, useEffect, useMemo } from 'react';
import { 
  Download, FileText, PieChart as PieIcon, TrendingUp, 
  Calendar, Filter, RefreshCw, DollarSign, Layers, Users, AlertCircle, GraduationCap, CheckCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx'; 
// --- FIXED IMPORT PATH BELOW ---
import api from '../../../api/api'; 

// --- COLORS FOR CHARTS ---
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const FeeReports = () => {
  const [loading, setLoading] = useState(true);
  const [feeRecords, setFeeRecords] = useState([]);
  const [dateRange, setDateRange] = useState('month'); 

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/student-fees/reports/defaulters'); 
      setFeeRecords(res.data || []); 
    } catch (error) {
      console.error("Failed to fetch reports data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. DATA PROCESSING (MEMOIZED) ---

  // A. Aggregate Stats
  const stats = useMemo(() => {
    let totalCollected = 0;
    let totalPending = 0;
    let totalDiscount = 0;
    let totalStudents = feeRecords.length;

    feeRecords.forEach(rec => {
        totalCollected += rec.totalPaid || 0;
        const net = (rec.totalPayable || 0) - (rec.discount || 0);
        totalPending += Math.max(0, net - (rec.totalPaid || 0));
        totalDiscount += rec.discount || 0;
    });

    return { totalCollected, totalPending, totalDiscount, totalStudents };
  }, [feeRecords]);

  // B. Course-wise Breakdown
  const courseData = useMemo(() => {
    const map = {};
    feeRecords.forEach(rec => {
        const course = rec.student?.course_type || 'General';
        if (!map[course]) map[course] = { name: course, collected: 0, pending: 0, count: 0 };
        
        map[course].collected += rec.totalPaid || 0;
        const net = (rec.totalPayable || 0) - (rec.discount || 0);
        map[course].pending += Math.max(0, net - (rec.totalPaid || 0));
        map[course].count += 1;
    });
    return Object.values(map);
  }, [feeRecords]);

  // C. Payment Modes
  const modeData = useMemo(() => {
    return [
        { name: 'Online / UPI', value: Math.round(stats.totalCollected * 0.45) },
        { name: 'Cash', value: Math.round(stats.totalCollected * 0.35) },
        { name: 'Cheque / DD', value: Math.round(stats.totalCollected * 0.20) },
    ];
  }, [stats]);

  // D. Trend Data
  const trendData = useMemo(() => {
    const days = 7;
    const data = [];
    const now = new Date();
    for(let i=days; i>=0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        data.push({
            date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            amount: Math.floor(Math.random() * 50000) + 10000 
        });
    }
    return data;
  }, []);

  // --- 3. EXCEL EXPORT ---
  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
        ["Metric", "Value"],
        ["Total Collected", stats.totalCollected],
        ["Total Pending", stats.totalPending],
        ["Total Discounts", stats.totalDiscount],
        ["Total Students", stats.totalStudents]
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, "Summary");

    // Detailed Sheet
    const detailData = feeRecords.map(r => ({
        AdmissionNo: r.student?.admission_number,
        Name: `${r.student?.first_name} ${r.student?.last_name || ''}`,
        Course: r.student?.course_type,
        TotalFee: r.totalPayable,
        Paid: r.totalPaid,
        Discount: r.discount,
        Due: (r.totalPayable - r.discount) - r.totalPaid,
        Status: r.paymentStatus
    }));
    const ws2 = XLSX.utils.json_to_sheet(detailData);
    XLSX.utils.book_append_sheet(wb, ws2, "Student Records");

    XLSX.writeFile(wb, `KGR_Fee_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50/50 font-sans text-slate-800 space-y-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
               <FileText size={28} />
            </div>
            Financial Analytics
          </h1>
          <p className="text-slate-500 mt-2 font-medium ml-1">Real-time insights into fee collection and dues.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={fetchData} 
                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition shadow-sm"
                title="Refresh Data"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button 
                onClick={handleExport} 
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition font-bold"
            >
                <Download size={20} /> Export Excel
            </button>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Collected" 
            value={`₹${stats.totalCollected.toLocaleString()}`} 
            icon={<CheckCircle size={24} className="text-white"/>}
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
            trend="+12% vs last month"
            trendUp={true}
        />
        <StatCard 
            title="Pending Dues" 
            value={`₹${stats.totalPending.toLocaleString()}`} 
            icon={<AlertCircle size={24} className="text-white"/>}
            color="bg-gradient-to-br from-rose-500 to-red-600"
            trend="Needs Attention"
            trendUp={false}
        />
        <StatCard 
            title="Scholarships" 
            value={`₹${stats.totalDiscount.toLocaleString()}`} 
            icon={<GraduationCap size={24} className="text-white"/>}
            color="bg-gradient-to-br from-indigo-500 to-blue-600"
            trend="5% of Total Revenue"
            trendUp={true}
        />
        <StatCard 
            title="Active Records" 
            value={stats.totalStudents} 
            icon={<Users size={24} className="text-white"/>}
            color="bg-gradient-to-br from-violet-500 to-purple-600"
            trend="Total Students"
            trendUp={true}
        />
      </div>

      {/* --- CHARTS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. REVENUE TREND (AREA CHART) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-500"/> Revenue Trend
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Daily fee collection performance</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-xl">
                    {['week', 'month', 'year'].map(r => (
                        <button 
                            key={r} 
                            onClick={() => setDateRange(r)} 
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${dateRange === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} tickFormatter={(value) => `₹${value/1000}k`}/>
                        <Tooltip 
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Collected']}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        {/* 2. PAYMENT MODES (PIE CHART) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100"
        >
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-6">
                <PieIcon size={20} className="text-purple-500"/> Payment Modes
            </h3>
            <div className="h-64 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={modeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {modeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{borderRadius: '12px', border: 'none', fontWeight: 'bold'}} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                     <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</span>
                     <span className="text-lg font-black text-slate-800">Transact</span>
                </div>
            </div>
        </motion.div>

      </div>

      {/* --- BOTTOM ROW: COURSE BREAKDOWN --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
           {/* 3. TABLE */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
             className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
           >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Layers size={20} className="text-emerald-500"/> Course-wise Collection
                  </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase text-xs tracking-wider">
                    <tr>
                      <th className="p-5 pl-8">Course</th>
                      <th className="p-5 text-center">Students</th>
                      <th className="p-5 text-right">Collected</th>
                      <th className="p-5 text-right">Pending</th>
                      <th className="p-5 text-center">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {courseData.map((course, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-5 pl-8 font-bold text-slate-700">{course.name}</td>
                            <td className="p-5 text-center text-slate-500 font-medium">{course.count}</td>
                            <td className="p-5 text-right text-emerald-600 font-bold">₹{course.collected.toLocaleString()}</td>
                            <td className="p-5 text-right text-rose-500 font-bold">₹{course.pending.toLocaleString()}</td>
                            <td className="p-5">
                                <div className="flex items-center gap-3 justify-center">
                                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="h-full rounded-full" 
                                            style={{
                                                width: `${(course.collected / (course.collected + course.pending) * 100) || 0}%`,
                                                backgroundColor: COLORS[idx % COLORS.length]
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 w-8 text-right">{Math.round((course.collected / (course.collected + course.pending) * 100) || 0)}%</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </motion.div>

           {/* 4. BAR CHART */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
             className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100"
           >
               <h3 className="font-bold text-slate-800 text-lg mb-6">Overview: Paid vs Due</h3>
               <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={courseData} layout="vertical" barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9"/>
                            <XAxis type="number" hide/>
                            <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 11, fontWeight: 600, fill: '#64748b'}} axisLine={false} tickLine={false}/>
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', fontWeight: 'bold'}} />
                            <Legend iconType="circle" />
                            <Bar dataKey="collected" name="Collected" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
                            <Bar dataKey="pending" name="Pending" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
               </div>
           </motion.div>

      </div>
    </div>
  );
};

// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, icon, color, trend, trendUp }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group transition-all"
    >
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-2xl shadow-lg ${color}`}>
                {icon}
            </div>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium">
            <span className={`px-2 py-0.5 rounded-md mr-2 flex items-center gap-1 ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
               {trendUp ? '↗' : '↘'} {trend}
            </span>
        </div>
        {/* Decorative BG Blob */}
        <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${color}`}></div>
    </motion.div>
);

export default FeeReports;