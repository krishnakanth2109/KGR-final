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
  ChevronDown,
  ChevronRight,
  IndianRupee, 
  Calendar,    
  FileText,
  Layers,
  Link as LinkIcon,
  FileBarChart,
  MessageSquare,
  ClipboardList,
  Settings,
  Shield,
  Home
} from "lucide-react";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSection, setOpenSection] = useState("Academic"); // Default open section
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("admin-token");
        sessionStorage.removeItem("admin-token");
        navigate("/login/admin");
    }
  };

  const toggleSection = (sectionName) => {
    // If sidebar is collapsed, open it when clicking a section
    if (!isSidebarOpen) setIsSidebarOpen(true);
    
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  const isActive = (path) => location.pathname === path;

  // Reusable Nav Item Component
  const NavItem = ({ to, icon: Icon, label }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-1
        ${isActive(to) 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}
    >
      <Icon size={18} className={isActive(to) ? 'text-white' : 'text-slate-400'} />
      <span className="truncate">{label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-xl shadow-slate-200/50 z-20 relative`}
      >
        
        {/* HEADER & LOGO */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${!isSidebarOpen && "w-0 opacity-0"}`}>
            <img 
              src="https://i.postimg.cc/7hQ3v2fc/logo.png" 
              alt="KGR Logo" 
              className="h-8 w-8 object-contain"
            />
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 leading-tight">KGR College</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* NAVIGATION SCROLL AREA */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          
          {/* 1. DASHBOARD (Always Visible) */}
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />

          {/* If Sidebar Collapsed: Show simple icons only */}
          {!isSidebarOpen ? (
             <div className="flex flex-col items-center gap-4 mt-6">
                <div className="w-8 h-px bg-slate-200"></div>
                <Link to="/admin/students" title="Students"><Users size={20} className="text-slate-400 hover:text-blue-600"/></Link>
                <Link to="/admin/fees/dashboard" title="Fees"><IndianRupee size={20} className="text-slate-400 hover:text-blue-600"/></Link>
                <Link to="/admin/exams" title="Exams"><Calendar size={20} className="text-slate-400 hover:text-blue-600"/></Link>
                <Link to="/admin/documents" title="Documents"><FileText size={20} className="text-slate-400 hover:text-blue-600"/></Link>
             </div>
          ) : (
            <div className="space-y-4 mt-6">
                
                {/* GROUP 1: PEOPLE & ADMISSIONS */}
                <div>
                    <button 
                        onClick={() => toggleSection("People")} 
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-blue-600 transition-colors"
                    >
                        <span>Administration</span>
                        {openSection === "People" ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${openSection === "People" ? "max-h-48 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                        <NavItem to="/admin/admissions" icon={ClipboardList} label="Admissions" />
                        <NavItem to="/admin/students" icon={Users} label="Student Directory" />
                        <NavItem to="/admin/faculty" icon={GraduationCap} label="Faculty Staff" />
                    </div>
                </div>

                {/* GROUP 2: FINANCE */}
                <div>
                    <button 
                        onClick={() => toggleSection("Fees")} 
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-blue-600 transition-colors"
                    >
                        <span>Fee Management</span>
                        {openSection === "Fees" ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${openSection === "Fees" ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                        <NavItem to="/admin/fees/dashboard" icon={IndianRupee} label="Overview" />
                        <NavItem to="/admin/fees/structure" icon={Layers} label="Fee Structures" />
                        <NavItem to="/admin/fees/generator" icon={LinkIcon} label="Fee Generator" />
                        <NavItem to="/admin/fees/reports" icon={FileBarChart} label="Reports" />
                    </div>
                </div>

                {/* GROUP 3: ACADEMIC */}
                <div>
                    <button 
                        onClick={() => toggleSection("Academic")} 
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-blue-600 transition-colors"
                    >
                        <span>Academic</span>
                        {openSection === "Academic" ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${openSection === "Academic" ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                        <NavItem to="/admin/exams" icon={Calendar} label="Exam Schedules" />
                        <NavItem to="/admin/courses" icon={BookOpen} label="Course Manager" />
                    </div>
                </div>

                {/* GROUP 4: CONTENT & SYSTEM */}
                <div>
                    <button 
                        onClick={() => toggleSection("System")} 
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-blue-600 transition-colors"
                    >
                        <span>CMS & System</span>
                        {openSection === "System" ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${openSection === "System" ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                        <NavItem to="/admin/documents" icon={FileText} label="Documents" />
                        <NavItem to="/admin/gallery" icon={Image} label="Gallery" />
                        <NavItem to="/admin/contact-messages" icon={MessageSquare} label="Messages" />
                        <NavItem to="/admin/settings" icon={Settings} label="Global Settings" />
                    </div>
                </div>

            </div>
          )}
        </div>

        {/* FOOTER - LOGOUT */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 hover:shadow-sm transition-all duration-200 group ${!isSidebarOpen && "justify-center px-0"}`}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-semibold text-sm">Sign Out</span>}
          </button>
        </div>

      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
        
        {/* Top Bar Mobile/Desktop */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Shield className="text-blue-600" size={20} />
                Administrator Portal
            </h2>
            <div className="flex items-center gap-4">
                <Link to="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                    <Home size={16} /> View Site
                </Link>
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
                    A
                </div>
            </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <div className="max-w-7xl mx-auto animate-fade-in-up">
                <Outlet />
            </div>
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;