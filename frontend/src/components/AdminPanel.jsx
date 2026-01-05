import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const [galleryItems, setGalleryItems] = useState([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', image: null });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/login', { password });
      setIsLoggedIn(true);
      setError('');
      sessionStorage.setItem('admin-password', password);
    } catch (err) {
      setError('Invalid password.');
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/gallery');
      setGalleryItems(res.data);
    } catch (err) {
      console.error('Could not fetch items', err);
    }
  };

  useEffect(() => {
    // Check if a password was already stored in the session
    const storedPassword = sessionStorage.getItem('admin-password');
    if (storedPassword) {
        setPassword(storedPassword);
        // Silently verify the stored password
        axios.post('http://localhost:5000/api/admin/login', { password: storedPassword })
            .then(() => {
                setIsLoggedIn(true);
            })
            .catch(() => {
                sessionStorage.removeItem('admin-password'); // Clear invalid stored password
            });
    }

    if (isLoggedIn) {
      fetchItems();
    }
  }, [isLoggedIn]);

  const handleFileChange = (e) => {
    setNewItem({ ...newItem, image: e.target.files[0] });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const storedPassword = sessionStorage.getItem('admin-password');
    if (!newItem.title || !newItem.description || !newItem.image || !storedPassword) {
      alert('Please fill all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', newItem.title);
    formData.append('description', newItem.description);
    formData.append('image', newItem.image);

    try {
      await axios.post('http://localhost:5000/api/admin/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-admin-password': storedPassword,
        },
      });
      setNewItem({ title: '', description: '', image: null });
      e.target.reset();
      fetchItems();
    } catch (err) {
      alert('Failed to create item.');
    }
  };

  const handleDelete = async (id) => {
    const storedPassword = sessionStorage.getItem('admin-password');
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/gallery/${id}`, {
        headers: { 'x-admin-password': storedPassword },
      });
      fetchItems();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Admin Password"
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Gallery Admin Panel</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Gallery Item</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Title"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />
          <textarea
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />
          <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded mb-4" />
          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Add Item
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Existing Items</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;