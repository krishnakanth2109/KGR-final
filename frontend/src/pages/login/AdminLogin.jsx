// src/pages/login/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.success) {
        sessionStorage.setItem("admin-token", response.data.token);
        localStorage.removeItem("admin-token");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-blue-100">

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Administrator Login</h2>
          <p className="text-gray-600 mt-2">Access your admin panel.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@college.com"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-blue-500 outline-none bg-white text-gray-800"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800"
              />

              {/* Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPass ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl 
                       transition hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-blue-600 font-medium"
          >
            &larr; Back to Selection
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
