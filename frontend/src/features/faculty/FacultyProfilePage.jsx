// src/features/faculty/FacultyProfilePage.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetFacultyById } from './facultyQueries';
import { Loader2, AlertTriangle, ArrowLeft, Edit, UserCircle, Briefcase, GraduationCap } from 'lucide-react';

// Helper component for displaying a single piece of information
const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-md text-gray-900">{value || 'N/A'}</p>
    </div>
);

// Helper component for organizing sections of the profile
const ProfileSection = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center border-b pb-3 mb-4">
            {icon}
            <h2 className="text-xl font-bold text-gray-800 ml-3">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {children}
        </div>
    </div>
);

const FacultyProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: faculty, isLoading, isError, error } = useGetFacultyById(id);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                <p className="ml-4 text-gray-600">Loading Faculty Profile...</p>
            </div>
        );
    }

    if (isError || !faculty) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">
                    {isError ? "Error Fetching Data" : "Faculty Member Not Found"}
                </h3>
                <p className="mt-2 text-gray-500">
                    {isError ? error.message : "The requested faculty member could not be found."}
                </p>
                <button onClick={() => navigate('/admin/faculty')} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Back to Faculty List
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                     <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100" title="Go Back">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-shrink-0 h-16 w-16">
                        {faculty.extras?.profile_photo_url ? (
                            <img className="h-16 w-16 rounded-full object-cover" src={faculty.extras.profile_photo_url} alt="Profile" />
                        ) : (
                            <UserCircle className="h-16 w-16 text-gray-300" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{`${faculty.first_name} ${faculty.last_name}`}</h1>
                        <p className="text-gray-500">{faculty.designation} - {faculty.department}</p>
                    </div>
                </div>
                <Link to={`/admin/faculty/edit/${faculty._id}`} className="bg-indigo-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-700">
                    <Edit size={18} />
                    <span>Edit Profile</span>
                </Link>
            </div>

            {/* Professional Details */}
            <ProfileSection title="Professional Information" icon={<Briefcase className="h-6 w-6 text-gray-500" />}>
                <DetailItem label="Faculty ID" value={faculty.faculty_id} />
                <DetailItem label="Department" value={faculty.department} />
                <DetailItem label="Designation" value={faculty.designation} />
                <DetailItem label="Date of Joining" value={faculty.date_of_joining ? new Date(faculty.date_of_joining).toLocaleDateString() : 'N/A'} />
                <DetailItem label="Current Status" value={faculty.status} />
            </ProfileSection>
            
            {/* Qualifications */}
            {faculty.qualifications && faculty.qualifications.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <div className="flex items-center border-b pb-3 mb-4">
                        <GraduationCap className="h-6 w-6 text-gray-500" />
                        <h2 className="text-xl font-bold text-gray-800 ml-3">Qualifications</h2>
                    </div>
                    <ul className="space-y-3">
                        {faculty.qualifications.map((qual, index) => (
                            <li key={index} className="p-3 bg-gray-50 rounded-md">
                                <p className="font-semibold text-gray-800">{qual.degree}</p>
                                <p className="text-sm text-gray-600">{qual.institution} - {qual.year}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Personal & Contact Details */}
            <ProfileSection title="Personal & Contact Information" icon={<UserCircle className="h-6 w-6 text-gray-500" />}>
                <DetailItem label="Full Name" value={`${faculty.first_name} ${faculty.last_name}`} />
                <DetailItem label="Date of Birth" value={faculty.dob ? new Date(faculty.dob).toLocaleDateString() : 'N/A'} />
                <DetailItem label="Gender" value={faculty.gender} />
                <DetailItem label="Email Address" value={faculty.email} />
                <DetailItem label="Phone Number" value={faculty.phone_number} />
              
            </ProfileSection>
        </div>
    );
};

export default FacultyProfilePage;