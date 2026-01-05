import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentById } from '../../api/studentApi';
import { 
    getChecklist, updateChecklist,
    getStudentFiles, uploadStudentFile, deleteStudentFile 
} from '../../api/adminStudentExtras';
import { 
    ArrowLeft, Loader2, CheckSquare, UploadCloud, Trash2, FileText, Download 
} from 'lucide-react';

const StudentDocumentManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [student, setStudent] = useState(null);

    const [checklist, setChecklist] = useState({});
    const [files, setFiles] = useState([]);

    const [newFile, setNewFile] = useState({ title: '', file: null });
    const [uploading, setUploading] = useState(false);

    const checklistItems = [
        { key: 'sscMarks', label: '1. 10th Mark List' },
        { key: 'studyCertificates', label: '2. 6th to 10th Study Certificates' },
        { key: 'interMarks', label: '3. Inter Marks List' },
        { key: 'interStudy', label: '4. Inter Study' },
        { key: 'interTC', label: '5. Inter T.C' },
        { key: 'aadharStudent', label: '6. Student Aadhar Card Xerox' },
        { key: 'aadharMother', label: '7. Mother Aadhar Card Xerox' },
        { key: 'aadharFather', label: '8. Father Aadhar Card Xerox' },
        { key: 'bankPassbookJoint', label: '9. Joint Account Bank Pass Book' },
        { key: 'bankPassbookStudent', label: '10. Student Bank Pass Book' },
        { key: 'casteCertificate', label: '11. Caste Certificate Xerox' },
        { key: 'incomeCertificate', label: '12. Income Certificate / Rice Card' },
        { key: 'photos', label: '13. Passport Size Photos' },
        { key: 'mobileNumber', label: '14. Mobile Number' },
    ];

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [sData, cData, fileData] = await Promise.all([
                getStudentById(id),
                getChecklist(id),
                getStudentFiles(id)
            ]);
            setStudent(sData);
            setChecklist(cData || {});
            setFiles(fileData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChecklist = async () => {
        setSaving(true);
        await updateChecklist(id, checklist);
        setSaving(false);
        alert('Checklist Updated');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newFile.file) return alert("Select a file");

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
        if (window.confirm("Delete this file?")) {
            await deleteStudentFile(fileId);
            setFiles(prev => prev.filter(f => f._id !== fileId));
        }
    };

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center bg-white p-6 rounded-2xl shadow-sm">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft />
                    </button>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold">Student Documents</h1>
                        <p className="text-gray-500">
                            {student?.first_name} {student?.last_name} ({student?.admission_number})
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Checklist */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <CheckSquare /> Document Checklist
                            </h2>
                            <button
                                onClick={handleSaveChecklist}
                                disabled={saving}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Save
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {checklistItems.map(item => (
                                <div key={item.key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <div className="flex gap-2">
                                        {['Yes', 'No', 'Later'].map(opt => (
                                            <label key={opt} className={`px-3 py-1 text-xs font-bold rounded cursor-pointer border
                                                ${checklist[item.key] === opt ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                                                <input
                                                    type="radio"
                                                    hidden
                                                    checked={checklist[item.key] === opt}
                                                    onChange={() => setChecklist(prev => ({ ...prev, [item.key]: opt }))}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upload + Files */}
                    <div className="space-y-6">

                        {/* Upload */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <UploadCloud /> Upload Document
                            </h2>
                            <form onSubmit={handleUpload} className="space-y-3">
                                <input
                                    placeholder="Document Name"
                                    className="w-full p-2 border rounded-lg"
                                    value={newFile.title}
                                    onChange={e => setNewFile({ ...newFile, title: e.target.value })}
                                    required
                                />
                                <input
                                    type="file"
                                    id="fileInput"
                                    onChange={e => setNewFile({ ...newFile, file: e.target.files[0] })}
                                    required
                                />
                                <button
                                    disabled={uploading}
                                    className="w-full bg-green-600 text-white py-2 rounded-lg"
                                >
                                    {uploading ? <Loader2 className="animate-spin mx-auto" /> : "Upload"}
                                </button>
                            </form>
                        </div>

                        {/* Files */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="font-bold mb-4">Uploaded Files</h2>
                            <div className="space-y-3">
                                {files.length === 0 ? (
                                    <p className="text-sm text-gray-400">No files uploaded</p>
                                ) : files.map(file => (
                                    <div key={file._id} className="flex justify-between items-center p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-blue-500" />
                                            <div>
                                                <p className="text-sm font-bold">{file.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(file.uploadDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={file.fileUrl} target="_blank" rel="noreferrer">
                                                <Download size={16} />
                                            </a>
                                            <button onClick={() => handleDeleteFile(file._id)}>
                                                <Trash2 size={16} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDocumentManager;
