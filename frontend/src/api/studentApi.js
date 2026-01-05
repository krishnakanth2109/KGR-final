// --- START OF FILE src/api/studentApi.js ---
import api from './api'; 

// =========================================================
// Core Functions
// =========================================================

export const fetchStudents = async (params) => {
    // params handles ?search=...&course_type=...
    const response = await api.get('/students', { params });
    return response.data;
};

export const getStudentById = async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
};

export const createStudent = async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
};

export const updateStudent = async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
};

export const deleteStudent = async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
};

export const deleteMultipleStudents = async (data) => {
    // data: { ids: ["id1", "id2"] }
    const response = await api.post('/students/bulk-delete', data);
    return response.data;
};

// =========================================================
// Helper Functions
// =========================================================

export const setStudentStatus = async ({ id, status }) => {
    // FIX: Use PUT /students/:id instead of PATCH /students/status
    // This reuses the existing backend update route.
    const response = await api.put(`/students/${id}`, { status });
    return response.data;
};

// =========================================================
// Aliases
// =========================================================
export const getStudents = fetchStudents; 
export const addStudent = createStudent;