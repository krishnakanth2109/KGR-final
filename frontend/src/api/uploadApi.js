import api from './api'; // Use your configured axios instance

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('image', file); // Multer expects field name 'image'

  try {
    // We need a generic upload endpoint on your backend.
    // Since you don't have a standalone upload route yet, we'll create one below.
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) {
          onProgress(percent);
        }
      },
    });
    
    // Assuming backend returns { url: "..." }
    return response.data.url; 
  } catch (error) {
    console.error("Backend Upload Error:", error);
    throw new Error("File upload failed.");
  }
};