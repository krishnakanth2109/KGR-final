import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Megaphone, 
  Info, 
  AlertTriangle, 
  Loader2, 
  Calendar, 
  FileText,
  CheckCircle
} from 'lucide-react';
import api from '../../api/api'; 

const StudentNotifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch & Filter Notifications ---
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications'); 
        
        // --- FILTERING LOGIC ---
        // 1. Define types that are strictly for Admins
        const adminTypes = ['admission', 'contact'];
        
        // 2. Filter out admin types. 
        // Students will only see: 'general', 'fee', 'exam', 'academic'
        const studentRelevantNotifications = res.data.filter(note => 
          !adminTypes.includes(note.type)
        );

        setAlerts(studentRelevantNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // --- Helper for Icons & Colors ---
  const getIcon = (type) => {
    switch (type) {
      case 'fee': 
        // For students, fee usually means deadline or payment success
        return <AlertTriangle className="text-red-500" size={24} />;
      case 'exam':
        return <Calendar className="text-purple-500" size={24} />;
      case 'academic':
        return <FileText className="text-blue-500" size={24} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'general':
      default:
        return <Megaphone className="text-amber-500" size={24} />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'fee': return 'border-l-4 border-l-red-500';
      case 'exam': return 'border-l-4 border-l-purple-500';
      case 'academic': return 'border-l-4 border-l-blue-500';
      case 'success': return 'border-l-4 border-l-green-500';
      default: return 'border-l-4 border-l-amber-500'; // General
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'fee': return 'Finance Alert';
      case 'exam': return 'Exam Update';
      case 'academic': return 'Academic';
      case 'general': return 'Announcement';
      default: return 'Info';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-5xl mx-auto min-h-screen bg-gray-50/30">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                <Bell className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Notifications</h1>
                <p className="text-gray-500 text-sm mt-1">Updates on exams, fees, and college announcements.</p>
            </div>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
            {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <Bell className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">All caught up!</h3>
                    <p className="text-gray-500 text-sm mt-1">No new notifications for you at the moment.</p>
                </div>
            ) : (
                alerts.map((alert) => (
                    <div 
                        key={alert._id} 
                        className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group ${getBorderColor(alert.type)}`}
                    >
                        <div className="flex gap-4 items-start">
                            {/* Icon Box */}
                            <div className="mt-1 p-3 bg-gray-50 rounded-xl shrink-0 group-hover:bg-gray-100 transition-colors">
                                {getIcon(alert.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-800 text-lg leading-tight">
                                            {alert.title}
                                        </h3>
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
                                            {getTypeLabel(alert.type)}
                                        </span>
                                    </div>
                                    
                                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1 shrink-0">
                                        <ClockIcon size={12} />
                                        {new Date(alert.createdAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                    {alert.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

// Simple Clock Icon Helper
const ClockIcon = ({ size = 14, className = "" }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

export default StudentNotifications;