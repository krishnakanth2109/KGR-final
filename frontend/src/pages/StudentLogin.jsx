// src/pages/student/StudentLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api"; // Ensure this path is correct based on your folder structure

const StudentLogin = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Calls the backend route: router.post('/login', ...) inside students.js
      const response = await api.post("/students/login", {
        identifier, // This sends Email or Admission Number
        password,
      });

      if (response.data.success) {
        // Store Token in Session Storage
        sessionStorage.setItem("student-token", response.data.token);
        sessionStorage.setItem("student-user", JSON.stringify(response.data.student));
        
        // Redirect to Student Dashboard
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Login failed. Check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Student Portal</h2>
          <p className="text-gray-600 mt-2">Login with your credentials.</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email or Admission No</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="e.g. 2024-001 or student@example.com"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl transition hover:bg-green-700 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-gray-500 hover:text-green-600 font-medium">
            &larr; Back to Selection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;