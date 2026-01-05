// --- START OF FILE Gallery.jsx ---
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import api from "../api"; // Imports the dynamic API helper

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/gallery");
        setGalleryItems(res.data);
      } catch (error) {
        console.error("Failed to load gallery:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          College Gallery
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Explore the events, camps, and activities at KGR Vocational Junior College.
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {galleryItems.map((item) => (
          <motion.div
            key={item._id}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl"
            onClick={() => setSelected(item)}
            whileHover={{ scale: 1.03 }}
          >
            <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover" loading="lazy" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl">
                <FaTimes />
              </button>
              <img src={selected.imageUrl} alt={selected.title} className="w-full h-auto max-h-[80vh] object-contain rounded-lg mb-4" loading="lazy" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selected.title}</h2>
              <p className="text-gray-600">{selected.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;