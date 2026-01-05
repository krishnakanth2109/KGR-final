// src/features/students/StudentFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetStudentById, useAddStudent, useUpdateStudent } from './studentQueries';
import { Save, Loader2, ArrowLeft, Upload, UserCircle, PlusCircle, XCircle } from 'lucide-react';

// A more comprehensive default state for a new student form, matching the schema
const initialFormState = {
    admission_number: '',
    roll_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: 'Male',
    dob: '',
    email: '',
    phone_number: '',
    program: 'MPHW',
    admission_year: new Date().getFullYear(),
    status: 'Active',
    category: 'General',
    addresses: [
        { type: 'Permanent', address_line1: '', address_line2: '', city: '', state: '', postal_code: '' },
        { type: 'Current', address_line1: '', address_line2: '', city: '', state: '', postal_code: '' }
    ],
    parents: [
        { relation: 'Father', name: '', phone: '' },
        { relation: 'Mother', name: '', phone: '' }
    ],
    // --- NEW FIELD ---
    educational_history: [], // Initialize as an empty array for dynamic rows
    extras: {
        profile_photo_url: '',
    }
};

const StudentFormPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const isEditing = !!id;

    const { data: existingStudent, isLoading: isLoadingStudent } = useGetStudentById(id);
    const addMutation = useAddStudent();
    const updateMutation = useUpdateStudent();
    
    const [formData, setFormData] = useState(initialFormState);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isEditing && existingStudent) {
            // Deep merge to ensure nested objects and arrays from initial state are present if missing from fetched data
            const mergedData = {
                ...initialFormState,
                ...existingStudent,
                addresses: existingStudent.addresses?.length ? existingStudent.addresses : initialFormState.addresses,
                parents: existingStudent.parents?.length ? existingStudent.parents : initialFormState.parents,
                educational_history: existingStudent.educational_history || [],
                extras: { ...initialFormState.extras, ...existingStudent.extras },
            };
            mergedData.dob = existingStudent.dob ? new Date(existingStudent.dob).toISOString().split('T')[0] : '';
            setFormData(mergedData);
            if (existingStudent.extras?.profile_photo_url) {
                setImagePreview(existingStudent.extras.profile_photo_url);
            }
        }
    }, [isEditing, existingStudent]);
    
    // This handler remains unchanged
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // This handler remains unchanged
    const handleArrayChange = (index, arrayName, e) => {
        const { name, value } = e.target;
        const newArray = [...formData[arrayName]];
        newArray[index] = { ...newArray[index], [name]: value };
        setFormData(prev => ({ ...prev, [arrayName]: newArray }));
    };

    // --- NEW HANDLER ---
    // Handles changes in nested objects within an array (specifically for 'marks')
    const handleNestedArrayChange = (index, arrayName, innerKey, e) => {
        const { name, value } = e.target;
        const newArray = [...formData[arrayName]];
        newArray[index][innerKey] = { ...newArray[index][innerKey], [name]: value };
        setFormData(prev => ({ ...prev, [arrayName]: newArray }));
    };

    // --- NEW HANDLERS FOR DYNAMIC EDUCATIONAL HISTORY ---
    const addEducationalRecord = () => {
        setFormData(prev => ({
            ...prev,
            educational_history: [
                ...prev.educational_history,
                { level: '', institution_name: '', board: '', year_of_passing: '', marks: { type: 'Percentage', value: '' } }
            ]
        }));
    };

    const removeEducationalRecord = (index) => {
        setFormData(prev => ({
            ...prev,
            educational_history: prev.educational_history.filter((_, i) => i !== index)
        }));
    };

    // This handler remains unchanged
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setFormData(prev => ({
                ...prev,
                extras: { ...prev.extras, profile_photo_url: previewUrl }
            }));
        }
    };

    // This handler remains unchanged
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateMutation.mutate({ id, data: formData }, {
                onSuccess: () => navigate(`/admin/students/view/${id}`),
            });
        } else {
            addMutation.mutate(formData, {
                onSuccess: () => navigate('/admin/students'),
            });
        }
    };
    
    if (isLoadingStudent) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /><p className="ml-4">Loading Details...</p></div>;
    }

    const isSubmitting = addMutation.isLoading || updateMutation.isLoading;

    return (
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 mr-4" title="Go Back"><ArrowLeft size={20} /></button>
                <h1 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Student Information' : 'New Student Admission'}</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* --- Basic Information Section (Unchanged) --- */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Basic Information</h2>
                    {/* ... Your existing JSX for this section ... */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1 flex flex-col items-center">
                            {imagePreview ? (<img src={imagePreview} alt="Profile Preview" className="h-32 w-32 rounded-full object-cover mb-4" />) : (<UserCircle className="h-32 w-32 text-gray-300 mb-4" />)}
                            <label htmlFor="profile-picture" className="cursor-pointer bg-gray-200 text-sm text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2">
                                <Upload size={16} /> Upload Photo
                            </label>
                            <input id="profile-picture" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </div>
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input name="admission_number" value={formData.admission_number || ''} onChange={handleChange} placeholder="Admission Number" required className="p-2 border rounded-md" />
                            <input name="roll_number" value={formData.roll_number || ''} onChange={handleChange} placeholder="Roll Number" required className="p-2 border rounded-md" />
                            <input type="number" name="admission_year" value={formData.admission_year || ''} onChange={handleChange} placeholder="Admission Year" required className="p-2 border rounded-md" />
                            <input name="first_name" value={formData.first_name || ''} onChange={handleChange} placeholder="First Name" required className="p-2 border rounded-md" />
                            <input name="middle_name" value={formData.middle_name || ''} onChange={handleChange} placeholder="Middle Name" className="p-2 border rounded-md" />
                            <input name="last_name" value={formData.last_name || ''} onChange={handleChange} placeholder="Last Name" required className="p-2 border rounded-md" />
                            <select name="gender" value={formData.gender} onChange={handleChange} required className="p-2 border rounded-md bg-white"><option>Male</option><option>Female</option><option>Other</option></select>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="p-2 border rounded-md" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="p-2 border rounded-md" />
                            <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" required className="p-2 border rounded-md" />
                            <select name="program" value={formData.program} onChange={handleChange} required className="p-2 border rounded-md bg-white"><option value="MPHW">MPHW</option><option value="MLT">MLT</option></select>
                            <select name="category" value={formData.category} onChange={handleChange} required className="p-2 border rounded-md bg-white"><option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option></select>
                        </div>
                    </div>
                </section>
                
                {/* --- Address Details Section (Unchanged) --- */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Address Details</h2>
                    {/* ... Your existing JSX for this section ... */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-medium mb-2">Permanent Address</h3>
                            <div className="space-y-2">
                                <input name="address_line1" value={formData.addresses[0].address_line1} onChange={(e) => handleArrayChange(0, 'addresses', e)} placeholder="Address Line 1" className="p-2 border rounded-md w-full" />
                                <input name="address_line2" value={formData.addresses[0].address_line2} onChange={(e) => handleArrayChange(0, 'addresses', e)} placeholder="Address Line 2" className="p-2 border rounded-md w-full" />
                                <input name="city" value={formData.addresses[0].city} onChange={(e) => handleArrayChange(0, 'addresses', e)} placeholder="City" className="p-2 border rounded-md w-full" />
                                <input name="state" value={formData.addresses[0].state} onChange={(e) => handleArrayChange(0, 'addresses', e)} placeholder="State" className="p-2 border rounded-md w-full" />
                                <input name="postal_code" value={formData.addresses[0].postal_code} onChange={(e) => handleArrayChange(0, 'addresses', e)} placeholder="Postal Code" className="p-2 border rounded-md w-full" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Current Address</h3>
                            <div className="space-y-2">
                               <input name="address_line1" value={formData.addresses[1].address_line1} onChange={(e) => handleArrayChange(1, 'addresses', e)} placeholder="Address Line 1" className="p-2 border rounded-md w-full" />
                                <input name="address_line2" value={formData.addresses[1].address_line2} onChange={(e) => handleArrayChange(1, 'addresses', e)} placeholder="Address Line 2" className="p-2 border rounded-md w-full" />
                                <input name="city" value={formData.addresses[1].city} onChange={(e) => handleArrayChange(1, 'addresses', e)} placeholder="City" className="p-2 border rounded-md w-full" />
                                <input name="state" value={formData.addresses[1].state} onChange={(e) => handleArrayChange(1, 'addresses', e)} placeholder="State" className="p-2 border rounded-md w-full" />
                                <input name="postal_code" value={formData.addresses[1].postal_code} onChange={(e) => handleArrayChange(1, 'addresses', e)} placeholder="Postal Code" className="p-2 border rounded-md w-full" />
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* --- Parent/Guardian Details Section (Unchanged) --- */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Parent / Guardian Details</h2>
                    {/* ... Your existing JSX for this section ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-medium mb-2">Father's Information</h3>
                            <div className="space-y-2">
                                <input name="name" value={formData.parents[0].name} onChange={(e) => handleArrayChange(0, 'parents', e)} placeholder="Father's Name" required className="p-2 border rounded-md w-full" />
                                <input name="phone" value={formData.parents[0].phone} onChange={(e) => handleArrayChange(0, 'parents', e)} placeholder="Father's Phone" required className="p-2 border rounded-md w-full" />
                            </div>
                        </div>
                         <div>
                            <h3 className="font-medium mb-2">Mother's Information</h3>
                            <div className="space-y-2">
                                <input name="name" value={formData.parents[1].name} onChange={(e) => handleArrayChange(1, 'parents', e)} placeholder="Mother's Name" className="p-2 border rounded-md w-full" />
                                <input name="phone" value={formData.parents[1].phone} onChange={(e) => handleArrayChange(1, 'parents', e)} placeholder="Mother's Phone" className="p-2 border rounded-md w-full" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- NEW Educational History Section --- */}
                <section>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-lg font-semibold text-gray-700">Educational History</h2>
                        <button type="button" onClick={addEducationalRecord} className="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors">
                            <PlusCircle size={16} /> Add Record
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.educational_history.map((record, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 border p-3 rounded-lg relative bg-gray-50">
                                <input name="level" value={record.level} onChange={(e) => handleArrayChange(index, 'educational_history', e)} placeholder="Level (e.g., 10th)" className="p-2 border rounded-md md:col-span-3" />
                                <input name="institution_name" value={record.institution_name} onChange={(e) => handleArrayChange(index, 'educational_history', e)} placeholder="Institution Name" className="p-2 border rounded-md md:col-span-4" />
                                <input name="board" value={record.board} onChange={(e) => handleArrayChange(index, 'educational_history', e)} placeholder="Board (e.g., CBSE)" className="p-2 border rounded-md md:col-span-3" />
                                <input type="number" name="year_of_passing" value={record.year_of_passing} onChange={(e) => handleArrayChange(index, 'educational_history', e)} placeholder="Year" className="p-2 border rounded-md md:col-span-2" />
                                
                                <div className="flex gap-2 items-center md:col-span-12">
                                    <label className="text-sm font-medium">Marks:</label>
                                    <select name="type" value={record.marks.type} onChange={(e) => handleNestedArrayChange(index, 'educational_history', 'marks', e)} className="p-2 border rounded-md bg-white w-1/3">
                                        <option>Percentage</option>
                                        <option>GPA</option>
                                        <option>Marks</option>
                                    </select>
                                    <input name="value" value={record.marks.value} onChange={(e) => handleNestedArrayChange(index, 'educational_history', 'marks', e)} placeholder="Value (e.g., 95.2 or 9.8)" className="p-2 border rounded-md w-2/3" />
                                </div>
                                
                                <button type="button" onClick={() => removeEducationalRecord(index)} className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 bg-white rounded-full">
                                    <XCircle size={20} />
                                </button>
                            </div>
                        ))}
                         {formData.educational_history.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No educational records added. Click 'Add Record' to begin.</p>
                        )}
                    </div>
                </section>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 hover:bg-blue-700">
                        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={18} />}
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Student' : 'Save Student')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentFormPage;