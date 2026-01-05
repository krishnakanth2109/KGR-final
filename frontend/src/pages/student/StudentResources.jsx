import React, { useState } from 'react';
import { BookOpen, Video, Download, FileText, PlayCircle } from 'lucide-react';

const StudentResources = () => {
  const [activeTab, setActiveTab] = useState('notes');

  const notes = [
    { title: 'Anatomy Unit 1 - Introduction', date: '10 Dec 2024', size: '2.4 MB' },
    { title: 'Physiology - Circulatory System', date: '08 Dec 2024', size: '1.8 MB' },
    { title: 'Lab Manual - Semester 2', date: '01 Dec 2024', size: '5.0 MB' },
  ];

  const videos = [
    { title: 'Understanding ECG Basics', duration: '45 mins', faculty: 'Dr. Rao' },
    { title: 'First Aid Procedures - Practical', duration: '30 mins', faculty: 'Prof. Sarah' },
  ];

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Learning Resources</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button 
            className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'notes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('notes')}
        >
            Notes & PDFs
        </button>
        <button 
            className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'videos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('videos')}
        >
            Video Lectures
        </button>
      </div>

      {/* Content */}
      <div className="grid gap-4">
        {activeTab === 'notes' ? (
            notes.map((note, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border hover:shadow-md flex justify-between items-center transition">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg"><FileText size={24} /></div>
                        <div>
                            <h3 className="font-bold text-gray-800">{note.title}</h3>
                            <p className="text-xs text-gray-500">Uploaded: {note.date} • {note.size}</p>
                        </div>
                    </div>
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><Download size={20} /></button>
                </div>
            ))
        ) : (
            videos.map((vid, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border hover:shadow-md flex justify-between items-center transition">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg"><Video size={24} /></div>
                        <div>
                            <h3 className="font-bold text-gray-800">{vid.title}</h3>
                            <p className="text-xs text-gray-500">Duration: {vid.duration} • By {vid.faculty}</p>
                        </div>
                    </div>
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><PlayCircle size={20} /></button>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default StudentResources;