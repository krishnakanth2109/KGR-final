import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { Search, Eye, IndianRupee } from 'lucide-react';

const AdminFeeManager = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Assuming your students endpoint supports getting basic info list
      const res = await api.get('/students?limit=1000'); 
      setStudents(res.data.students);
    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.first_name.toLowerCase().includes(search.toLowerCase()) || 
    s.admission_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <IndianRupee className="text-blue-600" /> Fee Management
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            placeholder="Search Student..." 
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Course</th>
              <th className="py-3 px-6">Year</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
            ) : filteredStudents.map(student => (
              <tr key={student._id} className="hover:bg-blue-50 transition-colors">
                <td className="py-3 px-6 font-mono text-gray-500">{student.admission_number}</td>
                <td className="py-3 px-6 font-medium">{student.first_name} {student.last_name}</td>
                <td className="py-3 px-6">{student.program}</td>
                <td className="py-3 px-6">{student.admission_year}</td>
                <td className="py-3 px-6 text-center">
                  <button 
                    onClick={() => navigate(`/admin/students/fees/${student._id}`)}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto bg-blue-100 px-3 py-1 rounded-md"
                  >
                    <Eye size={16} /> Manage Fees
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeeManager;