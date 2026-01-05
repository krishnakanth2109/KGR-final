// src/pages/admin/StudentFeeManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getStudentFees, 
    updateFeeStructure, 
    addPayment 
} from '../../api/feeApi'; // Ensure these are exported in your api/feeApi.js
import { getStudentById } from '../../api/studentApi';
import { 
    Save, ArrowLeft, Loader2, Printer, PlusCircle, History, 
    CreditCard, BookOpen, Download 
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

// --- UTILS: Number to Words ---
const numToWords = (num) => {
    if (!num) return "";
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
};

const StudentFeeManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // UI States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Data States
    const [student, setStudent] = useState(null);
    const [structure, setStructure] = useState({
        year1: { admissionFee: 0, collegeFee: 0, hostelFee: 0, scholarship: 0, booksFee: 0, uniformFee: 0, clinicalFee: 0, cautionDeposit: 0, busFee: 0 },
        year2: { collegeFee: 0, hostelFee: 0, scholarship: 0, booksFee: 0, clinicalFee: 0, cautionDeposit: 0, busFee: 0 },
        year3: { collegeFee: 0, hostelFee: 0, scholarship: 0, booksFee: 0, uniformFee: 0, clinicalFee: 0, busFee: 0 }
    });
    const [paymentsHistory, setPaymentsHistory] = useState([]);

    // Payment Form State
    const [payment, setPayment] = useState({
        year: 'year1', // Backend expects '1st', '2nd', etc. mapped below
        feeTowards: 'College Fee',
        amount: '',
        mode: 'Cash'
    });
    
    const [lastReceipt, setLastReceipt] = useState(null); // For printing
    const componentRef = useRef(); // For printing

    // --- 1. FETCH DATA ON MOUNT ---
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [studentData, feeData] = await Promise.all([
                    getStudentById(id),
                    getStudentFees(id)
                ]);

                setStudent(studentData);
                
                // Merge fetched structure with default to prevent undefined errors
                if (feeData.structure) {
                    setStructure(prev => ({
                        year1: { ...prev.year1, ...feeData.structure.year1 },
                        year2: { ...prev.year2, ...feeData.structure.year2 },
                        year3: { ...prev.year3, ...feeData.structure.year3 },
                    }));
                }

                // Set Payments
                if (feeData.payments) {
                    // Sort by date descending
                    const sorted = [...feeData.payments].sort((a, b) => new Date(b.date) - new Date(a.date));
                    setPaymentsHistory(sorted);
                }
            } catch (error) {
                console.error("Failed to load data", error);
                alert("Error loading student data.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // --- HANDLERS ---

    // 1. Handle Fee Structure Input Change
    const handleStructureChange = (year, field, value) => {
        setStructure(prev => ({
            ...prev,
            [year]: { ...prev[year], [field]: Number(value) }
        }));
    };

    // 2. Save Structure to Backend
    const handleSaveStructure = async () => {
        setSaving(true);
        try {
            // This endpoint should be: POST /api/fees/structure/:studentId
            await updateFeeStructure(id, { 
                year1: structure.year1,
                year2: structure.year2,
                year3: structure.year3
            });
            alert('Fee Structure Updated Successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save structure.');
        } finally {
            setSaving(false);
        }
    };

    // 3. Submit New Payment
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if(!payment.amount || payment.amount <= 0) return alert("Enter valid amount");

        setSaving(true);
        try {
            // Map 'year1' -> '1st' for backend consistency if needed, or send raw key
            const yearLabel = payment.year === 'year1' ? '1st' : payment.year === 'year2' ? '2nd' : '3rd';

            const payload = {
                year: yearLabel,
                feeTowards: payment.feeTowards,
                amount: Number(payment.amount),
                mode: payment.mode
            };

            const res = await addPayment(id, payload);
            
            // Update History Table
            if(res.payments) {
                const sorted = [...res.payments].sort((a, b) => new Date(b.date) - new Date(a.date));
                setPaymentsHistory(sorted);
                
                // Set the specific new payment as lastReceipt for printing
                // Assuming the backend appends to end, the new one is at the end of the response array
                // But we sorted desc for UI, so we find the one with latest date
                const newTxn = res.payments[res.payments.length - 1]; 
                setLastReceipt(newTxn);
            }
            
            // Reset Form
            setPayment(prev => ({ ...prev, amount: '' })); 
            alert('Payment Recorded Successfully!');
        } catch (error) {
            console.error(error);
            alert("Payment Failed");
        } finally {
            setSaving(false);
        }
    };

    // 4. Print Functionality
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Receipt_${student?.admission_number || 'Student'}`,
        pageStyle: `
            @page { size: A6; margin: 10mm; }
            @media print { body { -webkit-print-color-adjust: exact; } }
        `
    });

    // Helper Component for Inputs
    const InputRow = ({ label, year, field }) => (
        <div className="flex items-center justify-between gap-2 mb-2">
            <label className="text-xs font-semibold text-gray-600 w-1/3">{label}:</label>
            <input 
                type="number" 
                value={structure[year][field] || 0} 
                onChange={(e) => handleStructureChange(year, field, e.target.value)}
                className="w-2/3 p-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
        </div>
    );

    if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* 1. Header & Student Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ArrowLeft /></button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Fee Manager</h1>
                                <p className="text-sm text-gray-500">Setup Fees & Record Payments</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100 mt-4 md:mt-0">
                            <div>
                                <span className="block text-[10px] text-blue-500 uppercase font-bold">Admission No</span>
                                <span className="font-mono text-gray-800 font-bold">{student?.admission_number}</span>
                            </div>
                            <div className="border-l border-blue-200 pl-4">
                                <span className="block text-[10px] text-blue-500 uppercase font-bold">Student Name</span>
                                <span className="text-gray-800 font-medium">{student?.first_name} {student?.last_name}</span>
                            </div>
                            <div className="border-l border-blue-200 pl-4">
                                <span className="block text-[10px] text-blue-500 uppercase font-bold">Course</span>
                                <span className="text-gray-800 font-medium">{student?.program}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* 2. Fee Structure Inputs (Left Column - Spans 2 Cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                                    <BookOpen size={20} className="text-blue-600"/> Define Fee Structure
                                </h2>
                                <button onClick={handleSaveStructure} disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70">
                                    {saving ? <Loader2 className="animate-spin h-4 w-4"/> : <Save size={16} />} Save Structure
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 1st Year */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h3 className="font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">1st Year</h3>
                                    <InputRow year="year1" field="admissionFee" label="Admission" />
                                    <InputRow year="year1" field="collegeFee" label="College" />
                                    <InputRow year="year1" field="hostelFee" label="Hostel" />
                                    <InputRow year="year1" field="booksFee" label="Books" />
                                    <InputRow year="year1" field="uniformFee" label="Uniform" />
                                    <InputRow year="year1" field="clinicalFee" label="Clinical" />
                                    <InputRow year="year1" field="cautionDeposit" label="Caution" />
                                    <InputRow year="year1" field="busFee" label="Bus" />
                                    <InputRow year="year1" field="scholarship" label="Scholarship" />
                                </div>

                                {/* 2nd Year */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h3 className="font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">2nd Year</h3>
                                    <InputRow year="year2" field="collegeFee" label="College" />
                                    <InputRow year="year2" field="hostelFee" label="Hostel" />
                                    <InputRow year="year2" field="booksFee" label="Books" />
                                    <InputRow year="year2" field="clinicalFee" label="Clinical" />
                                    <InputRow year="year2" field="busFee" label="Bus" />
                                    <InputRow year="year2" field="scholarship" label="Scholarship" />
                                </div>

                                {/* 3rd Year */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h3 className="font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">3rd Year</h3>
                                    <InputRow year="year3" field="collegeFee" label="College" />
                                    <InputRow year="year3" field="hostelFee" label="Hostel" />
                                    <InputRow year="year3" field="booksFee" label="Books" />
                                    <InputRow year="year3" field="clinicalFee" label="Clinical" />
                                    <InputRow year="year3" field="busFee" label="Bus" />
                                    <InputRow year="year3" field="scholarship" label="Scholarship" />
                                </div>
                            </div>
                        </div>

                        {/* 4. Payment History Table */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                                <History size={20} className="text-orange-600"/> Payment History
                            </h2>
                            <div className="overflow-x-auto max-h-80 border rounded-lg">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-600 sticky top-0">
                                        <tr>
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Receipt No</th>
                                            <th className="py-3 px-4">Year</th>
                                            <th className="py-3 px-4">Fee Towards</th>
                                            <th className="py-3 px-4">Mode</th>
                                            <th className="py-3 px-4 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paymentsHistory.map((pay, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-600">{new Date(pay.date).toLocaleDateString()}</td>
                                                <td className="py-3 px-4 font-mono text-xs text-blue-600">{pay.receiptNo || 'N/A'}</td>
                                                <td className="py-3 px-4">{pay.year}</td>
                                                <td className="py-3 px-4 font-medium">{pay.feeTowards}</td>
                                                <td className="py-3 px-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{pay.mode}</span></td>
                                                <td className="py-3 px-4 text-right font-bold text-green-700">₹{pay.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {paymentsHistory.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-400">No payments recorded yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 3. Fee Payment Form (Right Column) */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 h-fit sticky top-6">
                            <h2 className="text-lg font-bold mb-4 text-blue-800 flex items-center gap-2">
                                <CreditCard size={20} /> Record Payment
                            </h2>
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                                    <input type="text" value={new Date().toLocaleDateString()} disabled className="w-full p-2 bg-gray-50 border rounded text-gray-500 font-medium" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
                                        <select 
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={payment.year}
                                            onChange={(e) => setPayment({...payment, year: e.target.value})}
                                        >
                                            <option value="year1">1st Year</option>
                                            <option value="year2">2nd Year</option>
                                            <option value="year3">3rd Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Mode</label>
                                        <select 
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={payment.mode}
                                            onChange={(e) => setPayment({...payment, mode: e.target.value})}
                                        >
                                            <option>Cash</option><option>Online</option><option>Cheque</option><option>DD</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fee Towards</label>
                                    <select 
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={payment.feeTowards}
                                        onChange={(e) => setPayment({...payment, feeTowards: e.target.value})}
                                    >
                                        <option value="College Fee">College Fee</option>
                                        <option value="Hostel Fee">Hostel Fee</option>
                                        <option value="Admission Fee">Admission Fee</option>
                                        <option value="Books Fee">Books Fee</option>
                                        <option value="Uniform Fee">Uniform Fee</option>
                                        <option value="Clinical Fee">Clinical Fee</option>
                                        <option value="Caution Deposit">Caution Deposit</option>
                                        <option value="Bus Fee">Bus Fee</option>
                                        <option value="Scholarship">Scholarship (Adjustment)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-lg text-gray-800 placeholder-gray-300"
                                        placeholder="0.00"
                                        value={payment.amount}
                                        onChange={(e) => setPayment({...payment, amount: e.target.value})}
                                    />
                                </div>

                                <div className="bg-gray-50 p-2 rounded border border-gray-200 min-h-[40px]">
                                    <span className="text-[10px] text-gray-400 block uppercase tracking-wide">Amount in words</span>
                                    <span className="text-xs font-medium text-blue-700 italic leading-tight block mt-0.5">
                                        {payment.amount ? numToWords(payment.amount) : "..."}
                                    </span>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18}/> : <PlusCircle size={18} />} 
                                    Record Payment
                                </button>
                            </form>
                        </div>

                        {/* Print Button (Only active if receipt exists) */}
                        {lastReceipt && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center animate-fade-in">
                                <div className="text-green-600 mb-2 flex justify-center"><Download size={32}/></div>
                                <p className="text-sm text-gray-600 mb-1">Last Receipt Generated</p>
                                <p className="text-lg font-mono font-bold text-gray-800 mb-3">{lastReceipt.receiptNo}</p>
                                <button 
                                    onClick={handlePrint}
                                    className="w-full bg-gray-800 text-white py-2.5 rounded-lg font-bold hover:bg-black transition flex justify-center items-center gap-2"
                                >
                                    <Printer size={18} /> Print Receipt (A6)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- HIDDEN RECEIPT COMPONENT (FOR PRINTING) --- */}
            <div style={{ display: 'none' }}>
                <div ref={componentRef} className="p-4 font-sans text-sm border border-black" style={{ width: '105mm', height: '148mm', margin: '0 auto' }}>
                    <div className="text-center border-b-2 border-black pb-2 mb-4">
                        <h2 className="text-xl font-extrabold uppercase tracking-wide">KGR Vocational College</h2>
                        <p className="text-xs">Vivek St, Sri Vidya Colony, Kakinada, AP</p>
                        <h3 className="font-bold mt-2 text-md border-2 border-black inline-block px-4 py-1 rounded">FEE RECEIPT</h3>
                    </div>
                    
                    <div className="flex justify-between text-xs mb-4">
                        <span><strong>Receipt No:</strong> {lastReceipt?.receiptNo}</span>
                        <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex border-b border-dashed border-gray-400 pb-1">
                            <strong className="w-32">Student Name:</strong> 
                            <span className="uppercase">{student?.first_name} {student?.last_name}</span>
                        </div>
                        <div className="flex border-b border-dashed border-gray-400 pb-1">
                            <strong className="w-32">Admission No:</strong> 
                            <span>{student?.admission_number}</span>
                        </div>
                        <div className="flex border-b border-dashed border-gray-400 pb-1">
                            <strong className="w-32">Course / Group:</strong> 
                            <span>{student?.program}</span>
                        </div>
                        <div className="flex border-b border-dashed border-gray-400 pb-1">
                            <strong className="w-32">Academic Year:</strong> 
                            <span>{lastReceipt?.year} Year</span>
                        </div>
                        <div className="flex border-b border-dashed border-gray-400 pb-1">
                            <strong className="w-32">Fee Towards:</strong> 
                            <span>{lastReceipt?.feeTowards}</span>
                        </div>
                        <div className="flex border-b border-dashed border-gray-400 pb-1">
                            <strong className="w-32">Payment Mode:</strong> 
                            <span>{lastReceipt?.mode}</span>
                        </div>
                    </div>

                    <div className="mt-6 border-t-2 border-b-2 border-black py-3 flex justify-between items-center bg-gray-100">
                        <strong className="text-lg pl-2">TOTAL AMOUNT:</strong>
                        <span className="text-xl font-bold pr-2">₹ {lastReceipt?.amount}/-</span>
                    </div>

                    <div className="mt-3 text-sm italic text-gray-700">
                        (In Words: {numToWords(lastReceipt?.amount)})
                    </div>

                    <div className="mt-12 flex justify-between text-xs font-bold pt-8">
                        <div className="text-center border-t border-black w-24 pt-1">Student Sig.</div>
                        <div className="text-center border-t border-black w-24 pt-1">Cashier Sig.</div>
                    </div>
                    
                    <div className="mt-6 text-[10px] text-center text-gray-500">
                        Generated by KGR Admin System. Subject to realization.
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StudentFeeManager;