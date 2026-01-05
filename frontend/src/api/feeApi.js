// --- START OF FILE src/api/feeApi.js ---
import api from './api';

// ==========================================
// 1. FEE STRUCTURES (Admin Configuration)
// ==========================================

// Get all fee structures (e.g., "MPHW 2024", "MLT 2025")
export const getAllFeeStructures = async () => {
    const res = await api.get('/fee-structures');
    return res.data;
};

// Create a new fee structure
export const createFeeStructure = async (data) => {
    const res = await api.post('/fee-structures', data);
    return res.data;
};

// Delete a fee structure
export const deleteFeeStructure = async (id) => {
    const res = await api.delete(`/fee-structures/${id}`);
    return res.data;
};

// ==========================================
// 2. STUDENT FEES (Individual)
// ==========================================

// Get fee details for a specific student (Used by Student Portal & Admin View)
// Backend Route: GET /api/student-fees/:studentId
export const getStudentFeeDetails = async (studentId) => {
    const res = await api.get(`/student-fees/${studentId}`);
    return res.data;
};

// Assign a Fee Structure to a student (Admin)
// Backend Route: POST /api/student-fees/assign
export const assignStudentFee = async (data) => {
    // data = { studentId, feeStructureId, totalPayable, discount }
    const res = await api.post('/student-fees/assign', data);
    return res.data;
};

// Record a Payment (Student or Admin)
// Backend Route: POST /api/student-fees/pay
export const processPayment = async (paymentData) => {
    // paymentData = { studentId, amount, mode, remarks, transactionId }
    const res = await api.post('/student-fees/pay', paymentData);
    return res.data;
};

// Alias for addPayment to maintain compatibility with existing components
export const addPayment = processPayment;

// Also allow getting fees via the general function for legacy components
export const getStudentFees = getStudentFeeDetails;

// ==========================================
// 3. DASHBOARD & REPORTS (Admin)
// ==========================================

// Get aggregated stats for Fee Dashboard
// Backend Route: GET /api/student-fees/dashboard/stats
export const getFeeDashboardStats = async () => {
    const res = await api.get('/student-fees/dashboard/stats');
    return res.data;
};

// Get list of students with pending dues
// Backend Route: GET /api/student-fees/reports/defaulters
export const getFeeDefaulters = async () => {
    const res = await api.get('/student-fees/reports/defaulters');
    return res.data;
};