import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api"; 
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/students/login", {
        identifier,
        password,
      });

      if (response.data.success) {
        sessionStorage.setItem("student-token", response.data.token);
        sessionStorage.setItem("student-user", JSON.stringify(response.data.student));
        navigate("/student/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/80"></div>

      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 mx-4">
        
        <Link to="/login" className="flex items-center gap-2 text-gray-500 text-sm mb-6 hover:text-blue-600 transition">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-800">Student Portal</h2>
          <p className="text-gray-500 mt-1">Access your account</p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Identifier */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email or Admission No
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="e.g. 2024-001"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Password with ICON */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex justify-center items-center shadow-lg transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Login Securely"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Forgot your credentials? Contact the administration office.
        </p>
        
      </div>
    </div>
  );
};

export default StudentLogin;
