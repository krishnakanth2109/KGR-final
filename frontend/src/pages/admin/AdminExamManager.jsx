import React, { useState, useEffect } from 'react';
import { bulkCreateExams, fetchBatchExams } from '../../api/adminStudentExtras'; 
import { Calendar, Plus, Save, Loader2, Users, Clock, CheckCircle, RefreshCw, Trash2, Edit } from 'lucide-react';

const AdminExamManager = () => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [batch, setBatch] = useState({ program: 'MPHW', admissionYear: new Date().getFullYear().toString() });
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

  // --- 1. Fetch Logic ---
  useEffect(() => {
    loadBatchExams();
  }, [batch.program, batch.admissionYear]);

  const loadBatchExams = async () => {
    setFetchLoading(true);
    try {
        console.log(`Fetching exams for ${batch.program} - ${batch.admissionYear}...`);
        const data = await fetchBatchExams(batch.program, batch.admissionYear);
        console.log("Exams fetched:", data); // Debugging log
        setScheduledExams(data || []);
    } catch (err) {
        console.error("Failed to load exams", err);
        alert("Failed to load existing exams. Check console for details.");
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
        admissionYear: Number(batch.admissionYear),
        examDetails: examDetails
      });

      alert(response.message);
      
      // Reset Form
      setExamDetails({ subject: '', examDate: '', startTime: '', endTime: '', roomNo: '', examType: 'Theory', maxMarks: 100 });
      
      // Refresh the table immediately
      await loadBatchExams(); 

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to publish exam schedule.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-slate-800">
      
      {/* CSS for Inputs */}
      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; margin-left: 0.25rem; }
        .input { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background-color: #f8fafc; font-weight: 600; color: #334155; outline: none; transition: all 0.2s; }
        .input:focus { background-color: #ffffff; ring: 2px; ring-color: #dbeafe; border-color: #3b82f6; }
      `}</style>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Calendar size={28} /></div>
            Exam Scheduler
        </h1>
        <button onClick={loadBatchExams} className="p-2 bg-white border rounded-full hover:bg-gray-50 text-gray-500 hover:text-blue-600 transition-colors" title="Refresh List">
            <RefreshCw size={20} className={fetchLoading ? "animate-spin" : ""} />
        </button>
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
                <label className="label">Program</label>
                <select 
                  className="input"
                  value={batch.program}
                  onChange={(e) => setBatch({...batch, program: e.target.value})}
                >
                  <option>MPHW</option>
                  <option>MLT</option>
                  <option>GNM</option>
                </select>
              </div>
              <div>
                <label className="label">Admission Year</label>
                <input 
                  type="number" 
                  className="input"
                  value={batch.admissionYear}
                  onChange={(e) => setBatch({...batch, admissionYear: e.target.value})}
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
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="label">Subject Name</label>
                  <input required className="input" placeholder="e.g. Anatomy & Physiology" value={examDetails.subject} onChange={e => setExamDetails({...examDetails, subject: e.target.value})} />
                </div>
                <div>
                  <label className="label">Date</label>
                  <input type="date" required className="input" value={examDetails.examDate} onChange={e => setExamDetails({...examDetails, examDate: e.target.value})} />
                </div>
                <div>
                  <label className="label">Exam Type</label>
                  <select className="input" value={examDetails.examType} onChange={e => setExamDetails({...examDetails, examType: e.target.value})}>
                    <option>Theory</option>
                    <option>Practical</option>
                    <option>Viva</option>
                  </select>
                </div>
                <div>
                  <label className="label">Start Time</label>
                  <input type="time" className="input" value={examDetails.startTime} onChange={e => setExamDetails({...examDetails, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="label">End Time</label>
                  <input type="time" className="input" value={examDetails.endTime} onChange={e => setExamDetails({...examDetails, endTime: e.target.value})} />
                </div>
                <div>
                  <label className="label">Room No</label>
                  <input className="input" placeholder="e.g. Hall-A" value={examDetails.roomNo} onChange={e => setExamDetails({...examDetails, roomNo: e.target.value})} />
                </div>
                <div>
                  <label className="label">Max Marks</label>
                  <input type="number" className="input" value={examDetails.maxMarks} onChange={e => setExamDetails({...examDetails, maxMarks: e.target.value})} />
                </div>
              </div>

              <div className="pt-4">
                <button disabled={loading} className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 flex justify-center items-center gap-2 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  Publish Exam Schedule
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl h-fit sticky top-6">
            <h3 className="text-orange-900 font-bold mb-2">How this works</h3>
            <p className="text-orange-800 text-sm leading-relaxed mb-4">
                This tool allows you to create an exam event and automatically assign it to every student in the selected batch.
            </p>
            <ul className="text-orange-800 text-sm list-disc pl-4 space-y-2 marker:text-orange-400">
                <li>Select the <b>Program</b> and <b>Year</b> first.</li>
                <li>Fill in the details.</li>
                <li>Click <b>Publish</b>.</li>
                <li>The system will find matching students and insert the exam record into their profiles.</li>
            </ul>
            </div>
        </div>

      </div>

      {/* --- SCHEDULED EXAMS LIST --- */}
      <div className="mt-12 animate-fade-in-up">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={24}/> 
            Scheduled Exams for {batch.program} - {batch.admissionYear}
        </h2>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {fetchLoading ? (
                <div className="p-20 flex justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : scheduledExams.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                    <Calendar size={48} className="mx-auto mb-3 opacity-20"/>
                    <p>No exams found for this batch yet.</p>
                </div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500">
                            <th className="p-4 pl-6">Date</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Room</th>
                            <th className="p-4">Max Marks</th>
                            <th className="p-4">Students Assigned</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {scheduledExams.map((exam, idx) => {
                            // UPDATED: Now accessing flat properties directly
                            return (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 pl-6 font-medium text-gray-700">
                                        {exam.examDate ? new Date(exam.examDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">{exam.subject || 'Unknown'}</td>
                                    <td className="p-4 text-sm text-gray-600 flex items-center gap-1">
                                        <Clock size={14} className="text-gray-400"/>
                                        {exam.startTime || '--:--'} - {exam.endTime || '--:--'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            exam.examType === 'Theory' ? 'bg-blue-50 text-blue-700' : 
                                            exam.examType === 'Practical' ? 'bg-purple-50 text-purple-700' :
                                            'bg-pink-50 text-pink-700'
                                        }`}>
                                            {exam.examType || 'Theory'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{exam.roomNo || 'TBA'}</td>
                                    <td className="p-4 text-sm font-semibold text-gray-700">{exam.maxMarks || 100}</td>
                                    <td className="p-4">
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                                            <Users size={12}/>
                                            {exam.studentCount || 0}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
      </div>

    </div>
  );
};

export default AdminExamManager;