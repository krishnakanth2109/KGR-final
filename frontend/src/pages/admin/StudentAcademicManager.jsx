// src/pages/admin/StudentAcademicManager.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentById } from '../../api/studentApi';
import { 
    getStudentExams, addStudentExam, deleteStudentExam,
    getStudentDocuments, uploadStudentDocument, deleteStudentDocument 
} from '../../api/adminStudentExtras';
import { ArrowLeft, Plus, Trash2, FileText, Calendar, Loader2, UploadCloud } from 'lucide-react';

const StudentAcademicManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [exams, setExams] = useState([]);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newExam, setNewExam] = useState({ subject: '', examDate: '', startTime: '', endTime: '', roomNo: '', examType: 'Theory', maxMarks: 100 });
    const [newDoc, setNewDoc] = useState({ title: '', type: 'Certificate', file: null });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadAllData();
    }, [id]);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [sData, eData, dData] = await Promise.all([
                getStudentById(id),
                getStudentExams(id),
                getStudentDocuments(id)
            ]);
            setStudent(sData);
            setExams(eData);
            setDocs(dData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS ---
    const handleAddExam = async (e) => {
        e.preventDefault();
        await addStudentExam(id, newExam);
        setNewExam({ subject: '', examDate: '', startTime: '', endTime: '', roomNo: '', examType: 'Theory', maxMarks: 100 });
        loadAllData();
    };

    const handleDeleteExam = async (examId) => {
        if(window.confirm("Delete this exam?")) {
            await deleteStudentExam(examId);
            loadAllData();
        }
    };

    const handleUploadDoc = async (e) => {
        e.preventDefault();
        if (!newDoc.file) return alert("Select a file");
        
        setUploading(true);
        const formData = new FormData();
        formData.append('title', newDoc.title);
        formData.append('type', newDoc.type);
        formData.append('file', newDoc.file);

        try {
            await uploadStudentDocument(id, formData);
            setNewDoc({ title: '', type: 'Certificate', file: null });
            // Reset file input
            document.getElementById('fileInput').value = ""; 
            loadAllData();
        } catch (err) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteDoc = async (docId) => {
        if(window.confirm("Delete this document?")) {
            await deleteStudentDocument(docId);
            loadAllData();
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft /></button>
                    <h1 className="text-2xl font-bold text-gray-800">Academic Manager: <span className="text-blue-600">{student?.first_name} {student?.last_name}</span></h1>
                </div>

                {/* --- EXAMS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Exam Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={18} /> Add Exam</h2>
                        <form onSubmit={handleAddExam} className="space-y-3">
                            <input placeholder="Subject" className="w-full p-2 border rounded" value={newExam.subject} onChange={e => setNewExam({...newExam, subject: e.target.value})} required />
                            <input type="date" className="w-full p-2 border rounded" value={newExam.examDate} onChange={e => setNewExam({...newExam, examDate: e.target.value})} required />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="time" className="p-2 border rounded" value={newExam.startTime} onChange={e => setNewExam({...newExam, startTime: e.target.value})} />
                                <input type="time" className="p-2 border rounded" value={newExam.endTime} onChange={e => setNewExam({...newExam, endTime: e.target.value})} />
                            </div>
                            <input placeholder="Room No" className="w-full p-2 border rounded" value={newExam.roomNo} onChange={e => setNewExam({...newExam, roomNo: e.target.value})} />
                            <select className="w-full p-2 border rounded" value={newExam.examType} onChange={e => setNewExam({...newExam, examType: e.target.value})}>
                                <option>Theory</option><option>Practical</option><option>Viva</option>
                            </select>
                            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Schedule</button>
                        </form>
                    </div>

                    {/* Exams List */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar size={18} /> Scheduled Exams</h2>
                        <div className="space-y-3">
                            {exams.length === 0 ? <p className="text-gray-400">No exams scheduled.</p> : exams.map(exam => (
                                <div key={exam._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{exam.subject} <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">{exam.examType}</span></h4>
                                        <p className="text-sm text-gray-500">{new Date(exam.examDate).toLocaleDateString()} • {exam.startTime} - {exam.endTime} • Room: {exam.roomNo}</p>
                                    </div>
                                    <button onClick={() => handleDeleteExam(exam._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- DOCUMENTS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upload Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><UploadCloud size={18} /> Upload Document</h2>
                        <form onSubmit={handleUploadDoc} className="space-y-3">
                            <input placeholder="Document Title" className="w-full p-2 border rounded" value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} required />
                            <select className="w-full p-2 border rounded" value={newDoc.type} onChange={e => setNewDoc({...newDoc, type: e.target.value})}>
                                <option>Certificate</option><option>Marksheet</option><option>ID</option><option>Official</option>
                            </select>
                            <input id="fileInput" type="file" className="w-full text-sm" onChange={e => setNewDoc({...newDoc, file: e.target.files[0]})} required />
                            <button disabled={uploading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-70 flex justify-center items-center gap-2">
                                {uploading ? <Loader2 className="animate-spin" size={18} /> : "Upload"}
                            </button>
                        </form>
                    </div>

                    {/* Documents List */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText size={18} /> Student Documents</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {docs.length === 0 ? <p className="text-gray-400 col-span-2">No documents uploaded.</p> : docs.map(doc => (
                                <div key={doc._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow relative group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded text-blue-600"><FileText size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 truncate w-32">{doc.title}</h4>
                                                <p className="text-xs text-gray-500">{doc.type}</p>
                                            </div>
                                        </div>
                                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-xs hover:underline mt-1 block">View</a>
                                    </div>
                                    <button onClick={() => handleDeleteDoc(doc._id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAcademicManager;