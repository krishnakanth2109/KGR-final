// src/components/students/DownloadReportModal.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Download, X } from 'lucide-react';

// Define all possible fields for the report, including flattened nested fields
const reportFields = [
    { key: 'admission_number', label: 'Admission Number', default: true },
    { key: 'roll_number', label: 'Roll Number', default: true },
    { key: 'full_name', label: 'Full Name', default: true },
    { key: 'program', label: 'Program', default: true },
    { key: 'admission_year', label: 'Admission Year', default: true },
    { key: 'email', label: 'Email', default: true },
    { key: 'phone_number', label: 'Phone Number', default: true },
    { key: 'status', label: 'Status', default: true },
    { key: 'gender', label: 'Gender' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'category', label: 'Category' },
    { key: 'aadhar_number', label: 'Aadhar Number' },
    { key: 'father_name', label: "Father's Name" },
    { key: 'father_phone', label: "Father's Phone" },
    { key: 'mother_name', label: "Mother's Name" },
    { key: 'mother_phone', label: "Mother's Phone" },
    { key: 'permanent_address', label: 'Permanent Address' },
    { key: 'current_address', label: 'Current Address' },
];

const DownloadReportModal = ({ isOpen, onClose, students }) => {
    // State to keep track of which columns are selected for the report
    const [selectedFields, setSelectedFields] = useState(
        reportFields.filter(field => field.default).map(field => field.key)
    );

    const handleCheckboxChange = (fieldKey) => {
        setSelectedFields(prev =>
            prev.includes(fieldKey)
                ? prev.filter(key => key !== fieldKey)
                : [...prev, fieldKey]
        );
    };

    const handleGenerateCsv = () => {
        if (selectedFields.length === 0) {
            alert('Please select at least one field to include in the report.');
            return;
        }

        // 1. Prepare the data for the CSV
        const dataForCsv = students.map(student => {
            const row = {};
            selectedFields.forEach(key => {
                // Handle special flattened fields
                if (key === 'full_name') {
                    row['Full Name'] = `${student.first_name} ${student.last_name}`;
                } else if (key === 'father_name') {
                    row["Father's Name"] = student.parents?.find(p => p.relation === 'Father')?.name || 'N/A';
                } else if (key === 'father_phone') {
                    row["Father's Phone"] = student.parents?.find(p => p.relation === 'Father')?.phone || 'N/A';
                } else if (key === 'mother_name') {
                    row["Mother's Name"] = student.parents?.find(p => p.relation === 'Mother')?.name || 'N/A';
                } else if (key === 'mother_phone') {
                     row["Mother's Phone"] = student.parents?.find(p => p.relation === 'Mother')?.phone || 'N/A';
                } else if (key === 'permanent_address') {
                    const addr = student.addresses?.find(a => a.type === 'Permanent');
                    row['Permanent Address'] = addr ? `${addr.address_line1}, ${addr.city}, ${addr.state} - ${addr.postal_code}` : 'N/A';
                } else if (key === 'current_address') {
                    const addr = student.addresses?.find(a => a.type === 'Current');
                    row['Current Address'] = addr ? `${addr.address_line1}, ${addr.city}, ${addr.state} - ${addr.postal_code}` : 'N/A';
                } else {
                    const fieldLabel = reportFields.find(f => f.key === key)?.label || key;
                    row[fieldLabel] = student[key] || 'N/A';
                }
            });
            return row;
        });

        // 2. Convert data to CSV using papaparse
        const csv = Papa.unparse(dataForCsv);

        // 3. Trigger the download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `student-report-${date}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        onClose(); // Close the modal after download
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Download Student Report</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="mb-4 text-gray-600">Select the fields you want to include in the CSV report. The report will be generated for the currently filtered students.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-64 overflow-y-auto border p-4 rounded-md">
                        {reportFields.map(field => (
                            <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedFields.includes(field.key)}
                                    onChange={() => handleCheckboxChange(field.key)}
                                    className="h-4 w-4 rounded"
                                />
                                {field.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t">
                    <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleGenerateCsv}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Download size={18} /> Generate CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadReportModal;