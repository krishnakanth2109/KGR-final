import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle, X, Layers, IndianRupee, Loader2, 
  GraduationCap, MoreVertical, FileText, CreditCard, 
  History, AlertCircle, RefreshCw, Printer, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- PDF Libraries ---
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Correct import for v3+

import api from '../../../api/api'; 
// Assuming helper functions exist, otherwise we use direct api calls in this component
import { getAllFeeStructures, assignStudentFee, getStudentFeeDetails, processPayment } from '../../../api/feeApi';
import { fetchStudents } from '../../../api/studentApi';

const StudentFeeGenerator = () => {
  // --- State ---
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [structures, setStructures] = useState([]);
  const [feeMap, setFeeMap] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [generateModal, setGenerateModal] = useState(null); // Student Object
  const [paymentModal, setPaymentModal] = useState(null); // Student Object
  const [historyModal, setHistoryModal] = useState(null); // Student Object
  
  // Forms
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- 1. Fetching Logic ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fee Structures
      const structRes = await getAllFeeStructures();
      setStructures(structRes);

      // 2. Students
      const studentRes = await fetchStudents({ limit: 100, status: 'Active' });
      const list = studentRes.students || [];
      setStudents(list);
      setFilteredStudents(list);

      // 3. Fee Status Map
      const fees = {};
      await Promise.all(list.map(async (stu) => {
        try {
          const res = await getStudentFeeDetails(stu._id);
          if(res) fees[stu._id] = res;
        } catch (e) {}
      }));
      setFeeMap(fees);

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Filter Logic ---
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = students.filter(s => 
      (s.first_name && s.first_name.toLowerCase().includes(q)) || 
      (s.admission_number && s.admission_number.toLowerCase().includes(q))
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);


  // --- 3. HELPER: Number to Words (Indian Format) ---
  const numberToWords = (num) => {
    if (!num || num === 0) return "Zero Only";
    return `Rupees ${num} Only`; 
  };


  // --- 4. PDF GENERATOR (A5 Professional Receipt) ---
  const generateReceiptPDF = (student, feeRecord) => {
    if (!feeRecord || !feeRecord.transactions || feeRecord.transactions.length === 0) {
        return alert("No payment history found to generate receipt.");
    }

    // Get the latest transaction for the receipt
    const lastTxn = feeRecord.transactions[feeRecord.transactions.length - 1];

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5' // A5 is good for receipts
    });

    // Colors
    const primaryColor = [30, 58, 138];   // Deep Blue
    const accentColor = [234, 88, 12]; // Orange
    const grayColor = [100, 100, 100]; 

    // --- HEADER ---
    // College Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text("KGR VOCATIONAL JUNIOR COLLEGE", 74, 15, { align: 'center' });

    // Address
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text("Vivek St, Sri Vidya Colony, Jayendra Nagar, Siddartha Nagar", 74, 20, { align: 'center' });
    doc.text("Kakinada, Andhra Pradesh 533003", 74, 24, { align: 'center' });
    doc.text("Phone: +91 98765 43210 | Email: info@kgrcollege.ac.in", 74, 28, { align: 'center' });

    // Divider Line
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.line(10, 32, 138, 32);

    // Receipt Title Box
    doc.setFillColor(...primaryColor);
    doc.roundedRect(54, 32, 40, 7, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("FEE RECEIPT", 74, 36.5, { align: 'center' });

    // --- STUDENT DETAILS ---
    doc.setTextColor(0, 0, 0);
    const startY = 48;
    
    // Receipt No & Date
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Receipt No: ${lastTxn.transactionId || '---'}`, 10, startY);
    doc.text(`Date: ${new Date(lastTxn.date).toLocaleDateString()}`, 100, startY, { align: 'right' });

    // Box for Student Info
    doc.setDrawColor(200, 200, 200);
    doc.rect(10, startY + 5, 128, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    // Line 1
    doc.text("Student Name:", 15, startY + 12);
    doc.setFont("helvetica", "bold");
    doc.text(`${student.first_name} ${student.last_name}`, 45, startY + 12);

    // Line 2
    doc.setFont("helvetica", "normal");
    doc.text("Admission No:", 15, startY + 19);
    doc.setFont("helvetica", "bold");
    doc.text(student.admission_number, 45, startY + 19);

    // Line 3
    doc.setFont("helvetica", "normal");
    doc.text("Course / Year:", 15, startY + 26);
    doc.setFont("helvetica", "bold");
    const yearLabel = lastTxn.year ? `${lastTxn.year} Year` : '---'; 
    doc.text(`${student.program}  |  ${yearLabel}`, 45, startY + 26);

    // --- PAYMENT TABLE ---
    const tableY = startY + 35;
    
    // Using correct autoTable call
    autoTable(doc, {
        startY: tableY,
        head: [['S.No', 'Fee Description', 'Payment Mode', 'Amount']],
        body: [
            ['1', lastTxn.feeTowards || 'Tuition Fee', lastTxn.mode, `Rs. ${lastTxn.amount}/-`],
        ],
        theme: 'grid',
        headStyles: { fillColor: primaryColor, fontSize: 9, halign: 'center' },
        bodyStyles: { fontSize: 9, textColor: 50 },
        columnStyles: { 
            0: { halign: 'center', cellWidth: 15 },
            1: { cellWidth: 50 },
            2: { halign: 'center', cellWidth: 30 },
            3: { halign: 'right', fontStyle: 'bold' }
        },
        styles: { cellPadding: 3 },
        margin: { left: 10, right: 10 }
    });

    // --- TOTALS ---
    let finalY = doc.lastAutoTable.finalY + 2;

    // Total Amount Box
    doc.setFillColor(240, 240, 240);
    doc.rect(80, finalY, 58, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Total Paid:", 85, finalY + 5.5);
    doc.text(`Rs. ${lastTxn.amount}/-`, 135, finalY + 5.5, { align: 'right' });

    // Amount in Words
    finalY += 15;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(`In Words: ${numberToWords(lastTxn.amount)}`, 10, finalY);

    // --- FOOTER ---
    const footerY = 180;
    
    // Signatures
    doc.setDrawColor(0, 0, 0);
    doc.line(10, footerY, 40, footerY); // Student Sig Line
    doc.line(100, footerY, 130, footerY); // Cashier Sig Line
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("Student Signature", 15, footerY + 4);
    doc.text("Authorized Signature", 105, footerY + 4);

    // Disclaimer
    doc.setTextColor(...grayColor);
    doc.text("This is a computer generated receipt.", 74, 195, { align: 'center' });

    // Save
    doc.save(`${student.admission_number}_Receipt.pdf`);
  };


  // --- 5. Handlers ---
  const handleGenerateFee = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedStruct = structures.find(s => s._id === formData.feeStructureId);
      const payload = {
        studentId: generateModal._id,
        feeStructureId: formData.feeStructureId,
        totalPayable: selectedStruct.totalAmount,
        discount: Number(formData.discount || 0)
      };
      
      const res = await api.post('/student-fees/assign', payload);
      // Update local state
      setFeeMap(prev => ({ ...prev, [generateModal._id]: res.data }));
      setGenerateModal(null);
      alert("Fee Structure Generated Successfully!");
    } catch (error) {
      alert("Failed to assign fee.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        studentId: paymentModal._id,
        amount: Number(formData.amount),
        mode: formData.mode,
        year: formData.year, // Backend expects this
        feeTowards: formData.feeTowards, // Backend expects this
        remarks: formData.remarks
      };
      const res = await api.post('/student-fees/pay', payload);
      
      // Update local state
      setFeeMap(prev => ({ ...prev, [paymentModal._id]: res.data }));
      setPaymentModal(null);
      alert("Payment Recorded Successfully!");
      
      // Optional: Auto generate receipt
      if(window.confirm("Do you want to download the receipt now?")) {
          generateReceiptPDF(paymentModal, res.data);
      }

    } catch (error) {
      alert("Payment failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for Status Badge
  const getStatus = (feeRecord) => {
      if(!feeRecord) return { label: 'Unassigned', color: 'bg-gray-100 text-gray-500' };
      const net = feeRecord.totalPayable - feeRecord.discount;
      if (feeRecord.totalPaid >= net && net > 0) return { label: 'Paid', color: 'bg-green-100 text-green-700 border-green-200' };
      if (feeRecord.totalPaid > 0) return { label: 'Partial', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      return { label: 'Pending', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-sans" onClick={() => setActiveDropdown(null)}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <IndianRupee className="text-indigo-600" size={32} /> Student Fee Generator
          </h1>
          <p className="text-gray-500 mt-1 ml-10">Manage student fees and generate official receipts.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={() => { sessionStorage.clear(); fetchInitialData(true); }} 
                className="p-2.5 bg-white border rounded-xl hover:bg-gray-50 text-gray-600 transition"
                title="Refresh Data"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                    placeholder="Search Student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-5">Student Info</th>
                <th className="p-5">Course</th>
                <th className="p-5">Fee Structure</th>
                <th className="p-5 text-right">Total Payable</th>
                <th className="p-5 text-right">Paid</th>
                <th className="p-5 text-right">Balance</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="8" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={32}/></td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="8" className="p-10 text-center text-gray-400">No students found.</td></tr>
              ) : (
                filteredStudents.map((stu) => {
                  const fee = feeMap[stu._id];
                  const statusInfo = getStatus(fee);
                  const total = fee ? (fee.totalPayable - fee.discount) : 0;
                  const paid = fee?.totalPaid || 0;
                  const due = total - paid;
                  const structName = fee?.feeStructureId?.name || "Not Assigned";

                  return (
                    <tr key={stu._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-gray-900">{stu.first_name} {stu.last_name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{stu.admission_number}</div>
                      </td>
                      <td className="p-5">
                        <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded text-xs font-medium">{stu.program}</span>
                      </td>
                      <td className="p-5">
                        {fee ? (
                           <div className="flex items-center gap-1.5 text-indigo-700 font-medium"><Layers size={14}/> {structName}</div>
                        ) : (<span className="text-gray-400 italic text-xs">--</span>)}
                      </td>
                      <td className="p-5 text-right font-medium text-gray-900">₹ {total.toLocaleString()}</td>
                      <td className="p-5 text-right text-green-600 font-medium">₹ {paid.toLocaleString()}</td>
                      <td className="p-5 text-right font-bold text-red-500">₹ {due.toLocaleString()}</td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>{statusInfo.label}</span>
                      </td>
                      <td className="p-5 text-center relative">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === stu._id ? null : stu._id); }}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                        >
                            <MoreVertical size={18}/>
                        </button>

                        {activeDropdown === stu._id && (
                             <div className="absolute right-10 top-2 w-56 bg-white shadow-xl rounded-lg border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button 
                                    onClick={() => { setGenerateModal(stu); setFormData({ feeStructureId: '', discount: fee?.discount || 0 }); }}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50"
                                >
                                    <GraduationCap size={16} className="text-indigo-500"/> {fee ? 'Update Structure' : 'Generate Fee'}
                                </button>
                                
                                {fee && (
                                    <>
                                        <button 
                                            onClick={() => { setPaymentModal(stu); setFormData({ amount: '', mode: 'Cash', year: '1st', feeTowards: 'College Fee' }); }}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <CreditCard size={16} className="text-green-500"/> Collect Payment
                                        </button>
                                        <button 
                                            onClick={() => generateReceiptPDF(stu, fee)}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Printer size={16} className="text-blue-500"/> Print Receipt
                                        </button>
                                        <button 
                                            onClick={() => setHistoryModal(stu)}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <History size={16} className="text-orange-500"/> View History
                                        </button>
                                    </>
                                )}
                             </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Generate Fee Modal */}
      <AnimatePresence>
        {generateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
               <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
                  <h3 className="text-lg font-bold flex items-center gap-2"><FileText/> Generate Fee Structure</h3>
                  <button onClick={() => setGenerateModal(null)} className="hover:bg-indigo-500 p-1 rounded"><X/></button>
               </div>
               <form onSubmit={handleGenerateFee} className="p-6 space-y-4">
                  <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-900 mb-2">
                     Generating fee for <span className="font-bold">{generateModal.first_name} {generateModal.last_name}</span>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Structure</label>
                     <select required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500" value={formData.feeStructureId} onChange={e => setFormData({...formData, feeStructureId: e.target.value})}>
                        <option value="">-- Select --</option>
                        {structures.map(s => <option key={s._id} value={s._id}>{s.name} (₹{s.totalAmount})</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount (₹)</label>
                     <input type="number" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} placeholder="0"/>
                  </div>
                  <button disabled={submitting} type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex justify-center gap-2">{submitting ? <Loader2 className="animate-spin"/> : <CheckCircle/>} Save Fee Structure</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Payment Modal */}
      <AnimatePresence>
        {paymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
               <div className="bg-green-600 p-6 flex justify-between items-center text-white">
                  <h3 className="text-lg font-bold flex items-center gap-2"><CreditCard/> Collect Payment</h3>
                  <button onClick={() => setPaymentModal(null)} className="hover:bg-green-500 p-1 rounded"><X/></button>
               </div>
               <form onSubmit={handlePayment} className="p-6 space-y-4">
                  <div className="bg-green-50 p-3 rounded-lg text-sm text-green-900 mb-2 flex justify-between">
                     <span>Student: <b>{paymentModal.first_name}</b></span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                        <select className="w-full p-2 border rounded-lg" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}>
                            <option value="1st">1st Year</option>
                            <option value="2nd">2nd Year</option>
                            <option value="3rd">3rd Year</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mode</label>
                        <select className="w-full p-2 border rounded-lg" value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})}>
                            <option value="Cash">Cash</option>
                            <option value="Online">Online</option>
                            <option value="UPI">UPI</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fee Category</label>
                     <select className="w-full p-3 border rounded-lg" value={formData.feeTowards} onChange={e => setFormData({...formData, feeTowards: e.target.value})}>
                         <option>College Fee</option>
                         <option>Admission Fee</option>
                         <option>Hostel Fee</option>
                         <option>Exam Fee</option>
                         <option>Bus Fee</option>
                         <option>Books Fee</option>
                         <option>Uniform Fee</option>
                         <option>Clinical Fee</option>
                         <option>Caution Deposit</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₹)</label>
                     <div className="relative">
                        <IndianRupee className="absolute left-3 top-3 text-gray-400" size={16}/>
                        <input required type="number" className="w-full pl-9 p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 font-bold text-lg" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00"/>
                     </div>
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Remarks</label>
                     <textarea className="w-full p-3 border border-gray-300 rounded-lg outline-none" rows="2" placeholder="Optional details..." value={formData.remarks || ''} onChange={e => setFormData({...formData, remarks: e.target.value})}/>
                  </div>
                  
                  <button disabled={submitting} type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex justify-center gap-2">{submitting ? <Loader2 className="animate-spin"/> : <CheckCircle/>} Confirm Payment</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. History Modal */}
      <AnimatePresence>
        {historyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
               <div className="bg-gray-800 p-5 flex justify-between items-center text-white">
                  <h3 className="text-lg font-bold flex items-center gap-2"><History/> Transaction History</h3>
                  <button onClick={() => setHistoryModal(null)} className="hover:bg-gray-700 p-2 rounded"><X/></button>
               </div>
               <div className="p-4 bg-gray-50 border-b flex justify-between text-sm">
                  <span className="font-bold text-gray-700">{historyModal.first_name}</span>
                  <span className="text-gray-500">{historyModal.admission_number}</span>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {feeMap[historyModal._id]?.transactions?.length > 0 ? (
                      feeMap[historyModal._id].transactions.slice().reverse().map((txn, idx) => (
                        <div key={idx} className="flex justify-between items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div>
                                <div className="text-green-600 font-bold text-lg">₹ {txn.amount.toLocaleString()}</div>
                                <div className="text-xs text-gray-400 mt-1">{new Date(txn.date).toLocaleString()}</div>
                                <div className="text-xs font-bold text-gray-600 mt-1">{txn.feeTowards} ({txn.year})</div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded mb-1">{txn.mode}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{txn.transactionId}</span>
                            </div>
                        </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                          <AlertCircle size={32} className="mb-2 opacity-50"/>
                          <p>No transactions found.</p>
                      </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudentFeeGenerator;