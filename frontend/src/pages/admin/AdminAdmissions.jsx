// --- START OF FILE src/pages/admin/AdminAdmissions.jsx ---

import React, { useEffect, useState } from 'react';
import api from '../../api/api'; 
import { 
  FileText, 
  Search, 
  Trash2, 
  Calendar, 
  Phone, 
  Mail,
  Eye,
  RefreshCw,
  User,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const AdminAdmissions = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'submissionDate', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, sortConfig, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admissions');
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching admissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      try {
        await api.delete(`/admissions/${id}`);
        setApplications(applications.filter(app => app._id !== id));
      } catch (error) {
        alert("Failed to delete application");
      }
    }
  };

  // --- Handle Status Update ---
  const updateStatus = async (id, newStatus) => {
    try {
      // 1. Optimistic Update (UI updates instantly)
      setApplications(prev => prev.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      ));

      // 2. API Call to persist changes
      await api.put(`/admissions/${id}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to save status on server. Please try again.");
      fetchApplications(); // Revert on failure
    }
  };

  const filterAndSortApplications = () => {
    let filtered = applications.filter(app => {
      const matchesSearch = (
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm)
      );
      
      const matchesStatus = statusFilter === 'all' || (app.status || 'Pending') === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'submissionDate') {
        const dateA = new Date(a.submissionDate);
        const dateB = new Date(b.submissionDate);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (sortConfig.key === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortConfig.direction === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      
      return 0;
    });

    setFilteredApps(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Helper for Status Badge Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Interested': return 'bg-green-100 text-green-700 border-green-200';
      case 'Not Interested': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200'; // Pending
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admission Applications</h1>
            <p className="text-gray-500 text-sm mt-1">Review inquiries and manage lead status</p>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-5xl">
          {/* Total */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Applications</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{applications.length}</p>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
          </div>
          
          {/* Interested */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">Interested Leads</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {applications.filter(a => a.status === 'Interested').length}
              </p>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {applications.filter(a => !a.status || a.status === 'Pending').length}
              </p>
            </div>
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={20} /></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Name, Email or Phone..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* Status Filter Dropdown */}
            <div className="relative min-w-[160px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select 
                className="w-full pl-9 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-gray-50 cursor-pointer text-gray-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            <button 
              onClick={fetchApplications}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-sm"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left w-[20%]">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900" onClick={() => handleSort('name')}>
                      <span>Name</span> <SortIcon columnKey="name" />
                    </button>
                  </th>
                  <th className="p-4 text-left w-[20%] text-sm font-semibold text-gray-700">Email</th>
                  <th className="p-4 text-left w-[15%] text-sm font-semibold text-gray-700">Phone</th>
                  <th className="p-4 text-left w-[15%]">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900" onClick={() => handleSort('submissionDate')}>
                      <span>Date Added</span> <SortIcon columnKey="submissionDate" />
                    </button>
                  </th>
                  <th className="p-4 text-left w-[18%] text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-4 text-center w-[12%] text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app, index) => (
                  <React.Fragment key={app._id}>
                    <tr className={`border-b border-gray-100 hover:bg-blue-50/30 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      
                      {/* Name & Avatar */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm border border-blue-100">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">{app.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Mail size={14} className="text-gray-400" />
                          <span className="truncate" title={app.email}>{app.email}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Phone size={14} className="text-gray-400" />
                          <span>{app.phone}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(app.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <div className="relative">
                          <select 
                            className={`w-full py-1.5 pl-3 pr-8 rounded-lg text-xs font-semibold border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 transition-all ${getStatusStyle(app.status || 'Pending')}`}
                            value={app.status || 'Pending'}
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Interested">Interested</option>
                            <option value="Not Interested">Not Interested</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 pointer-events-none" size={12} />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setExpandedRow(expandedRow === app._id ? null : app._id)}
                            className={`p-2 rounded-full transition ${expandedRow === app._id ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                            title={expandedRow === app._id ? "Close Details" : "Quick View"}
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(app._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedRow === app._id && (
                      <tr className="bg-blue-50/20">
                        <td colSpan="6" className="p-0">
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-blue-500" />
                                <span className="font-medium">Course Interest:</span>
                                <span className="bg-white px-2 py-0.5 rounded border border-blue-100 font-semibold text-blue-800">
                                  {app.course || 'General Inquiry'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-blue-500" />
                                <span className="font-medium">Full Timestamp:</span>
                                <span>{new Date(app.submissionDate).toLocaleString()}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <FileText size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No applications found</h3>
            <p className="text-gray-500 mt-1 max-w-sm">
              {searchTerm || statusFilter !== 'all' 
                ? "We couldn't find any records matching your filters." 
                : "Admission applications will appear here once students submit the form."}
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {filteredApps.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 flex justify-between items-center px-2">
          <span>Showing <strong>{filteredApps.length}</strong> entries</span>
        </div>
      )}
    </div>
  );
};

export default AdminAdmissions;