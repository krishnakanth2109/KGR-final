// --- START OF FILE src/pages/student/StudentFees.jsx ---
import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Loader2, DollarSign, TrendingUp, History, Download } from 'lucide-react';
// ✅ FIXED IMPORT: Importing from feeApi.js where addPayment is defined
import { getStudentFees, addPayment } from '../../api/feeApi'; 
import { motion, AnimatePresence } from 'framer-motion';

// Helper to convert number to words (Simplified for UI)
const numToWords = (num) => {
    if (!num) return "";
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
};

const StudentFees = () => {
  const [fees, setFees] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payForm, setPayForm] = useState({ year: 'year1', feeTowards: '', amount: '' });
  const [paying, setPaying] = useState(false);

  const student = JSON.parse(sessionStorage.getItem('student-user'));

  // --- 1. Fetch Data ---
  const loadData = async () => {
    try {
      if (student?.id) {
        const data = await getStudentFees(student.id);
        setFees(data.structure || {}); 
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- 2. Calculations ---
  // Calculate total assigned fee per year/type
  const getAssignedFee = (year, type) => fees?.[year]?.[type] || 0;

  // Calculate total paid per year/type
  const getPaidFee = (year, type) => {
    // Backend year is '1st', '2nd', '3rd'. Frontend key is 'year1', 'year2', 'year3'
    const yearLabel = year === 'year1' ? '1st' : year === 'year2' ? '2nd' : '3rd';
    
    // Normalize type string for comparison (remove extra spaces, lowercase)
    const normalizedType = type.toLowerCase().replace(/\s/g, '');

    return payments
      .filter(p => {
          const pYear = p.year; 
          const pType = p.feeTowards.toLowerCase().replace(/\s/g, '');
          return pYear === yearLabel && pType === normalizedType;
      })
      .reduce((sum, p) => sum + p.amount, 0);
  };

  // Aggregates
  const totalAssigned = ['year1', 'year2', 'year3'].reduce((acc, y) => acc + Object.values(fees?.[y] || {}).reduce((a, b) => a + (Number(b) || 0), 0), 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalDue = totalAssigned - totalPaid;
  const progress = totalAssigned > 0 ? (totalPaid / totalAssigned) * 100 : 0;

  // --- 3. Handlers ---
  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!payForm.feeTowards) return alert("Please select a fee type.");
    
    setPaying(true);
    try {
        // Map form 'year1' to '1st' for backend
        const yearLabel = payForm.year === 'year1' ? '1st' : payForm.year === 'year2' ? '2nd' : '3rd';
        
        await addPayment(student.id, {
            year: yearLabel,
            feeTowards: payForm.feeTowards,
            amount: Number(payForm.amount),
            mode: 'Online' // Default for student portal
        });
        
        await loadData(); // Refresh data
        setPaymentModalOpen(false);
        setPayForm({ year: 'year1', feeTowards: '', amount: '' });
        alert("Payment Successful!");
    } catch (err) {
        console.error(err);
        alert("Payment Failed. Try again.");
    } finally {
        setPaying(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Header & Main Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Fee Dashboard</h1>
            <p className="text-gray-500">Track your payments and dues</p>
        </div>
        <button 
            onClick={() => setPaymentModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 flex items-center gap-2 font-bold"
        >
            <CreditCard size={20} /> Pay Now
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Fee */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-gray-500 font-medium mb-1">Total Course Fee</p>
                <h2 className="text-3xl font-bold text-gray-800">₹ {totalAssigned.toLocaleString()}</h2>
            </div>
            <div className="absolute right-0 top-0 p-4 opacity-10">
                <DollarSign size={80} className="text-blue-600" />
            </div>
        </div>

        {/* Paid */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-green-100 font-medium mb-1">Total Paid</p>
                <h2 className="text-3xl font-bold">₹ {totalPaid.toLocaleString()}</h2>
                <div className="mt-3 w-full bg-black/20 rounded-full h-1.5">
                    <div className="bg-white h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs mt-1 text-green-100">{Math.round(progress)}% Completed</p>
            </div>
            <div className="absolute right-0 top-0 p-4 opacity-20">
                <CheckCircle size={80} />
            </div>
        </div>

        {/* Due */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-gray-500 font-medium mb-1">Pending Dues</p>
                <h2 className="text-3xl font-bold text-red-600">₹ {totalDue.toLocaleString()}</h2>
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Action Required
                </p>
            </div>
            <div className="absolute right-0 top-0 p-4 opacity-10">
                <TrendingUp size={80} className="text-red-600" />
            </div>
        </div>
      </div>

      {/* Fee Breakdown By Year */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {['year1', 'year2', 'year3'].map((year, index) => {
            const yearData = fees?.[year];
            if (!yearData) return null;

            // Only show fields that have a fee assigned (>0)
            const feeTypes = Object.keys(yearData).filter(k => yearData[k] > 0);
            
            return (
                <div key={year} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className={`p-4 font-bold text-lg text-center ${index === 0 ? 'bg-blue-50 text-blue-700' : index === 1 ? 'bg-purple-50 text-purple-700' : 'bg-orange-50 text-orange-700'}`}>
                        {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : 'rd'} Year Details
                    </div>
                    <div className="p-4 space-y-4">
                        {feeTypes.length === 0 ? <p className="text-center text-gray-400 text-sm">No fees assigned.</p> : feeTypes.map(type => {
                            const assigned = getAssignedFee(year, type);
                            // Format key: "collegeFee" -> "College Fee" for matching
                            const readableType = type.replace(/([A-Z])/g, ' $1').trim();
                            const paid = getPaidFee(year, readableType);
                            const balance = assigned - paid;
                            
                            const statusColor = balance <= 0 ? 'text-green-600' : balance < assigned ? 'text-yellow-600' : 'text-red-600';

                            return (
                                <div key={type} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-600 font-medium capitalize">{readableType}</span>
                                        <span className="font-bold text-gray-800">₹{assigned.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Paid: <span className="text-gray-600">₹{paid.toLocaleString()}</span></span>
                                        <span className={`font-semibold ${statusColor}`}>
                                            {balance <= 0 ? 'Settled' : `Due: ₹${balance.toLocaleString()}`}
                                        </span>
                                    </div>
                                    {/* Mini Progress Bar */}
                                    <div className="mt-1 w-full bg-gray-100 rounded-full h-1">
                                        <div className={`h-1 rounded-full ${balance <= 0 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((paid/assigned)*100, 100)}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        })}
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <History className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="py-3 px-6">Date</th>
                        <th className="py-3 px-6">Receipt ID</th>
                        <th className="py-3 px-6">Fee Type</th>
                        <th className="py-3 px-6">Mode</th>
                        <th className="py-3 px-6 text-right">Amount</th>
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {payments.length === 0 ? (
                        <tr><td colSpan="7" className="text-center py-6 text-gray-400">No transactions found.</td></tr>
                    ) : (
                        payments.slice().reverse().map((txn, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-6">{new Date(txn.date).toLocaleDateString()}</td>
                                <td className="py-3 px-6 font-mono text-gray-500">{txn.receiptNo || '-'}</td>
                                <td className="py-3 px-6 font-medium text-gray-700">{txn.feeTowards} ({txn.year})</td>
                                <td className="py-3 px-6">{txn.mode}</td>
                                <td className="py-3 px-6 text-right font-bold text-gray-800">₹{txn.amount.toLocaleString()}</td>
                                <td className="py-3 px-6 text-center">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">SUCCESS</span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"><Download size={16} /></button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- PAYMENT MODAL --- */}
      <AnimatePresence>
        {isPaymentModalOpen && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setPaymentModalOpen(false)}
            >
                <motion.div 
                    initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="bg-blue-600 p-6 text-white">
                        <h2 className="text-xl font-bold">Make a Payment</h2>
                        <p className="text-blue-100 text-sm">Secure online payment gateway</p>
                    </div>
                    
                    <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Year</label>
                            <select 
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={payForm.year}
                                onChange={e => setPayForm({...payForm, year: e.target.value})}
                            >
                                <option value="year1">1st Year</option>
                                <option value="year2">2nd Year</option>
                                <option value="year3">3rd Year</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fee Type</label>
                            <select 
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={payForm.feeTowards}
                                onChange={e => setPayForm({...payForm, feeTowards: e.target.value})}
                                required
                            >
                                <option value="">-- Select Fee Type --</option>
                                {fees?.[payForm.year] && Object.keys(fees[payForm.year])
                                    .filter(k => fees[payForm.year][k] > 0 && k !== 'scholarship')
                                    .map(k => (
                                        <option key={k} value={k.replace(/([A-Z])/g, ' $1').trim()}>
                                            {k.replace(/([A-Z])/g, ' $1').trim()}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Amount to Pay</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                <input 
                                    type="number"
                                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                                    value={payForm.amount}
                                    onChange={e => setPayForm({...payForm, amount: e.target.value})}
                                    placeholder="0"
                                    required
                                    min="1"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">{payForm.amount ? numToWords(payForm.amount) : ''}</p>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setPaymentModalOpen(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={paying}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2"
                            >
                                {paying ? <Loader2 className="animate-spin" size={20} /> : "Proceed to Pay"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudentFees;