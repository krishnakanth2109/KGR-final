// src/components/faculty/FacultyList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Eye, ToggleLeft, ToggleRight, UserCircle, Loader2 } from 'lucide-react';
import { useSetFacultyStatus } from '../../features/faculty/facultyQueries';

/**
 * A component to display a list of faculty members in a table.
 * @param {{ faculty: Array<object> }} props - The props object containing the list of faculty.
 * @returns {JSX.Element} The rendered table or a message if no faculty are found.
 */
const FacultyList = ({ faculty }) => {
    // This hook provides the mutation function and loading state for changing a faculty member's status.
    const setStatusMutation = useSetFacultyStatus();
    
    /**
     * Handles the click event to toggle a faculty member's status.
     * @param {string} id - The _id of the faculty member.
     * @param {string} currentStatus - The current status.
     */
    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Resigned' : 'Active';
        const facultyName = faculty.find(f => f._id === id)?.first_name || 'this member';

        if (window.confirm(`Are you sure you want to set ${facultyName}'s status to "${newStatus}"?`)) {
            setStatusMutation.mutate({ id, status: newStatus });
        }
    };

    // Display a user-friendly message if the faculty array is empty.
    if (!faculty || faculty.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">No Faculty Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search filters to find what you're looking for.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty Member</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {faculty.map(member => (
                        <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        {member.extras?.profile_photo_url ? (
                                            <img className="h-10 w-10 rounded-full object-cover" src={member.extras.profile_photo_url} alt={`${member.first_name}`} />
                                        ) : (
                                            <UserCircle className="h-10 w-10 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{`${member.first_name} ${member.last_name}`}</div>
                                        <div className="text-sm text-gray-500">{member.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.faculty_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.department}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.designation}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    member.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                    member.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {member.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4">
                                <Link to={`/admin/faculty/view/${member._id}`} className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100" title="View Profile">
                                    <Eye size={20} />
                                </Link>
                                <Link to={`/admin/faculty/edit/${member._id}`} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-100" title="Edit Profile">
                                    <Edit size={20} />
                                </Link>
                                <button 
                                    onClick={() => handleStatusToggle(member._id, member.status)}
                                    disabled={setStatusMutation.isLoading}
                                    className={`p-1 rounded-full disabled:opacity-50 ${
                                        member.status === 'Active' 
                                        ? 'text-red-600 hover:bg-red-100 hover:text-red-900' 
                                        : 'text-green-600 hover:bg-green-100 hover:text-green-900'
                                    }`}
                                    title={member.status === 'Active' ? 'Set to Resigned' : 'Set to Active'}
                                >
                                    {setStatusMutation.isLoading && setStatusMutation.variables?.id === member._id ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        member.status === 'Active' ? <ToggleLeft size={20} /> : <ToggleRight size={20} />
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

export default FacultyList;