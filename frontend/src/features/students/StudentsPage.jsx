// src/features/students/StudentsPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Download, Loader2, AlertTriangle } from "lucide-react";
import { useGetStudents } from "./studentQueries";
import StudentList from "../../components/students/StudentList";

// --- NEW ---
// Import the modal component. You will create this file next.
import DownloadReportModal from "../../components/students/DownloadReportModal";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const StudentsPage = () => {
  const [filters, setFilters] = useState({
    admissionYear: currentYear,
    program: "",
    category: "",
    searchQuery: "",
    status: "",
  });

  // --- NEW ---
  // State to control the visibility of the download report modal.
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetStudents(filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // The handleDownloadReport function is now replaced by a direct state update in the button's onClick.

  return (
    <div className="p-4 sm:p-6">
      {/* --- NEW --- */}
      {/* The Download Report Modal is placed here. It's hidden by default. */}
      <DownloadReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        // Pass the currently filtered students to the modal for report generation.
        students={data?.students || []}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* --- UPDATED BUTTON --- */}
          <button
            onClick={() => setIsReportModalOpen(true)} // Opens the modal
            disabled={!data || data.students.length === 0} // Disables if no students are loaded/found
            className="flex-1 sm:flex-none bg-gray-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Download Report</span>
          </button>
          <Link
            to="/admin/students/new"
            className="flex-1 sm:flex-none bg-blue-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">Add Student</span>
          </Link>
        </div>
      </div>

      {/* The rest of the file (filters and student list) remains unchanged. */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <input
          type="text"
          name="searchQuery"
          value={filters.searchQuery}
          onChange={handleFilterChange}
          placeholder="Search by Name or Roll No..."
          className="p-2 border rounded-md w-full md:col-span-4"
        />
        <select
          name="admissionYear"
          value={filters.admissionYear}
          onChange={handleFilterChange}
          className="p-2 border rounded-md w-full bg-white"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          name="program"
          value={filters.program}
          onChange={handleFilterChange}
          className="p-2 border rounded-md w-full bg-white"
        >
          <option value="">All Programs</option>
          <option value="MPHW">MPHW</option>
          <option value="MLT">MLT</option>
        </select>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 border rounded-md w-full bg-white"
        >
          <option value="">All Categories</option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>
        {/* --- ADD THIS NEW DROPDOWN --- */}
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="p-2 border rounded-md w-full bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Graduated">Graduated</option>
          <option value="Dropped Out">Dropped Out</option>
        </select>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="text-center p-8 bg-white rounded-lg shadow-md flex items-center justify-center gap-3">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
            <p className="text-gray-600 font-medium">Loading students...</p>
          </div>
        )}
        {isError && (
          <div className="text-center p-8 bg-red-50 rounded-lg shadow-md flex items-center justify-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <p className="text-red-700 font-medium">
              Error fetching data: {error.message}
            </p>
          </div>
        )}
        {data && <StudentList students={data.students} />}
      </div>
    </div>
  );
};

export default StudentsPage;
