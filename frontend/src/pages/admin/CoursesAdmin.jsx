import React, { useState, useEffect } from 'react';
import api from '../api'; // <-- USE THE NEW, SECURE API HELPER

const CoursesAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
      slug: '', title: '', description: '', highlights: '',
      duration: '', eligibility: '', careerIntro: '', image: null
  });

  // The old, insecure password logic is no longer needed and has been removed.

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses'); // Use the api helper
      setCourses(res.data);
    } catch (err) { console.error('Failed to fetch courses:', err); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleEdit = (course) => {
    setCurrentItem(course);
    setFormData({ ...course, highlights: course.highlights.join(', '), image: null });
    setIsEditing(true);
    setIsFormVisible(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        // Use the 'api' helper. It automatically adds the secure token.
        await api.delete(`/admin/courses/${id}`);
        fetchCourses();
      } catch (err) { alert('Failed to delete course. Your login session may have expired.'); }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    for (const key in formData) {
        submissionData.append(key, formData[key]);
    }

    const url = isEditing ? `/admin/courses/${currentItem._id}` : '/admin/courses';
    const method = isEditing ? 'put' : 'post';
    try {
      await api[method](url, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      resetForm();
      fetchCourses();
    } catch (err) { alert(`Failed to ${isEditing ? 'update' : 'create'} course. Your login session may have expired.`); }
  };

  const resetForm = () => {
      setIsFormVisible(false);
      setIsEditing(false);
      setCurrentItem(null);
      setFormData({ slug: '', title: '', description: '', highlights: '', duration: '', eligibility: '', careerIntro: '', image: null });
  };
  
  const openNewForm = () => {
      resetForm();
      setIsFormVisible(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        {!isFormVisible && <button onClick={openNewForm} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add New Course</button>}
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
          <form onSubmit={handleFormSubmit}>
            <input name="slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="URL Slug (e.g., mphw)" required className="w-full p-2 border rounded mb-2" />
            <input name="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Course Title" required className="w-full p-2 border rounded mb-2" />
            <textarea name="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description" required className="w-full p-2 border rounded mb-2" />
            <textarea name="highlights" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} placeholder="Highlights (comma-separated)" required className="w-full p-2 border rounded mb-2" />
            <input name="duration" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Duration" required className="w-full p-2 border rounded mb-2" />
            <input name="eligibility" value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})} placeholder="Eligibility" required className="w-full p-2 border rounded mb-2" />
            <textarea name="careerIntro" value={formData.careerIntro} onChange={e => setFormData({...formData, careerIntro: e.target.value})} placeholder="Career Intro" required className="w-full p-2 border rounded mb-2" />
            <label className="block text-sm font-medium text-gray-700">Course Image {isEditing && '(Leave empty to keep existing)'}</label>
            <input name="image" type="file" onChange={e => setFormData({...formData, image: e.target.files[0]})} required={!isEditing} className="w-full p-2 border rounded mb-4" />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">{isEditing ? 'Update Course' : 'Create Course'}</button>
            <button type="button" onClick={resetForm} className="bg-gray-200 ml-2 p-2 rounded">Cancel</button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded mb-2" />
            <h3 className="font-bold">{course.title}</h3>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(course)} className="bg-yellow-500 text-white px-3 py-1 text-sm rounded">Edit</button>
              <button onClick={() => handleDelete(course._id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesAdmin;