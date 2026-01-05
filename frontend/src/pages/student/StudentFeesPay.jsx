import React, { useState, useEffect } from 'react';
import { 
  CreditCard, AlertCircle, CheckCircle, ArrowRight, FileText,
  Loader2, Calendar, Building2, TrendingUp, Wallet
} from 'lucide-react';
import { getStudentFeeDetails, processPayment } from '../../api/feeApi'; // Use the centralized API helper

const StudentFeesPay = () => {
  const student = JSON.parse(sessionStorage.getItem('student-user') || '{}');
  
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState(null); // Stores structure & payments
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    year: '',
    feeTowards: '',
    amount: '', 
    mode: 'Online Banking'
  });
  
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- 1. Fetch Fees on Mount ---
  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      if (student?.id) {
          // Use the helper which hits: GET /api/student-fees/:studentId
          const data = await getStudentFeeDetails(student.id);
          
          // Ensure structure exists to prevent crashes if not assigned yet
          // Structure comes from populating feeStructureId
          const feeStructure = data?.feeStructureId?.breakdown || { year1: {}, year2: {}, year3: {} };
          
          setFees({
              structure: feeStructure,
              payments: data.transactions || []
          });
      }
    } catch (error) {
      console.error('Failed to fetch fees:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Calculate Invoices (Structure - Paid) ---
  const calculateDueInvoices = () => {
    if (!fees || !fees.structure) return [];
    
    const invoices = [];
    const currentYear = new Date().getFullYear();
    // Dynamic Deadline: usually May 31st of current academic year
    const deadlineDate = new Date(`${currentYear}-05-31`); 

    // Iterate through Years (year1, year2, year3)
    Object.entries(fees.structure).forEach(([yearKey, yearFees]) => {
      // yearKey = "year1" | "year2" | "year3"
      
      // Iterate through Fee Types (collegeFee, hostelFee, etc.)
      Object.entries(yearFees || {}).forEach(([feeType, totalAmount]) => {
        // Only consider fees that have a value > 0
        if (Number(totalAmount) > 0) {
          
          // Calculate paid amount for this specific type & year
          // Note: Backend might store year as "1st", "2nd", "3rd" -> Map "year1" to "1st"
          const yearLabelBackend = yearKey === 'year1' ? '1st' : yearKey === 'year2' ? '2nd' : '3rd';
          
          // Normalize fee type string: "College Fee" vs "collegeFee"
          // We convert camelCase to Spaced Title Case for matching if needed, 
          // but assuming backend stores raw fee type string from dropdown.
          
          const paidAmount = fees.payments
            ?.filter(p => {
                // Match Year
                const isYearMatch = p.year === yearLabelBackend || p.year === yearKey; 
                // Match Type (loose match to handle camelCase vs Spaces)
                const pTypeNormalized = p.feeTowards.replace(/\s+/g, '').toLowerCase();
                const fTypeNormalized = feeType.replace(/\s+/g, '').toLowerCase(); // collegeFee -> collegefee
                
                // Also handle "College Fee" -> "collegefee"
                const fTypeReadable = feeType.replace(/([A-Z])/g, ' $1').trim().replace(/\s+/g, '').toLowerCase();

                return isYearMatch && (pTypeNormalized === fTypeNormalized || pTypeNormalized === fTypeReadable);
            })
            .reduce((sum, p) => sum + p.amount, 0) || 0;
          
          const balance = totalAmount - paidAmount;
          
          // Determine Status
          let status = 'Pending';
          if (balance <= 0) status = 'Paid';
          else if (paidAmount > 0) status = 'Partial';
          
          // Check Overdue
          if (balance > 0 && new Date() > deadlineDate) {
            status = 'Overdue';
          }

          // Only show if there is a balance
          if (balance > 0) {
            invoices.push({
              id: `${yearKey}-${feeType}`,
              yearKey: yearKey, // internal key: year1
              yearLabelBackend: yearLabelBackend, // 1st, 2nd...
              rawFeeType: feeType, // internal: collegeFee
              title: feeType.replace(/([A-Z])/g, ' $1').trim(), // Display: College Fee
              dueDate: deadlineDate.toLocaleDateString(),
              amountDue: balance,
              totalAmount: totalAmount,
              paid: paidAmount,
              status: status
            });
          }
        }
      });
    });
    
    return invoices;
  };

  // --- 3. Open Modal ---
  const handlePayClick = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      year: invoice.yearLabelBackend, // Use '1st', '2nd' for backend
      feeTowards: invoice.title, // Send "College Fee" (Readable)
      amount: invoice.amountDue, // Default to full due amount
      mode: 'Online Banking'
    });
    setShowPaymentModal(true);
    setMessage({ type: '', text: '' });
  };

  // --- 4. Process Payment ---
  const handleProcessPayment = async () => {
    // Validation
    const payAmount = Number(paymentForm.amount);
    if (!payAmount || payAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount.' });
      return;
    }
    if (payAmount > selectedInvoice.amountDue) {
      setMessage({ type: 'error', text: `Amount cannot exceed the pending balance (₹${selectedInvoice.amountDue}).` });
      return;
    }

    setProcessing(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Use API Helper
      await processPayment({
          studentId: student.id,
          year: paymentForm.year,
          feeTowards: paymentForm.feeTowards,
          amount: payAmount,
          mode: paymentForm.mode,
          remarks: "Online Student Payment"
      });

      setMessage({ type: 'success', text: 'Payment successful! Receipt generated.' });
      await fetchFees(); // Refresh data
      
      setTimeout(() => {
        setShowPaymentModal(false);
        setSelectedInvoice(null);
      }, 2000);

    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Payment failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  const dueFees = calculateDueInvoices();
  const totalDue = dueFees.reduce((acc, curr) => acc + curr.amountDue, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fee Center</h1>
          <p className="text-gray-500 text-sm">Review your dues and make secure payments.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Outstanding */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-red-600 font-bold text-sm flex items-center gap-2">
              <AlertCircle size={16} /> Total Outstanding
            </p>
            <p className="text-4xl font-bold text-gray-800 mt-2">₹{totalDue.toLocaleString()}</p>
            <p className="text-xs text-red-400 mt-1 font-medium">{dueFees.length} Pending Invoices</p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <TrendingUp size={80} className="text-red-600" />
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <Building2 size={16} /> Payment Modes
          </p>
          <div className="flex items-center gap-2 mt-4">
             <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">UPI</span>
             <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">Card</span>
             <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">NetBanking</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">Secure 256-bit encrypted payments</p>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
           <div className="flex items-start gap-3">
             <div className="bg-white/20 p-2 rounded-lg"><Wallet size={24}/></div>
             <div>
                <h3 className="font-bold text-lg">Need Help?</h3>
                <p className="text-blue-100 text-xs mt-1 leading-relaxed">
                   If you have issues with amounts or payments, please contact the accounts department.
                </p>
             </div>
           </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <FileText size={20} className="text-amber-500" /> Pending Invoices
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {dueFees.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Dues Found!</h3>
              <p className="text-gray-500">You are all caught up with your fee payments.</p>
            </div>
          ) : (
            dueFees.map((fee) => (
              <div 
                key={fee.id} 
                className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50 transition-colors"
              >
                {/* Left Side: Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                      {fee.status === 'Overdue' 
                        ? <AlertCircle className="text-red-500" size={24} />
                        : <FileText className="text-amber-500" size={24} />
                      }
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between md:justify-start md:gap-4 items-center mb-1">
                        <h4 className="font-bold text-gray-800 text-lg">{fee.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${
                             fee.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' :
                             fee.status === 'Partial' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                             'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                            {fee.status}
                        </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      {fee.yearKey === 'year1' ? '1st Year' : fee.yearKey === 'year2' ? '2nd Year' : '3rd Year'} • Deadline: <span className="font-medium text-gray-700">{fee.dueDate}</span>
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${fee.status === 'Overdue' ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min((fee.paid / fee.totalAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between max-w-md mt-1 text-xs text-gray-500">
                        <span>Paid: ₹{fee.paid.toLocaleString()}</span>
                        <span>Total: ₹{fee.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Side: Action */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Balance Due</p>
                    <p className="font-bold text-2xl text-gray-800">₹{fee.amountDue.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => handlePayClick(fee)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                  >
                    Pay Now <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative">
               <h2 className="text-xl font-bold flex items-center gap-2">
                 <CreditCard size={20} className="text-amber-400" /> Secure Payment
               </h2>
               <button 
                 onClick={() => setShowPaymentModal(false)}
                 className="absolute top-4 right-4 text-slate-400 hover:text-white"
               >
                 ✕
               </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto">
              
              {/* Feedback Message */}
              {message.text && (
                <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                  message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                   {message.type === 'success' ? <CheckCircle size={16} className="mt-0.5"/> : <AlertCircle size={16} className="mt-0.5"/>}
                   {message.text}
                </div>
              )}

              {/* Invoice Summary Box */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Fee Type:</span>
                   <span className="font-bold text-gray-800">{selectedInvoice.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Total Pending:</span>
                   <span className="font-bold text-red-600">₹{selectedInvoice.amountDue.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount to Pay (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    max={selectedInvoice.amountDue}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-bold text-lg text-gray-800"
                  />
                  <button 
                    type="button"
                    onClick={() => setPaymentForm({ ...paymentForm, amount: selectedInvoice.amountDue })}
                    className="absolute right-2 top-2 bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1.5 rounded-lg hover:bg-blue-100"
                  >
                    Pay Full
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  You can enter a partial amount. Minimum ₹1.
                </p>
              </div>
              
              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                   {['Online Banking', 'UPI', 'Debit Card'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentForm({...paymentForm, mode})}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                            paymentForm.mode === mode 
                            ? 'bg-slate-800 text-white border-slate-800' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {mode}
                      </button>
                   ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
               <button
                  onClick={handleProcessPayment}
                  disabled={processing || !paymentForm.amount}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg hover:from-amber-600 hover:to-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <><Loader2 className="animate-spin" size={20} /> Processing...</>
                  ) : (
                    <><CheckCircle size={20} /> Pay ₹{Number(paymentForm.amount || 0).toLocaleString()}</>
                  )}
                </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFeesPay;