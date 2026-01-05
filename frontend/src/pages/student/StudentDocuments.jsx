import React, { useEffect, useState } from 'react';
import { getStudentDocuments, uploadStudentDocument, deleteStudentDocument } from '../../api/adminStudentExtras';
import { UploadCloud, FileText, Trash2, Loader2, Download } from 'lucide-react';

const StudentDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newFile, setNewFile] = useState({ title: '', file: null });
  const student = JSON.parse(sessionStorage.getItem('student-user'));

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    if(student?.id) {
        const data = await getStudentDocuments(student.id);
        setDocs(data);
        setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if(!newFile.file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('title', newFile.title);
    fd.append('file', newFile.file);
    fd.append('type', 'Student Upload');

    try {
        await uploadStudentDocument(student.id, fd);
        setNewFile({ title: '', file: null });
        loadDocs();
    } catch(err) { alert("Upload failed"); } 
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if(confirm("Delete?")) {
        await deleteStudentDocument(id);
        setDocs(prev => prev.filter(d => d._id !== id));
    }
  };

  if(loading) return <div className="p-10"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
      
      {/* Upload Area */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
        <h2 className="font-bold text-blue-800 mb-4 flex gap-2"><UploadCloud/> Upload New Document</h2>
        <form onSubmit={handleUpload} className="flex gap-4 items-end flex-wrap">
            <input 
                className="flex-1 p-2 border rounded" 
                placeholder="Document Title" 
                value={newFile.title}
                onChange={e => setNewFile({...newFile, title: e.target.value})}
                required
            />
            <input 
                type="file" 
                className="flex-1 p-2 border rounded bg-white"
                onChange={e => setNewFile({...newFile, file: e.target.files[0]})}
                required
            />
            <button disabled={uploading} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map(doc => (
            <div key={doc._id} className="bg-white p-4 rounded-xl border hover:shadow-md transition relative group">
                <div className="flex items-start gap-3">
                    <div className="p-3 bg-gray-100 rounded-lg text-gray-600"><FileText size={24}/></div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">{doc.title}</h3>
                        <p className="text-xs text-gray-500">{new Date(doc.uploadDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <a href={doc.fileUrl} target="_blank" className="flex-1 text-center bg-blue-50 text-blue-600 py-1 rounded text-sm font-semibold hover:bg-blue-100 flex justify-center items-center gap-1">
                        <Download size={14}/> View
                    </a>
                    <button onClick={() => handleDelete(doc._id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                </div>
            </div>
        ))}
        {docs.length === 0 && <p className="text-gray-400 col-span-3 text-center py-10">No documents found.</p>}
      </div>
    </div>
  );
};

export default StudentDocuments;