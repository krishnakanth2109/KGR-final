// src/features/students/StudentProfilePage.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetStudentById } from './studentQueries';
import { Loader2, AlertTriangle, ArrowLeft, Edit, UserCircle } from 'lucide-react';

// Helper component for displaying a single piece of information
const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-md text-gray-900">{value || 'N/A'}</p>
    </div>
);

// Helper component for organizing sections of the profile
const ProfileSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {children}
        </div>
    </div>
);


const StudentProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: student, isLoading, isError, error } = useGetStudentById(id);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                <p className="ml-4 text-gray-600">Loading Student Profile...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-8 bg-red-50 rounded-lg shadow-md flex items-center justify-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <p className="text-red-700 font-medium">Error fetching student data: {error.message}</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">Student Not Found</h3>
                <p className="text-gray-500 mt-2">The requested student could not be found.</p>
                <button onClick={() => navigate('/admin/students')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Back to Student List
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section (Unchanged) */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                     <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100" title="Go Back">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-shrink-0 h-16 w-16">
                        {student.extras?.profile_photo_url ? (
                            <img className="h-16 w-16 rounded-full object-cover" src={student.extras.profile_photo_url} alt="Profile" />
                        ) : (
                            <UserCircle className="h-16 w-16 text-gray-300" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{`${student.first_name} ${student.last_name}`}</h1>
                        <p className="text-gray-500">{student.roll_number} - {student.program}</p>
                    </div>
                </div>
                <Link to={`/admin/students/edit/${student._id}`} className="bg-indigo-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-700">
                    <Edit size={18} />
                    <span>Edit Profile</span>
                </Link>
            </div>

            {/* Personal Details (Unchanged) */}
            <ProfileSection title="Personal Information">
                <DetailItem label="Full Name" value={`${student.first_name} ${student.middle_name || ''} ${student.last_name}`} />
                <DetailItem label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'} />
                <DetailItem label="Gender" value={student.gender} />
                <DetailItem label="Blood Group" value={student.blood_group} />
                <DetailItem label="Nationality" value={student.nationality} />
                <DetailItem label="Category" value={student.category} />
                <DetailItem label="Aadhar Number" value={student.aadhar_number} />
            </ProfileSection>

            {/* Academic Details (Unchanged) */}
            <ProfileSection title="Academic Information">
                <DetailItem label="Admission Number" value={student.admission_number} />
                <DetailItem label="Roll Number" value={student.roll_number} />
                <DetailItem label="Program" value={student.program} />
                <DetailItem label="Admission Year" value={student.admission_year} />
                <DetailItem label="Current Status" value={student.status} />
                <DetailItem label="Enrollment Date" value={student.academics?.enrollment_date ? new Date(student.academics.enrollment_date).toLocaleDateString() : 'N/A'} />
                <DetailItem label="Graduation Status" value={student.academics?.graduation_status} />
            </ProfileSection>

            {/* --- NEW Educational History Section --- */}
            {student.educational_history && student.educational_history.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Educational History</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Institution</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Board</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {student.educational_history.map((record, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.level}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.institution_name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.board}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.year_of_passing}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{`${record.marks.value} (${record.marks.type})`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Contact Details (Unchanged) */}
            <ProfileSection title="Contact Information">
                <DetailItem label="Email Address" value={student.email} />
                <DetailItem label="Phone Number" value={student.phone_number} />
            </ProfileSection>

            {/* Parent/Guardian Details (Unchanged) */}
            {student.parents && student.parents.length > 0 && (
                 <ProfileSection title="Parent/Guardian Information">
                    {student.parents.map((parent, index) => (
                        <div key={index} className="md:col-span-1 border p-4 rounded-md bg-gray-50">
                            <p className="font-bold text-gray-600 mb-2">{parent.relation}</p>
                            <DetailItem label="Name" value={parent.name} />
                            <DetailItem label="Phone" value={parent.phone} />
                        </div>
                    ))}
                </ProfileSection>
            )}
        </div>
    );
};

export default StudentProfilePage;