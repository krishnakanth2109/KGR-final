import React from 'react';
import { CalendarClock, MapPin, Clock } from 'lucide-react';

const StudentTimetable = () => {
  // Mock Data based on notes
  const schedule = [
    { time: '09:00 AM - 10:00 AM', subject: 'Anatomy & Physiology', type: 'Lecture', room: 'Hall A' },
    { time: '10:15 AM - 11:15 AM', subject: 'Microbiology', type: 'Lecture', room: 'Hall B' },
    { time: '11:30 AM - 12:30 PM', subject: 'Community Health', type: 'Lab', room: 'Lab 2' },
    { time: '01:30 PM - 02:30 PM', subject: 'First Aid', type: 'Practical', room: 'Ground' },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <h1 className="text-2xl font-bold text-gray-800">Time Table & Schedule</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="md:col-span-2 space-y-4">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
                <CalendarClock className="text-amber-500" /> Today's Classes
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {schedule.map((item, index) => (
                    <div key={index} className="p-4 border-b last:border-0 hover:bg-gray-50 transition flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 text-blue-600 font-bold p-3 rounded-lg text-xs text-center w-24">
                                {item.time.split('-')[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{item.subject}</h3>
                                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {item.room}</span>
                                    <span className="bg-gray-100 px-2 rounded">{item.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Upcoming & Exams */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold mb-2 text-lg">Next Exam</h3>
                <div className="text-3xl font-bold mb-1">15 DEC</div>
                <p className="opacity-90">Bio-Chemistry Finals</p>
                <div className="mt-4 flex items-center gap-2 text-sm bg-white/20 p-2 rounded-lg">
                    <Clock size={16} /> 10:00 AM - 01:00 PM
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-3">Upcoming Events</h3>
                <ul className="space-y-3 text-sm">
                    <li className="flex gap-3">
                        <div className="bg-orange-100 text-orange-600 font-bold px-2 py-1 rounded text-xs h-fit">20 Dec</div>
                        <div>
                            <p className="font-semibold text-gray-800">Guest Lecture</p>
                            <p className="text-xs text-gray-500">Dr. Smith on Public Health</p>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <div className="bg-green-100 text-green-600 font-bold px-2 py-1 rounded text-xs h-fit">24 Dec</div>
                        <div>
                            <p className="font-semibold text-gray-800">Winter Break</p>
                            <p className="text-xs text-gray-500">College closed till 2nd Jan</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;