// src/features/faculty/FacultyPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Loader2, AlertTriangle, GraduationCap } from 'lucide-react';
import { useGetFaculty } from './facultyQueries';
import FacultyList from '../../components/faculty/FacultyList';

const FacultyPage = () => {
    // This state holds all the filter values for the faculty list.
    const [filters, setFilters] = useState({
        department: '',
        status: '',
        searchQuery: '',
    });

    // Use our custom React Query hook to fetch data.
    // It automatically refetches whenever the `filters` object changes.
    const { data, isLoading, isError, error } = useGetFaculty(filters);

    // A single handler to update the filters state when any filter input changes.
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ 
            ...prevFilters, 
            [name]: value 
        }));
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Faculty Management</h1>
                <Link 
                    to="/admin/faculty/new" 
                    className="flex-1 sm:flex-none bg-blue-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle size={20} />
                    <span className="hidden sm:inline">Add Faculty</span>
                </Link>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <input
                    type="text"
                    name="searchQuery"
                    value={filters.searchQuery}
                    onChange={handleFilterChange}
                    placeholder="Search by Name or Faculty ID..."
                    className="p-2 border rounded-md w-full md:col-span-3"
                />
                <select 
                    name="department" 
                    value={filters.department} 
                    onChange={handleFilterChange} 
                    className="p-2 border rounded-md w-full bg-white"
                >
                    <option value="">All Departments</option>
                    <option value="MPHW">MPHW</option>
                    <option value="MLT">MLT</option>
                </select>
                <select 
                    name="status" 
                    value={filters.status} 
                    onChange={handleFilterChange} 
                    className="p-2 border rounded-md w-full bg-white"
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                </select>
            </div>

            {/* Data Display Section */}
            <div className="mt-6">
                {isLoading && (
                    <div className="text-center p-8 bg-white rounded-lg shadow-md flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
                        <p className="text-gray-600 font-medium">Loading faculty members...</p>
                    </div>
                )}
                {isError && (
                    <div className="text-center p-8 bg-red-50 rounded-lg shadow-md flex items-center justify-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <p className="text-red-700 font-medium">Error fetching data: {error.message}</p>
                    </div>
                )}
                {/* Only render the FacultyList if data has loaded successfully */}
                {data && <FacultyList faculty={data.faculty} />}
            </div>
        </div>
    );
};

export default FacultyPage;