import api from './api'; // Import the central, configured api helper

/**
 * Fetches and filters faculty members from the real backend.
 * @param {object} filters - The filter criteria from the UI.
 * @returns {Promise<object>} A promise that resolves to the API response data.
 */
export const getFaculty = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/faculty?${params}`);
  return response.data;
};

/**
 * Fetches a single faculty member by their ID from the real backend.
 * @param {string} id - The _id of the faculty member.
 * @returns {Promise<object|null>} A promise that resolves to the faculty object.
 */
export const getFacultyById = async (id) => {
  const response = await api.get(`/faculty/${id}`);
  return response.data;
};

/**
 * Adds a new faculty member via the real backend.
 * @param {object} facultyData - The new faculty member's data from the form.
 * @returns {Promise<object>} A promise that resolves to the newly created faculty object.
 */
export const addFaculty = async (facultyData) => {
  const response = await api.post('/faculty', facultyData);
  return response.data;
};

/**
 * Updates an existing faculty member's data via the real backend.
 * @param {string} id - The _id of the member to update.
 * @param {object} updatedData - The new data for the member.
 * @returns {Promise<object|null>} A promise that resolves to the updated faculty object.
 */
export const updateFaculty = async (id, updatedData) => {
  const response = await api.put(`/faculty/${id}`, updatedData);
  return response.data;
};

/**
 * Changes a faculty member's status via the real backend.
 * @param {object} { id, status } - The member's ID and their new status.
 * @returns {Promise<object>} A promise that resolves to a success message.
 */
export const setFacultyStatus = async ({ id, status }) => {
  const response = await api.patch('/faculty/status', { id, status });
  return response.data;
};