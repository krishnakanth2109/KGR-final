// src/pages/admin/AdminDocumentManager.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { 
  Search, 
  FileText, 
  Eye, 
  Trash2, 
  Edit, 
  MoreVertical, 
  RefreshCw,
  User,
  Filter
} from 'lucide-react';

const AdminDocumentManager = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // --- Initial Data Fetch ---
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/students?limit=1000'); 
      // Assuming res.data.students is the array, adjust if your API differs
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- Handlers ---
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete student: ${name}? All associated documents will be lost.`)) {
      try {
        await api.delete(`/students/${id}`);
        setStudents(students.filter(s => s._id !== id));
        alert('Student deleted successfully');
      } catch (err) {
        alert('Failed to delete student');
      }
    }
  };

  // --- Filtering Logic ---
  const filteredStudents = students.filter(s => {
    const term = search.toLowerCase();
    const name = `${s.first_name} ${s.last_name}`.toLowerCase();
    const admNum = s.admission_number ? s.admission_number.toLowerCase() : '';
    return name.includes(term) || admNum.includes(term);
  });

  // --- Render ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <FileText size={24} />
            </div>
            Document Verification Center
          </h1>
          <p className="text-gray-500 text-sm mt-1 ml-12">
            Manage student documentation, checklists, and academic records.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input 
              placeholder="Search Name or ID..." 
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <button 
            onClick={fetchStudents} 
            className={`p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all shadow-sm ${refreshing ? 'animate-spin' : ''}`}
            title="Refresh List"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Admission ID</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span>Loading student records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No students found matching your search.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-purple-50/30 transition-colors group">
                    
                    {/* ID */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {student.admission_number || 'N/A'}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{student.first_name} {student.last_name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.program === 'MPHW' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {student.program || 'General'}
                      </span>
                    </td>

                    {/* Contact (Mocked if not available in basic list) */}
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {student.phone || student.email || 'No contact info'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* 1. View Documents (Primary Action) */}
                        <button 
                          onClick={() => navigate(`/admin/students/fees/${student._id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition shadow-sm hover:shadow-md"
                          title="Manage Documents & Fees"
                        >
                          <Eye size={14} /> View Docs
                        </button>

                        {/* 2. Edit Student */}
                        <button 
                          onClick={() => navigate(`/admin/students/edit/${student._id}`)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Profile"
                        >
                          <Edit size={16} />
                        </button>

                        {/* 3. Delete Student */}
                        <button 
                          onClick={() => handleDelete(student._id, student.first_name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer / Pagination (Static for now) */}
        {!loading && filteredStudents.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
            <span>Showing {filteredStudents.length} students</span>
            {/* Pagination controls could go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocumentManager;