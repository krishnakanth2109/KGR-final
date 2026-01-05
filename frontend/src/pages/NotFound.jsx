// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react"; // clean icon from lucide-react

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <div className="max-w-lg w-full text-center bg-white rounded-3xl shadow-2xl p-10">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 text-red-600 p-4 rounded-full">
            <AlertCircle size={40} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="mt-3 text-gray-600 leading-relaxed">
          The page you're looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            Go Back Home
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-200 transition shadow"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
