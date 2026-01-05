// src/components/students/StudentList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Eye, ToggleLeft, ToggleRight, UserCircle, Loader2 } from 'lucide-react';
import { useSetStudentStatus } from '../../features/students/studentQueries';

/**
 * A component to display a list of students in a table.
 * @param {{ students: Array<object> }} props - The props object containing the list of students.
 * @returns {JSX.Element} The rendered table or a message if no students are found.
 */
const StudentList = ({ students }) => {
    // This hook provides the mutation function and loading state for changing a student's status.
    const setStatusMutation = useSetStudentStatus();
    
    /**
     * Handles the click event to toggle a student's status between 'Active' and 'Dropped Out'.
     * @param {string} id - The _id of the student.
     * @param {string} currentStatus - The current status of the student.
     */
    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Dropped Out' : 'Active';
        const studentName = students.find(s => s._id === id)?.first_name || 'this student';

        // Use a confirmation dialog for critical actions to prevent accidental clicks.
        if (window.confirm(`Are you sure you want to set ${studentName}'s status to "${newStatus}"?`)) {
            setStatusMutation.mutate(
                { id, status: newStatus },
                {
                    // Optional: You can add onSuccess/onError callbacks here for toast notifications
                    onError: (error) => {
                        alert(`Failed to update status: ${error.message}`);
                    }
                }
            );
        }
    };

    // Display a user-friendly message if the students array is empty after loading.
    if (!students || students.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">No Students Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search filters to find what you're looking for.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Year</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {students.map(student => (
                        <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        {student.extras?.profile_photo_url ? (
                                            <img className="h-10 w-10 rounded-full object-cover" src={student.extras.profile_photo_url} alt={`${student.first_name}`} />
                                        ) : (
                                            <UserCircle className="h-10 w-10 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{`${student.first_name} ${student.last_name}`}</div>
                                        <div className="text-sm text-gray-500">{student.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.roll_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.program}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admission_year}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    student.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                    student.status === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {student.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4">
                                <Link to={`/admin/students/view/${student._id}`} className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100" title="View Profile">
                                    <Eye size={20} />
                                </Link>
                                <Link to={`/admin/students/edit/${student._id}`} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-100" title="Edit Student">
                                    <Edit size={20} />
                                </Link>
                                <button 
                                    onClick={() => handleStatusToggle(student._id, student.status)}
                                    disabled={setStatusMutation.isLoading}
                                    className={`p-1 rounded-full disabled:opacity-50 ${
                                        student.status === 'Active' 
                                        ? 'text-red-600 hover:bg-red-100 hover:text-red-900' 
                                        : 'text-green-600 hover:bg-green-100 hover:text-green-900'
                                    }`}
                                    title={student.status === 'Active' ? 'Deactivate Student' : 'Activate Student'}
                                >
                                    {setStatusMutation.isLoading && setStatusMutation.variables?.id === student._id ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        student.status === 'Active' ? <ToggleLeft size={20} /> : <ToggleRight size={20} />
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;