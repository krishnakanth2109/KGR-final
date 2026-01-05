import React, { useState, useEffect } from 'react';
import { bulkCreateExams, fetchBatchExams } from '../../api/adminStudentExtras'; 
import api from '../../api/api'; // Import your central API instance
import { Calendar, Save, Loader2, Users, Clock, RefreshCw, Trash2, CheckCircle, BookOpen } from 'lucide-react';

const AdminExamManager = () => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  
  // State for dynamic courses
  const [courses, setCourses] = useState([]); 

  const [batch, setBatch] = useState({ program: '', admissionYear: new Date().getFullYear().toString() });
  const [scheduledExams, setScheduledExams] = useState([]); 
  
  const [examDetails, setExamDetails] = useState({
    subject: '',
    examDate: '',
    startTime: '',
    endTime: '',
    roomNo: '',
    examType: 'Theory',
    maxMarks: 100
  });

  // --- 1. Fetch Courses on Mount ---
  useEffect(() => {
    const loadCourses = async () => {
        try {
            const res = await api.get('/courses'); // Uses your existing courses route
            setCourses(res.data || []);
            // Set default program if available
            if(res.data.length > 0) {
                setBatch(prev => ({ ...prev, program: res.data[0].title })); // Assuming Course model has 'title'
            }
        } catch (err) {
            console.error("Failed to load courses:", err);
        }
    };
    loadCourses();
  }, []);

  // --- 2. Load Exams when Batch Changes ---
  useEffect(() => {
    if(batch.program && batch.admissionYear) {
        loadBatchExams();
    }
  }, [batch.program, batch.admissionYear]);

  const loadBatchExams = async () => {
    setFetchLoading(true);
    try {
        const data = await fetchBatchExams(batch.program, batch.admissionYear);
        setScheduledExams(data || []);
    } catch (err) {
        console.error("Failed to load exams", err);
    } finally {
        setFetchLoading(false);
    }
  };

  const handlePublishExam = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Publish this exam to ALL ${batch.program} students from batch ${batch.admissionYear}?`)) return;

    setLoading(true);
    try {
      const response = await bulkCreateExams({
        program: batch.program,
        admissionYear: batch.admissionYear,
        examDetails: examDetails
      });

      alert(response.message);
      
      // Reset Form
      setExamDetails({ ...examDetails, subject: '', examDate: '', startTime: '', endTime: '' });
      
      // Refresh list
      loadBatchExams(); 

    } catch (err) {
      const msg = err.response?.data?.message || "Failed to publish exam schedule.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-slate-800">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Calendar size={28} /></div>
            Administrator Portal - Exam Scheduler
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Configuration Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step 1: Select Batch */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">1</div>
              Select Target Batch
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Program / Course</label>
                <div className="relative">
                    <select 
                    className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold appearance-none"
                    value={batch.program}
                    onChange={(e) => setBatch({...batch, program: e.target.value})}
                    >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                        <option key={course._id} value={course.title}>
                            {course.title} 
                        </option>
                    ))}
                    </select>
                    <BookOpen size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Academic Year</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                  value={batch.admissionYear}
                  onChange={(e) => setBatch({...batch, admissionYear: e.target.value})}
                  placeholder="e.g. 2024"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Exam Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-bold">2</div>
              Exam Details
            </h2>
            <form onSubmit={handlePublishExam} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject Name</label>
                <input 
                    required 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold" 
                    placeholder="e.g. Anatomy & Physiology" 
                    value={examDetails.subject} 
                    onChange={e => setExamDetails({...examDetails, subject: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date</label>
                  <input type="date" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold" value={examDetails.examDate} onChange={e => setExamDetails({...examDetails, examDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Exam Type</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold" value={examDetails.examType} onChange={e => setExamDetails({...examDetails, examType: e.target.value})}>
                    <option>Theory</option>
                    <option>Practical</option>
                    <option>Viva</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Start Time</label>
                  <input type="time" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold" value={examDetails.startTime} onChange={e => setExamDetails({...examDetails, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">End Time</label>
                  <input type="time" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold" value={examDetails.endTime} onChange={e => setExamDetails({...examDetails, endTime: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Room No</label>
                  <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold" placeholder="e.g. Hall-A" value={examDetails.roomNo} onChange={e => setExamDetails({...examDetails, roomNo: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Max Marks</label>
                  <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold" value={examDetails.maxMarks} onChange={e => setExamDetails({...examDetails, maxMarks: e.target.value})} />
                </div>
              </div>

              <div className="pt-4">
                <button disabled={loading} className="w-full bg-[#EA580C] text-white font-bold py-4 rounded-xl hover:bg-orange-700 flex justify-center items-center gap-2 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  Publish Exam Schedule
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Existing Exams Table */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800">Scheduled Exams</h3>
                    <button onClick={loadBatchExams} className="p-2 hover:bg-gray-100 rounded-full text-slate-500">
                        <RefreshCw size={18} className={fetchLoading ? "animate-spin" : ""} />
                    </button>
                </div>

                {fetchLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500"/></div>
                ) : scheduledExams.length === 0 ? (
                    <p className="text-center text-slate-400 py-10 text-sm">No exams found for this batch.</p>
                ) : (
                    <div className="space-y-3">
                        {scheduledExams.map((exam, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 text-sm">{exam.subject}</h4>
                                    <span className="text-[10px] font-bold bg-white border px-2 py-1 rounded text-slate-500">{exam.examType}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                    <Calendar size={12}/> {new Date(exam.examDate).toLocaleDateString()}
                                    <span className="text-slate-300">|</span>
                                    <Clock size={12}/> {exam.startTime} - {exam.endTime}
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                        Max: {exam.maxMarks}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                        <Users size={10}/> {exam.studentCount} Students
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminExamManager;