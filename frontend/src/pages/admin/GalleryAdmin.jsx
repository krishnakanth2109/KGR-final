import React, { useState, useEffect } from 'react';
import api from '../api'; // <-- USE THE NEW, SECURE API HELPER
import { motion, AnimatePresence } from 'framer-motion';

const GalleryAdmin = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', image: null });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);

  // The old, insecure password logic is no longer needed and has been removed.

  const fetchItems = async () => {
    try {
      const res = await api.get('/gallery'); // Use the api helper
      setGalleryItems(res.data);
    } catch (err) { console.error('Could not fetch items', err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleFileChange = (e) => {
    setNewItem({ ...newItem, image: e.target.files[0] });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.description || !newItem.image) {
      return alert('Please fill all fields and upload an image.');
    }
    const formData = new FormData();
    formData.append('title', newItem.title);
    formData.append('description', newItem.description);
    formData.append('image', newItem.image);
    try {
      // Use the 'api' helper. It automatically adds the secure token.
      await api.post('/admin/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNewItem({ title: '', description: '', image: null });
      e.target.reset();
      fetchItems();
    } catch (err) { alert('Failed to create item. Your login session may have expired.'); }
  };
  
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setIsEditing(true);
    setNewImageFile(null);
  };

  const handleUpdateText = async (e) => {
    e.preventDefault();
    if (!currentItem.title || !currentItem.description) return alert('Title and description are required.');
    try {
      await api.put(`/admin/gallery/${currentItem._id}`, 
        { title: currentItem.title, description: currentItem.description }
      );
      fetchItems();
      alert('Text updated successfully!');
      if (!newImageFile) setIsEditing(false);
    } catch (err) { alert('Failed to update text. Your login session may have expired.'); }
  };
  
  const handleImageUpdate = async () => {
    if (!newImageFile || !currentItem) return alert('Please select a new image file.');
    const formData = new FormData();
    formData.append('image', newImageFile);
    try {
      await api.put(`/admin/gallery/image/${currentItem._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsEditing(false);
      setNewImageFile(null);
      fetchItems();
      alert('Image updated successfully!');
    } catch (err) { alert('Failed to update image. Your login session may have expired.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      fetchItems();
    } catch (err) { alert('Failed to delete item. Your login session may have expired.'); }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Gallery</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
        <form onSubmit={handleCreate}>
          <input type="text" placeholder="Title" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="w-full p-2 border rounded mb-4" />
          <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="w-full p-2 border rounded mb-4" />
          <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded mb-4" />
          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Add Item</button>
        </form>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Items</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isEditing && currentItem && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
              <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
              <form onSubmit={handleUpdateText} className="pb-4 border-b mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input type="text" value={currentItem.title} onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                <label className="block text-sm font-medium mt-2">Description</label>
                <textarea value={currentItem.description} onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })} className="w-full mt-1 p-2 border rounded" rows="3" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Save Text Changes</button>
              </form>
              <div className="pt-4">
                  <label className="block text-sm font-medium">Change Image</label>
                  <input type="file" onChange={(e) => setNewImageFile(e.target.files[0])} className="w-full mt-1 p-2 border rounded" />
                  <button onClick={handleImageUpdate} disabled={!newImageFile} className="bg-teal-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-50">Upload New Image</button>
              </div>
              <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default GalleryAdmin;