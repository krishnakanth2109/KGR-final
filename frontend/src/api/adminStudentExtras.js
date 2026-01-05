// --- START OF FILE src/api/adminStudentExtras.js ---
import api from './api';
import { getStudentFeeDetails, assignStudentFee } from './feeApi'; // Ensure feeApi.js exists!

// ==========================================
// DOCUMENTS
// ==========================================

export const getStudentDocuments = async (studentId) => {
    const res = await api.get(`/documents/files/${studentId}`);
    return res.data;
};

export const uploadStudentDocument = async (studentId, formData) => {
    const res = await api.post(`/documents/upload/${studentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const deleteStudentDocument = async (docId) => {
    const res = await api.delete(`/documents/files/${docId}`);
    return res.data;
};

// Aliases
export const getStudentFiles = getStudentDocuments;
export const uploadStudentFile = uploadStudentDocument;
export const deleteStudentFile = deleteStudentDocument;

// ==========================================
// CHECKLIST
// ==========================================

export const getChecklist = async (id) => {
    const res = await api.get(`/documents/checklist/${id}`);
    return res.data;
};

export const updateChecklist = async (id, data) => {
    const res = await api.post(`/documents/checklist/${id}`, data);
    return res.data;
};

// ==========================================
// EXAMS
// ==========================================

export const getStudentExams = async (studentId) => {
    const res = await api.get(`/exams/${studentId}`);
    return res.data;
};

export const addStudentExam = async (studentId, data) => {
    const res = await api.post(`/exams/${studentId}`, data);
    return res.data;
};

export const deleteStudentExam = async (examId) => {
    const res = await api.delete(`/exams/${examId}`);
    return res.data;
};

export const bulkCreateExams = async (data) => {
    const res = await api.post('/exams/bulk/create', data);
    return res.data;
};

export const fetchBatchExams = async (program, year) => {
    try {
        const res = await api.get(`/exams/batch?program=${program}&year=${year}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching batch exams:", error);
        throw error;
    }
};

// ==========================================
// LEGACY FEE HELPERS
// ==========================================

export const getStudentFees = getStudentFeeDetails;
export const updateStudentFees = assignStudentFee;