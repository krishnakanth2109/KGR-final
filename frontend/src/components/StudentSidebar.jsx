import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  GraduationCap, 
  LogOut,
  ChevronDown, 
  ChevronRight,
  CreditCard,
  History,
  Menu,
  ChevronsLeft,
  CalendarClock, 
  BookOpen,      
  Bell,
  User 
} from 'lucide-react';

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const student = JSON.parse(sessionStorage.getItem('student-user') || '{}');
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('/student/fees')) {
      setIsFinanceOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('student-token');
    sessionStorage.removeItem('student-user');
    navigate('/login/student');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setIsFinanceOpen(false);
  };

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';
  
  const linkClasses = ({ isActive }) =>
    `relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
      isActive
        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold shadow-lg shadow-amber-500/30'
        : 'text-slate-400 hover:bg-white/5 hover:text-amber-400'
    } ${isCollapsed ? 'justify-center' : ''}`;

  const subLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 ${
      isActive
        ? 'bg-yellow-500/20 text-amber-300 font-medium border-l-2 border-amber-400 pl-2'
        : 'text-slate-500 hover:text-amber-300 hover:bg-white/5'
    }`;

  return (
    <aside className={`${sidebarWidth} bg-[#0f172a] h-screen flex flex-col border-r border-slate-800 shadow-2xl transition-all duration-300 ease-in-out relative z-50`}>
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between relative">
        {!isCollapsed && (
          <div className="flex items-center gap-2 animate-fadeIn">
            <div className="bg-gradient-to-tr from-amber-400 to-yellow-500 p-1.5 rounded-lg shadow-lg">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">EduPortal</span>
          </div>
        )}
        
        <button 
          onClick={toggleSidebar}
          className={`p-2 rounded-lg text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>

      {/* Profile Summary */}
      <div className="px-3 mb-6">
        <div className={`group relative bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border border-amber-500/30 rounded-2xl transition-all duration-300 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/20 ${isCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}>
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-900 text-xl font-bold shadow-lg uppercase">
                {student.name?.charAt(0) || 'S'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden animate-fadeIn">
                <p className="text-sm font-semibold text-white truncate group-hover:text-amber-200">
                  {student.name || 'Student'}
                </p>
                <p className="text-[10px] text-amber-300 truncate font-mono opacity-80">
                  {student.admission_number || 'ID: --'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        
        <NavLink to="/student/dashboard" className={linkClasses}>
          <LayoutDashboard size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium truncate animate-fadeIn">Dashboard</span>}
        </NavLink>

        <NavLink to="/student/profile" className={linkClasses}>
          <User size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium truncate animate-fadeIn">My Profile</span>}
        </NavLink>

        <NavLink to="/student/timetable" className={linkClasses}>
          <CalendarClock size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium truncate animate-fadeIn">Time Table</span>}
        </NavLink>

        <NavLink to="/student/exams" className={linkClasses}>
          <GraduationCap size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium truncate animate-fadeIn">Academics</span>}
        </NavLink>

        <NavLink to="/student/resources" className={linkClasses}>
          <BookOpen size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium truncate animate-fadeIn">Resources</span>}
        </NavLink>

        {/* Finance Section */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => {
              if(isCollapsed) {
                setIsCollapsed(false);
                setTimeout(() => setIsFinanceOpen(true), 100);
              } else {
                setIsFinanceOpen(!isFinanceOpen);
              }
            }}
            className={`flex items-center w-full px-3 py-3 rounded-xl transition-all duration-300 group ${
              (isFinanceOpen || location.pathname.includes('/student/fees'))
                ? 'bg-slate-800/50 text-amber-400 shadow-md' 
                : 'text-slate-400 hover:bg-white/5 hover:text-amber-400'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div className="flex items-center gap-3">
              <Wallet size={20} className={isFinanceOpen ? 'text-amber-400' : ''} />
              {!isCollapsed && <span className="font-medium animate-fadeIn">Finance</span>}
            </div>
            {!isCollapsed && (
              isFinanceOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
          </button>

          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              (isFinanceOpen && !isCollapsed) ? 'max-h-40 opacity-100 mt-1 pl-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="border-l-2 border-amber-700/30 pl-2 space-y-1">
              <NavLink to="/student/fees/pay" className={subLinkClasses}>
                <CreditCard size={16} />
                <span>Due Payments</span>
              </NavLink>
              <NavLink to="/student/fees/history" className={subLinkClasses}>
                <History size={16} />
                <span>History</span>
              </NavLink>
            </div>
          </div>
        </div>

        <NavLink to="/student/documents" className={linkClasses}>
          <FileText size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium truncate animate-fadeIn">Documents</span>}
        </NavLink>

        {/* Notifications Link */}
        <NavLink to="/student/notifications" className={linkClasses}>
          <Bell size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium truncate animate-fadeIn">Notifications</span>}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-3 w-full rounded-xl text-red-400 hover:text-white hover:bg-red-500/10 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          title="Logout"
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium animate-fadeIn">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;