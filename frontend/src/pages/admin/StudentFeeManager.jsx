import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentById } from '../../api/studentApi';
import { 
    getStudentFees, updateStudentFees, 
    getChecklist, updateChecklist,
    getStudentFiles, uploadStudentFile, deleteStudentFile 
} from '../../api/adminStudentExtras';
import { 
    Save, ArrowLeft, Loader2, IndianRupee, CheckSquare, UploadCloud, Trash2, FileText, Download 
} from 'lucide-react';

const StudentFeeManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('fees');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [student, setStudent] = useState(null);

    // Data States
    const [fees, setFees] = useState({ year1: {}, year2: {}, year3: {} });
    const [checklist, setChecklist] = useState({});
    const [files, setFiles] = useState([]);
    
    // Upload State
    const [newFile, setNewFile] = useState({ title: '', file: null });
    const [uploading, setUploading] = useState(false);

    // Checklist Labels
    const checklistItems = [
        { key: 'sscMarks', label: '1. 10th Mark List' },
        { key: 'studyCertificates', label: '2. 6th to 10th Study Certificates' },
        { key: 'interMarks', label: '3. Inter Marks List' },
        { key: 'interStudy', label: '4. Inter Study' },
        { key: 'interTC', label: '5. Inter T.C' },
        { key: 'aadharStudent', label: '6. Student Aadhar Card Xerox' },
        { key: 'aadharMother', label: '7. Mother Aadhar Card Xerox' },
        { key: 'aadharFather', label: '8. Father Aadhar Card Xerox' },
        { key: 'bankPassbookJoint', label: '9. Joint Account Bank Pass Book (BC/ST/OC)' },
        { key: 'bankPassbookStudent', label: '10. Student Bank Pass Book (SC)' },
        { key: 'casteCertificate', label: '11. Caste Certificate Xerox' },
        { key: 'incomeCertificate', label: '12. Income Certificate / Rice Card' },
        { key: 'photos', label: '13. 8 Passport Size Photos' },
        { key: 'mobileNumber', label: '14. Mobile Number' },
    ];

    useEffect(() => {
        loadAllData();
    }, [id]);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [sData, fData, cData, fileData] = await Promise.all([
                getStudentById(id),
                getStudentFees(id),
                getChecklist(id),
                getStudentFiles(id)
            ]);
            setStudent(sData);
            setFees(fData);
            setChecklist(cData || {});
            setFiles(fileData);
        } catch (error) {
            console.error("Load Error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFees = async () => {
        setSaving(true);
        await updateStudentFees(id, fees);
        setSaving(false);
        alert('Fees Updated!');
    };

    const handleSaveChecklist = async () => {
        setSaving(true);
        await updateChecklist(id, checklist);
        setSaving(false);
        alert('Checklist Updated!');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newFile.file) return alert("Select file");
        setUploading(true);
        const formData = new FormData();
        formData.append('title', newFile.title);
        formData.append('file', newFile.file);
        await uploadStudentFile(id, formData);
        setNewFile({ title: '', file: null });
        document.getElementById('fileInput').value = "";
        const updatedFiles = await getStudentFiles(id);
        setFiles(updatedFiles);
        setUploading(false);
    };

    const handleDeleteFile = async (fileId) => {
        if(window.confirm("Delete this file?")) {
            await deleteStudentFile(fileId);
            setFiles(prev => prev.filter(f => f._id !== fileId));
        }
    };

    const FeeInput = ({ year, field, label }) => (
        <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 mb-1">{label}</label>
            <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">₹</span>
                <input 
                    type="number" 
                    value={fees[year]?.[field] || 0} 
                    onChange={(e) => setFees(prev => ({ 
                        ...prev, 
                        [year]: { ...prev[year], [field]: Number(e.target.value) } 
                    }))}
                    className="pl-7 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white"
                />
            </div>
        </div>
    );

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft /></button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Student Manager</h1>
                            <p className="text-gray-500">{student?.first_name} {student?.last_name} ({student?.admission_number})</p>
                        </div>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['documents'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- FEES TAB --- */}
               

                {/* --- DOCUMENTS TAB --- */}
                {activeTab === 'documents' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                        
                        {/* Checklist Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2"><CheckSquare /> Document Checklist</h2>
                                <button onClick={handleSaveChecklist} disabled={saving} className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">Save Checklist</button>
                            </div>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                {checklistItems.map(item => (
                                    <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        <div className="flex gap-2">
                                            {['Yes', 'No', 'Later'].map(opt => (
                                                <label key={opt} className={`cursor-pointer px-3 py-1 rounded text-xs font-bold border transition-colors ${checklist[item.key] === opt ? (opt === 'Yes' ? 'bg-green-100 border-green-300 text-green-700' : opt === 'Later' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : 'bg-red-100 border-red-300 text-red-700') : 'bg-white text-gray-500 border-gray-200'}`}>
                                                    <input 
                                                        type="radio" 
                                                        name={item.key} 
                                                        value={opt} 
                                                        checked={checklist[item.key] === opt} 
                                                        onChange={() => setChecklist(prev => ({ ...prev, [item.key]: opt }))}
                                                        className="hidden" 
                                                    />
                                                    {opt}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="space-y-6">
                            {/* Upload Form */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><UploadCloud /> Upload Scanned Document</h2>
                                <form onSubmit={handleUpload} className="space-y-3">
                                    <input 
                                        placeholder="Document Name (e.g. 10th Marks Memo)" 
                                        className="w-full p-2 border rounded-lg"
                                        value={newFile.title}
                                        onChange={e => setNewFile({ ...newFile, title: e.target.value })}
                                        required
                                    />
                                    <input type="file" id="fileInput" className="w-full text-sm" onChange={e => setNewFile({ ...newFile, file: e.target.files[0] })} required />
                                    <button disabled={uploading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex justify-center">
                                        {uploading ? <Loader2 className="animate-spin" /> : "Upload File"}
                                    </button>
                                </form>
                            </div>

                            {/* File List */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold mb-4">Uploaded Files</h2>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                    {files.length === 0 ? <p className="text-gray-400 text-sm">No files uploaded yet.</p> : files.map(file => (
                                        <div key={file._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 group">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-blue-500" size={20} />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{file.title}</p>
                                                    <p className="text-xs text-gray-500">{new Date(file.uploadDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a href={file.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Download size={16} /></a>
                                                <button onClick={() => handleDeleteFile(file._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentFeeManager;