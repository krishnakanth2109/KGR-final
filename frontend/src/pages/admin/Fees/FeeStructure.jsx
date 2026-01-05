import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Layers, Check, ChevronDown, ChevronUp, 
  DollarSign, Edit, X, UserPlus, Search, Loader2, User 
} from 'lucide-react';
import { getAllFeeStructures, createFeeStructure, deleteFeeStructure, assignStudentFee } from '../../../api/feeApi';
import { fetchStudents } from '../../../api/studentApi';
import api from '../../../api/api'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- HELPER COMPONENT (MOVED OUTSIDE) ---
// This prevents the input from losing focus on re-renders
const FeeInput = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative group">
        <span className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">₹</span>
        <input 
          type="number" 
          value={value} 
          onChange={onChange}
          className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white hover:border-gray-400 font-medium text-gray-700 placeholder-gray-300 no-spinner"
          placeholder="0"
          min="0"
          onWheel={(e) => e.target.blur()} 
        />
      </div>
    </div>
  );
};

const FeeStructure = () => {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  // Edit/Create State
  const [activeTab, setActiveTab] = useState('year1');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Assignment State
  const [selectedStructureId, setSelectedStructureId] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Initial State
  const defaultYearData = { 
    admissionFee: '', collegeFee: '', hostelFee: '', scholarship: '', 
    booksFee: '', uniformFee: '', clinicalFee: '', cautionDeposit: '', busFee: '' 
  };

  const initialForm = {
    name: '',
    program: 'MPHW',
    academicYear: '',
    breakdown: {
      year1: { ...defaultYearData },
      year2: { ...defaultYearData },
      year3: { ...defaultYearData }
    }
  };

  const [form, setForm] = useState(initialForm);

  // --- 1. Load Structures ---
  useEffect(() => {
    loadStructures();
  }, []);

  const loadStructures = async () => {
    try {
      const data = await getAllFeeStructures();
      setStructures(data);
    } catch (error) {
      console.error("Failed to load structures");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Load Students for Dropdown ---
  useEffect(() => {
    if (isAssignModalOpen) {
      const delayDebounceFn = setTimeout(() => {
        loadStudents();
      }, 500); 
      return () => clearTimeout(delayDebounceFn);
    }
  }, [studentSearch, isAssignModalOpen]);

  const loadStudents = async () => {
    try {
      const data = await fetchStudents({ 
        globalSearch: studentSearch, 
        limit: 10,
        status: 'Active' 
      });
      setStudentList(data.students || []);
    } catch (error) {
      console.error("Failed to fetch students");
    }
  };

  // --- Handlers ---

  const handleInputChange = (year, field, value) => {
    // Store exactly what user types (string) to prevent jumps
    setForm(prev => ({
      ...prev,
      breakdown: {
        ...prev.breakdown,
        [year]: {
          ...prev.breakdown[year],
          [field]: value 
        }
      }
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    ['year1', 'year2', 'year3'].forEach(year => {
      if (form.breakdown[year]) {
        Object.values(form.breakdown[year]).forEach(val => {
          total += Number(val || 0);
        });
      }
    });
    return total;
  };

  const handleEditClick = (structure) => {
    const mergeYear = (yearKey) => ({
      ...defaultYearData, 
      ...(structure.breakdown?.[yearKey] || {})
    });

    setForm({
      name: structure.name || '',
      program: structure.program || 'MPHW',
      academicYear: structure.academicYear || '',
      breakdown: {
        year1: mergeYear('year1'),
        year2: mergeYear('year2'),
        year3: mergeYear('year3')
      }
    });
    setEditId(structure._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      // Convert empty strings to 0 before saving
      const payload = JSON.parse(JSON.stringify(form)); 
      
      ['year1', 'year2', 'year3'].forEach(year => {
        Object.keys(payload.breakdown[year]).forEach(key => {
            payload.breakdown[year][key] = Number(payload.breakdown[year][key] || 0);
        });
      });
      
      payload.totalAmount = calculateTotal();

      if (isEditing) {
        await api.put(`/fee-structures/${editId}`, payload)
             .catch(() => alert("Update failed"));
        alert("Fee Structure Updated Successfully!");
      } else {
        await createFeeStructure(payload);
        alert("Fee Structure Created Successfully!");
      }
      
      closeModal();
      loadStructures();
    } catch (error) {
      console.error(error);
      alert("Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this fee structure?")) return;
    try {
      await deleteFeeStructure(id);
      setStructures(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- Assignment Handlers ---

  const openAssignModal = (structureId) => {
    setSelectedStructureId(structureId);
    setStudentSearch('');
    setSelectedStudent(null);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedStudent || !selectedStructureId) return alert("Select a student first.");
    
    setIsAssigning(true);
    try {
      const struct = structures.find(s => s._id === selectedStructureId);
      
      await assignStudentFee({
        studentId: selectedStudent._id,
        feeStructureId: selectedStructureId,
        totalPayable: struct.totalAmount,
        discount: 0
      });

      alert(`Successfully assigned ${struct.name} to ${selectedStudent.first_name}`);
      setIsAssignModalOpen(false);
    } catch (error) {
      alert("Assignment Failed.");
    } finally {
      setIsAssigning(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditId(null);
    setForm(initialForm);
    setActiveTab('year1');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* Global CSS to hide spinner arrows */}
      <style>{`
        .no-spinner::-webkit-inner-spin-button, 
        .no-spinner::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .no-spinner { 
          -moz-appearance: textfield; 
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
           <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Fee Management</h2>
           <p className="text-gray-500 mt-1">Create and manage academic fee structures.</p>
        </div>
        <button 
          onClick={() => {
              setForm(initialForm); 
              setIsEditing(false);
              setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20}/> Create New Structure
        </button>
      </div>

      {/* --- STRUCTURE LIST --- */}
      <div className="grid grid-cols-1 gap-6">
          {loading ? (
             <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : structures.map(s => (
             <StructureCard 
                key={s._id} 
                data={s} 
                onEdit={handleEditClick} 
                onDelete={handleDelete}
                onAssign={openAssignModal} 
             />
          ))}

          {!loading && structures.length === 0 && (
             <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                <Layers size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-500">No Fee Structures Found</h3>
                <p className="text-gray-400">Click "Create New Structure" to start.</p>
             </div>
          )}
      </div>

      {/* --- CREATE/EDIT MODAL --- */}
      <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center shrink-0">
               <div>
                 <h3 className="text-xl font-bold flex items-center gap-2">
                   {isEditing ? <Edit size={20}/> : <Layers size={20}/>} 
                   {isEditing ? 'Edit Fee Structure' : 'New Fee Structure'}
                 </h3>
                 <p className="text-gray-400 text-sm mt-1">Define complete fee breakdown.</p>
               </div>
               <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-full transition"><X size={20}/></button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <form id="feeForm" onSubmit={handleCreateOrUpdate}>
                
                {/* 1. Basic Info Section */}
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8">
                  <h4 className="text-sm font-bold text-blue-800 uppercase mb-4 tracking-wide">1. Batch Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Structure Name</label>
                        <input className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. MPHW 2024-25" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Program</label>
                        <select className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={form.program} onChange={e => setForm({...form, program: e.target.value})}>
                          <option value="MPHW">MPHW</option><option value="MLT">MLT</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Academic Batch</label>
                        <input className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 2024-2025" value={form.academicYear} onChange={e => setForm({...form, academicYear: e.target.value})} required />
                    </div>
                  </div>
                </div>

                {/* 2. Fee Breakdown Section */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-800 uppercase mb-4 tracking-wide">2. Fee Breakdown</h4>
                  
                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-gray-200 mb-6">
                    {['year1', 'year2', 'year3'].map((year, idx) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setActiveTab(year)}
                        className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all relative top-[1px] border-t border-l border-r ${
                          activeTab === year 
                            ? 'bg-white text-blue-600 border-gray-200 border-b-transparent z-10' 
                            : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        {idx + 1}{idx === 0 ? 'st' : idx === 1 ? 'nd' : 'rd'} Year
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Inputs Based on Active Tab */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 animate-fade-in" key={activeTab}>
                    {/* Common Inputs for Year 1 */}
                    {activeTab === 'year1' && (
                        <FeeInput 
                            label="Admission Fee" 
                            value={form.breakdown.year1.admissionFee} 
                            onChange={(e) => handleInputChange('year1', 'admissionFee', e.target.value)}
                        />
                    )}
                    
                    {/* Generic Inputs for All Years */}
                    <FeeInput 
                        label="College Fee" 
                        value={form.breakdown[activeTab].collegeFee} 
                        onChange={(e) => handleInputChange(activeTab, 'collegeFee', e.target.value)}
                    />
                    <FeeInput 
                        label="Hostel Fee" 
                        value={form.breakdown[activeTab].hostelFee} 
                        onChange={(e) => handleInputChange(activeTab, 'hostelFee', e.target.value)}
                    />
                    <FeeInput 
                        label="Books Fee" 
                        value={form.breakdown[activeTab].booksFee} 
                        onChange={(e) => handleInputChange(activeTab, 'booksFee', e.target.value)}
                    />
                    <FeeInput 
                        label="Uniform Fee" 
                        value={form.breakdown[activeTab].uniformFee} 
                        onChange={(e) => handleInputChange(activeTab, 'uniformFee', e.target.value)}
                    />
                    <FeeInput 
                        label="Clinical Fee" 
                        value={form.breakdown[activeTab].clinicalFee} 
                        onChange={(e) => handleInputChange(activeTab, 'clinicalFee', e.target.value)}
                    />
                    <FeeInput 
                        label="Caution Deposit" 
                        value={form.breakdown[activeTab].cautionDeposit} 
                        onChange={(e) => handleInputChange(activeTab, 'cautionDeposit', e.target.value)}
                    />
                    <FeeInput 
                        label="Bus Fee" 
                        value={form.breakdown[activeTab].busFee} 
                        onChange={(e) => handleInputChange(activeTab, 'busFee', e.target.value)}
                    />
                    <FeeInput 
                        label="Scholarship" 
                        value={form.breakdown[activeTab].scholarship} 
                        onChange={(e) => handleInputChange(activeTab, 'scholarship', e.target.value)}
                    />
                  </div>
                </div>

                {/* Footer / Total */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-100">
                  <div className="bg-gray-50 px-6 py-4 rounded-xl w-full md:w-auto flex items-center gap-4 border border-gray-200">
                     <div className="p-3 bg-green-100 text-green-700 rounded-full"><DollarSign size={24}/></div>
                     <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Calculated Fee</p>
                        <p className="text-3xl font-extrabold text-gray-800">₹ {calculateTotal().toLocaleString()}</p>
                     </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button type="button" onClick={closeModal} className="flex-1 px-6 py-3 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <Check size={20}/> {isEditing ? 'Update Structure' : 'Save Structure'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* --- ASSIGN STUDENT MODAL --- */}
      <AnimatePresence>
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
             <div className="bg-indigo-600 text-white p-5 flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2"><UserPlus size={20}/> Assign to Student</h3>
                <button onClick={() => setIsAssignModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={20}/></button>
             </div>
             
             <div className="p-6 space-y-4">
                {/* Search Input */}
                <div className="relative">
                   <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
                   <input 
                      className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Search Student Name or ID..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                   />
                </div>

                {/* Student List */}
                <div className="max-h-60 overflow-y-auto border rounded-xl divide-y">
                   {studentList.length === 0 ? (
                      <p className="p-4 text-center text-gray-500 text-sm">No students found.</p>
                   ) : (
                      studentList.map(stu => (
                         <div 
                            key={stu._id} 
                            onClick={() => setSelectedStudent(stu)}
                            className={`p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-50 transition ${selectedStudent?._id === stu._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                         >
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"><User size={16}/></div>
                               <div>
                                  <p className="text-sm font-bold text-gray-800">{stu.first_name} {stu.last_name}</p>
                                  <p className="text-xs text-gray-500">{stu.admission_number}</p>
                               </div>
                            </div>
                            {selectedStudent?._id === stu._id && <Check className="text-indigo-600" size={18}/>}
                         </div>
                      ))
                   )}
                </div>

                {/* Confirm Button */}
                <button 
                  onClick={handleAssignSubmit}
                  disabled={!selectedStudent || isAssigning}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isAssigning ? <Loader2 className="animate-spin"/> : "Confirm Assignment"}
                </button>
             </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
};

// Sub-component: Structure Card
const StructureCard = ({ data, onEdit, onDelete, onAssign }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Card Header */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
         <div className="flex items-center gap-5">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md">
                <Layers size={24}/>
            </div>
            <div>
               <h4 className="text-lg font-bold text-gray-900">{data.name}</h4>
               <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span className="bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-700">{data.program}</span>
                  <span>•</span>
                  <span>Batch: {data.academicYear}</span>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right mr-4 hidden md:block">
               <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Total Fee</p>
               <p className="text-xl font-extrabold text-green-600">₹ {data.totalAmount?.toLocaleString() || 0}</p>
            </div>
            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => onAssign(data._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition"
                  title="Assign to Student"
                >
                   <UserPlus size={16}/> Assign
                </button>
                <button onClick={() => onEdit(data)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                   <Edit size={18}/>
                </button>
                <button onClick={() => onDelete(data._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                   <Trash2 size={18}/>
                </button>
                <button onClick={() => setExpanded(!expanded)} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg">
                   {expanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                </button>
            </div>
         </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50/50 border-t border-gray-100"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
               {['year1', 'year2', 'year3'].map((y, i) => (
                 <div key={y} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h5 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-3 flex justify-between">
                        Year {i+1}
                        <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded">
                           ₹ {Object.values(data.breakdown?.[y] || {}).reduce((a,b)=>a+Number(b),0).toLocaleString()}
                        </span>
                    </h5>
                    <div className="space-y-2.5">
                      {data.breakdown?.[y] && Object.entries(data.breakdown[y]).map(([key, val]) => (
                         val > 0 && (
                           <div key={key} className="flex justify-between text-sm group">
                              <span className="text-gray-500 capitalize group-hover:text-blue-600 transition-colors">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="font-medium text-gray-800">₹{val.toLocaleString()}</span>
                           </div>
                         )
                      ))}
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeeStructure;