// src/pages/login/LoginOptions.jsx
import React from "react";
import { Link } from "react-router-dom";
import { UserCog, GraduationCap } from "lucide-react";

const LoginOptions = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to KGR College</h1>
          <p className="text-gray-600 text-lg">Please select your login type to continue.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Admin Option */}
          <Link
            to="/login/admin"
            className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <UserCog size={40} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Administrator</h2>
            <p className="text-gray-500 mb-6">
              Manage admissions, students, faculty, and college settings.
            </p>
            <span className="text-blue-600 font-semibold group-hover:underline">
              Admin Login &rarr;
            </span>
          </Link>

          {/* Student Option */}
          <Link
            to="/login/student"
            className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
              <GraduationCap size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Student</h2>
            <p className="text-gray-500 mb-6">
              View your results, fee status, documents, and profile.
            </p>
            <span className="text-green-600 font-semibold group-hover:underline">
              Student Login &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginOptions;