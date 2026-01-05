// --- START OF FILE src/components/admin/NotificationPanel.jsx ---

import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Check, FileText, UserPlus, CreditCard, MessageSquare, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import api from '../../api/api'; // Updated import to use centralized API

// Using a placeholder URL for sound.
const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(new Audio(NOTIFICATION_SOUND));
  const socketRef = useRef(null);

  // --- 1. Initialize Socket & Fetch Data ---
  useEffect(() => {
    // Fetch initial history
    fetchNotifications();

    // Determine Socket URL dynamically based on API Base URL
    // e.g., "http://localhost:5000/api" -> "http://localhost:5000"
    const apiBaseUrl = api.defaults.baseURL || "";
    const socketUrl = apiBaseUrl.replace('/api', '');

    // Connect to Socket
    socketRef.current = io(socketUrl); 

    // Listen for new events
    socketRef.current.on("new-notification", (newNotif) => {
      // Play Sound
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed)", e));

      // Update State
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      // Uses centralized API instance (handles Auth header + Base URL)
      const res = await api.get("/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAllRead = async () => {
    setLoading(true);
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark read", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Helper for Icons & Colors ---
  const getIconAndColor = (type) => {
    switch (type) {
      case "admission":
        return { icon: <UserPlus size={18} />, color: "bg-blue-100 text-blue-600" };
      case "fee":
        return { icon: <CreditCard size={18} />, color: "bg-green-100 text-green-600" };
      case "contact":
        return { icon: <MessageSquare size={18} />, color: "bg-purple-100 text-purple-600" };
      default:
        return { icon: <FileText size={18} />, color: "bg-gray-100 text-gray-600" };
    }
  };

  return (
    <div className="relative z-50">
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-all active:scale-95 outline-none focus:ring-2 focus:ring-blue-100"
      >
        <Bell size={22} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile to close when clicking outside */}
            <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 md:w-96 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/50">
                <div>
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                  <p className="text-xs text-gray-500">You have {unreadCount} unread messages</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={markAllRead}
                    disabled={loading || unreadCount === 0}
                    title="Mark all as read"
                    className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                    <Bell size={32} className="mb-2 opacity-20" />
                    <p className="text-sm">No notifications yet.</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const { icon, color } = getIconAndColor(notif.type);
                    return (
                      <motion.div
                        layout
                        key={notif._id}
                        className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors cursor-default relative ${!notif.isRead ? 'bg-blue-50/40' : 'bg-white'}`}
                      >
                        {/* Indicator Dot for Unread */}
                        {!notif.isRead && (
                            <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full shadow-sm"></span>
                        )}

                        <div className={`h-10 w-10 min-w-[2.5rem] rounded-full flex items-center justify-center ${color}`}>
                          {icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 leading-tight mb-1">
                            {notif.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <button 
                  onClick={() => setIsOpen(false)} // Or redirect to a dedicated page
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  View All Activity
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;