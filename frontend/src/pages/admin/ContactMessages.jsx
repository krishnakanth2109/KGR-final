import React, { useEffect, useState } from "react";
import { 
  MessageSquare, Clock, Calendar, Search, Trash2, Eye, 
  Mail, X, User, CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';
import api from '../../api/api'; // Ensure you have your axios instance here

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null); // For Modal

  // --- FETCH MESSAGES ---
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // Using the api instance handles the Base URL automatically
      const response = await api.get('/contact');
      // Sort by date descending (newest first) by default
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(sortedData);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE MESSAGE ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await api.delete(`/contact/${id}`);
        setMessages(messages.filter(msg => msg._id !== id));
      } catch (error) {
        alert("Failed to delete message");
      }
    }
  };

  // --- STATS CALCULATION ---
  const totalMessages = messages.length;
  const todayMessages = messages.filter(m => new Date(m.createdAt).toDateString() === new Date().toDateString()).length;
  const lastMessageTime = messages.length > 0 ? new Date(messages[0].createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A';

  // --- FILTERING ---
  const filteredMessages = messages.filter(msg => 
    msg.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-800">
      
      {/* --- HEADER & STATS --- */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <Mail className="text-indigo-600" size={32}/> Contact Enquiries
             </h1>
             <p className="text-slate-500 mt-2 font-medium">Manage and review incoming messages from the website.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatCard 
             title="Total Messages" 
             value={totalMessages} 
             icon={<MessageSquare size={24} />} 
             color="blue"
           />
           <StatCard 
             title="Received Today" 
             value={todayMessages} 
             icon={<Calendar size={24} />} 
             color="emerald"
             isNew={todayMessages > 0}
           />
           <StatCard 
             title="Last Activity" 
             value={lastMessageTime} 
             icon={<Clock size={24} />} 
             color="purple"
             subText={messages.length > 0 ? formatDate(messages[0].createdAt) : ''}
           />
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10">
             <h2 className="text-lg font-bold text-slate-700">Message Inbox</h2>
             <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                   type="text" 
                   placeholder="Search name or email..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
                />
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs uppercase font-extrabold tracking-wider">
                    <th className="p-6 pl-8">Sender Details</th>
                    <th className="p-6">Message Preview</th>
                    <th className="p-6">Date</th>
                    <th className="p-6 text-center">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {loading ? (
                    <tr><td colSpan="4" className="p-20 text-center text-slate-400"><Loader2 className="animate-spin mx-auto mb-3" size={32}/>Loading messages...</td></tr>
                 ) : filteredMessages.length === 0 ? (
                    <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-medium">No messages found matching your search.</td></tr>
                 ) : (
                    filteredMessages.map((msg) => (
                      <tr key={msg._id} className="hover:bg-indigo-50/30 transition-colors group">
                         <td className="p-6 pl-8">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200 shadow-sm">
                                  {msg.fullName.charAt(0).toUpperCase()}
                               </div>
                               <div>
                                  <div className="font-bold text-slate-800">{msg.fullName}</div>
                                  <div className="text-xs text-slate-500 font-medium">{msg.email}</div>
                               </div>
                            </div>
                         </td>
                         <td className="p-6">
                            <div className="max-w-md text-sm text-slate-600 truncate font-medium">
                               {msg.message}
                            </div>
                         </td>
                         <td className="p-6">
                            <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg w-fit">
                               {formatDate(msg.createdAt)}
                            </div>
                         </td>
                         <td className="p-6">
                            <div className="flex justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => setSelectedMessage(msg)}
                                 className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition shadow-sm"
                                 title="View Message"
                               >
                                  <Eye size={18}/>
                               </button>
                               <button 
                                 onClick={() => handleDelete(msg._id)}
                                 className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition shadow-sm"
                                 title="Delete"
                               >
                                  <Trash2 size={18}/>
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))
                 )}
               </tbody>
             </table>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
             <span>Total: {filteredMessages.length} Messages</span>
          </div>
        </div>

      </div>

      {/* --- MESSAGE VIEW MODAL --- */}
      {selectedMessage && (
        <MessageModal 
           msg={selectedMessage} 
           onClose={() => setSelectedMessage(null)}
        />
      )}

    </div>
  );
};

// --- SUB COMPONENTS ---

const StatCard = ({ title, value, icon, color, isNew, subText }) => (
  <div className={`bg-white p-6 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
     <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-50 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150`}></div>
     <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
           <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600 shadow-sm`}>
              {icon}
           </div>
           {isNew && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>}
        </div>
        <div>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
           <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
           {subText && <p className="text-xs text-slate-400 mt-1 font-medium">{subText}</p>}
        </div>
     </div>
  </div>
);

const MessageModal = ({ msg, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
     <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
        
        {/* Modal Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-start relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
           <div className="relative z-10 flex gap-4 items-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/10">
                 {msg.fullName.charAt(0)}
              </div>
              <div>
                 <h2 className="text-xl font-bold">{msg.fullName}</h2>
                 <p className="text-slate-400 text-sm flex items-center gap-1"><Mail size={12}/> {msg.email}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition relative z-10"><X size={20}/></button>
        </div>

        {/* Modal Body */}
        <div className="p-8">
           <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Message Content</label>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-relaxed font-medium">
                 {msg.message}
              </div>
           </div>
           
           <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Sent on: {new Date(msg.createdAt).toLocaleString()}</span>
           </div>

           <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                 onClick={onClose} 
                 className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
              >
                 Close
              </button>
           </div>
        </div>
     </div>
  </div>
);

export default ContactMessages;