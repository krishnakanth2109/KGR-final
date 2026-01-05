// src/features/faculty/FacultyFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFacultyById, useAddFaculty, useUpdateFaculty } from './facultyQueries';
import { 
    Save, 
    Loader2, 
    ArrowLeft, 
    Upload, 
    UserCircle, 
    PlusCircle, 
    XCircle, 
    Edit, 
    Trash2, 
    Crop, 
    Image as ImageIcon 
} from 'lucide-react';

// Initial state matching your schema
const initialFormState = {
    faculty_id: '',
    first_name: '',
    last_name: '',
    gender: 'Male',
    dob: '',
    email: '',
    phone_number: '',
    department: 'MLT',
    designation: 'Lecturer',
    date_of_joining: '',
    status: 'Active',
    qualifications: [],
    address: {
        address_line1: '',
        city: '',
        state: '',
        postal_code: ''
    },
    extras: {
        profile_photo_url: '',
    }
};

const FacultyFormPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const isEditing = !!id;

    // --- Hooks ---
    const { data: existingFaculty, isLoading: isLoadingFaculty } = useGetFacultyById(id);
    const addMutation = useAddFaculty();
    const updateMutation = useUpdateFaculty();
    
    // --- State ---
    const [formData, setFormData] = useState(initialFormState);
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    // --- Load Data on Edit ---
    useEffect(() => {
        if (isEditing && existingFaculty) {
            const mergedData = {
                ...initialFormState,
                ...existingFaculty,
                dob: existingFaculty.dob ? new Date(existingFaculty.dob).toISOString().split('T')[0] : '',
                date_of_joining: existingFaculty.date_of_joining ? new Date(existingFaculty.date_of_joining).toISOString().split('T')[0] : '',
            };
            setFormData(mergedData);
            if (existingFaculty.extras?.profile_photo_url) {
                setImagePreview(existingFaculty.extras.profile_photo_url);
            }
        }
    }, [isEditing, existingFaculty]);
    
    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;

        // 1. Validation: No numbers in First/Last Name
        if (['first_name', 'last_name'].includes(name)) {
            if (value && !/^[a-zA-Z\s]*$/.test(value)) return;
        }

        // 2. Validation: Phone numbers only, max 10
        if (name === 'phone_number') {
            if (value && !/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }

        // Handle nested state for address
        if (name.includes('.')) {
            const [outerKey, innerKey] = name.split('.');
            setFormData(prev => ({ ...prev, [outerKey]: { ...prev[outerKey], [innerKey]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleArrayChange = (index, arrayName, e) => {
        const { name, value } = e.target;
        const newArray = [...formData[arrayName]];
        newArray[index] = { ...newArray[index], [name]: value };
        setFormData(prev => ({ ...prev, [arrayName]: newArray }));
    };

    // --- Qualifications Logic ---
    const addQualificationRecord = () => {
        setFormData(prev => ({
            ...prev,
            qualifications: [ ...prev.qualifications, { degree: '', institution: '', year: '' } ]
        }));
    };

    const removeQualificationRecord = (index) => {
        setFormData(prev => ({
            ...prev,
            qualifications: prev.qualifications.filter((_, i) => i !== index)
        }));
    };

    // --- Image Logic ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            // In a real app, you might want to store the file object itself in a separate state for upload
            setFormData(prev => ({ ...prev, extras: { ...prev.extras, profile_photo_url: previewUrl } }));
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, extras: { ...prev.extras, profile_photo_url: '' } }));
    };

    const handleCropImage = () => {
        alert("Crop functionality placeholder (requires external library).");
    };

    const handleTriggerUpload = () => {
        document.getElementById('profile-upload').click();
    };

    // --- Submit Logic ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');

        // 1. Required Fields Check
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone_number || !formData.dob || !formData.date_of_joining) {
            setErrorMsg("Please fill in all required fields.");
            window.scrollTo(0,0);
            return;
        }

        // 2. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMsg("Please enter a valid email address.");
            window.scrollTo(0,0);
            return;
        }

        // 3. Phone Validation
        if (formData.phone_number.length !== 10) {
            setErrorMsg("Phone number must be exactly 10 digits.");
            window.scrollTo(0,0);
            return;
        }

        if (isEditing) {
            updateMutation.mutate({ id, data: formData }, {
                onSuccess: () => navigate(`/admin/faculty/view/${id}`),
                onError: (err) => { setErrorMsg(err.message || "Update failed."); window.scrollTo(0,0); }
            });
        } else {
            addMutation.mutate(formData, {
                onSuccess: () => navigate('/admin/faculty'),
                onError: (err) => { setErrorMsg(err.message || "Creation failed."); window.scrollTo(0,0); }
            });
        }
    };
    
    if (isLoadingFaculty) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /><p className="ml-4">Loading Faculty Details...</p></div>;
    }

    const isSubmitting = addMutation.isLoading || updateMutation.isLoading;

    return (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
                
                {/* Header */}
                <div className="flex items-center mb-8 pb-4 border-b border-slate-100">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 mr-4 text-slate-500 transition-colors" title="Go Back">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">{isEditing ? 'Edit Faculty Information' : 'Add New Faculty Member'}</h1>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm font-medium">
                        {errorMsg}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* 1. Basic Information & Photo */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <UserCircle className="text-blue-600" size={20} /> Basic Information
                        </h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            
                            {/* Photo Section */}
                            <div className="lg:col-span-1 flex flex-col items-center">
                                <div className="relative group mb-4">
                                    <div className="h-40 w-40 rounded-full border-4 border-slate-100 shadow-sm overflow-hidden bg-slate-50 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <ImageIcon className="h-16 w-16 text-slate-300" />
                                        )}
                                    </div>
                                    
                                    {/* Image Actions Overlay */}
                                    {imagePreview && (
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                                            <button type="button" onClick={handleTriggerUpload} className="p-1.5 bg-white shadow rounded-full text-slate-600 hover:text-blue-600" title="Change"><Edit size={14}/></button>
                                            <button type="button" onClick={handleCropImage} className="p-1.5 bg-blue-600 text-white shadow rounded-full hover:bg-blue-700" title="Crop"><Crop size={14}/></button>
                                            <button type="button" onClick={handleRemoveImage} className="p-1.5 bg-red-500 text-white shadow rounded-full hover:bg-red-600" title="Delete"><Trash2 size={14}/></button>
                                        </div>
                                    )}
                                </div>
                                
                                <input id="profile-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                <button 
                                    type="button" 
                                    onClick={handleTriggerUpload}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Upload size={16} /> {imagePreview ? 'Change Photo' : 'Upload Photo'}
                                </button>
                            </div>

                            {/* Inputs */}
                            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Faculty ID <span className="text-red-500">*</span></label>
                                    <input name="faculty_id" value={formData.faculty_id} onChange={handleChange} placeholder="e.g. FAC-001" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender <span className="text-red-500">*</span></label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/20 outline-none">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
                                    <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                                    <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                                </div>
                                
                                {/* Date of Birth First */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="10-digit number" maxLength={10} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* 2. Professional Details */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-700 mb-6 border-t border-slate-100 pt-6">Professional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department <span className="text-red-500">*</span></label>
                                <select name="department" value={formData.department} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/20 outline-none">
                                    <option value="MLT">MLT</option>
                                    <option value="MPHW">MPHW</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Designation <span className="text-red-500">*</span></label>
                                <input name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Senior Lecturer" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                            </div>
                            
                            {/* Date of Joining Second */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Joining <span className="text-red-500">*</span></label>
                                <input type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                            </div>

                            {isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none">
                                        <option>Active</option>
                                        <option>On Leave</option>
                                        <option>Resigned</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </section>
                    
                    {/* 3. Qualifications */}
                    <section>
                        <div className="flex justify-between items-center mb-6 border-t border-slate-100 pt-6">
                            <h2 className="text-lg font-bold text-slate-700">Qualifications</h2>
                            <button type="button" onClick={addQualificationRecord} className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                <PlusCircle size={16} /> Add Qualification
                            </button>
                        </div>
                        
                        {formData.qualifications.length === 0 && (
                            <p className="text-slate-500 text-sm italic">No qualifications added yet.</p>
                        )}

                        <div className="space-y-4">
                            {formData.qualifications.map((qual, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 p-4 rounded-xl relative bg-slate-50/50">
                                    <button type="button" onClick={() => removeQualificationRecord(index)} className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 bg-white shadow-sm border border-slate-200 rounded-full p-0.5" title="Remove"><XCircle size={20} /></button>
                                    
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Degree/Certificate</label>
                                        <input name="degree" value={qual.degree} onChange={(e) => handleArrayChange(index, 'qualifications', e)} placeholder="e.g. PhD" className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Institution</label>
                                        <input name="institution" value={qual.institution} onChange={(e) => handleArrayChange(index, 'qualifications', e)} placeholder="University Name" className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Year</label>
                                        <input type="number" name="year" value={qual.year} onChange={(e) => handleArrayChange(index, 'qualifications', e)} placeholder="YYYY" className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
                        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={18} />}
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Faculty' : 'Save Faculty')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default FacultyFormPage;