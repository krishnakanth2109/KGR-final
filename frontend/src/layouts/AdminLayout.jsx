import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Image,
  LogOut,
  Menu,
  IndianRupee, 
  Calendar,    
  FileText,
  PieChart,
  Layers,
  Link as LinkIcon,
  AlertCircle,
  FileBarChart,
  MessageSquare,
  ClipboardList,
  Settings // <-- IMPORT SETTINGS ICON
} from "lucide-react";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("admin-token");
    sessionStorage.removeItem("admin-token");
    navigate("/login/admin");
  };

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `flex items-center gap-3 p-3 rounded-lg transition ${isActive(path) ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-white shadow-xl transition-all duration-300 flex flex-col sticky top-0 h-screen overflow-hidden z-20`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-yellow-600">     Admin Panel</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 ml-auto"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          
          {/* ... [KEEP ALL YOUR EXISTING LINKS HERE] ... */}
          
          <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>

          <Link to="/admin/admissions" className={linkClass('/admin/admissions')}>
            <ClipboardList size={20} />
            {!isCollapsed && <span>Admissions</span>}
          </Link>

          <Link to="/admin/students" className={linkClass('/admin/students')}>
            <Users size={20} />
            {!isCollapsed && <span>Students</span>}
          </Link>

          {/* ... [Fee Management Section] ... */}
          {!isCollapsed && <p className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1 px-2">Fee Management</p>}
          
          <Link to="/admin/fees/dashboard" className={linkClass('/admin/fees/dashboard')}>
            <IndianRupee size={20} />
            {!isCollapsed && <span>Fee Dashboard</span>}
          </Link>
          <Link to="/admin/fees/structure" className={linkClass('/admin/fees/structure')}>
            <Layers size={20} />
            {!isCollapsed && <span>Fee Structure</span>}
          </Link>
          <Link to="/admin/fees/generator" className={linkClass('/admin/fees/generator')}>
            <LinkIcon size={20} />
            {!isCollapsed && <span>Student Fee Generator</span>}
          </Link>
          <Link to="/admin/fees/reports" className={linkClass('/admin/fees/reports')}>
            <FileBarChart size={20} />
            {!isCollapsed && <span>Reports & Analytics</span>}
          </Link>

          {/* ... [Academics Section] ... */}
          {!isCollapsed && <p className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1 px-2">Academics</p>}
          <Link to="/admin/exams" className={linkClass('/admin/exams')}>
            <Calendar size={20} />
            {!isCollapsed && <span>Exam Scheduler</span>}
          </Link>
          <Link to="/admin/faculty" className={linkClass('/admin/faculty')}>
            <GraduationCap size={20} />
            {!isCollapsed && <span>Faculty</span>}
          </Link>
          <Link to="/admin/courses" className={linkClass('/admin/courses')}>
            <BookOpen size={20} />
            {!isCollapsed && <span>Courses</span>}
          </Link>

          {/* ... [Content Section] ... */}
          {!isCollapsed && <p className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1 px-2">Content</p>}
          <Link to="/admin/documents" className={linkClass('/admin/documents')}>
            <FileText size={20} />
            {!isCollapsed && <span>Documents</span>}
          </Link>
          <Link to="/admin/gallery" className={linkClass('/admin/gallery')}>
            <Image size={20} />
            {!isCollapsed && <span>Gallery</span>}
          </Link>
          <Link to="/admin/contact-messages" className={linkClass('/admin/contact-messages')}>
            <MessageSquare size={20} />
            {!isCollapsed && <span>Contact Messages</span>}
          </Link>

          {/* --- NEW SETTINGS LINK --- */}
          {!isCollapsed && <p className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1 px-2">System</p>}
          <Link to="/admin/settings" className={linkClass('/admin/settings')}>
            <Settings size={20} />
            {!isCollapsed && <span>Settings</span>}
          </Link>

        </nav>

        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;