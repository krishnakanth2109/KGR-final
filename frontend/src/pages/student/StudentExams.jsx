import React, { useEffect, useState } from 'react';
import { getStudentExams } from '../../api/adminStudentExtras';
import { Calendar, CheckCircle, Loader2 } from 'lucide-react';

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const student = JSON.parse(sessionStorage.getItem('student-user'));

  useEffect(() => {
    if(student?.id) {
        getStudentExams(student.id).then(data => {
            setExams(data);
            setLoading(false);
        });
    }
  }, []);

  if(loading) return <div className="p-10"><Loader2 className="animate-spin"/></div>;

  const upcoming = exams.filter(e => new Date(e.examDate) >= new Date());
  const past = exams.filter(e => new Date(e.examDate) < new Date());

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Exam Portal</h1>

      {/* Upcoming */}
      <section>
        <h2 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2"><Calendar/> Upcoming Exams</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.length === 0 ? <p className="text-gray-400">No upcoming exams.</p> : upcoming.map(e => (
                <div key={e._id} className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                    <h3 className="font-bold text-lg">{e.subject}</h3>
                    <p className="text-gray-500 text-sm mt-1">{new Date(e.examDate).toLocaleDateString()} • {e.startTime}</p>
                    <div className="mt-3 flex gap-2 text-xs font-semibold">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Room: {e.roomNo}</span>
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">{e.examType}</span>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Results */}
      <section>
        <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2"><CheckCircle/> Results & History</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 border-b">
                     <tr>
                         <th className="p-3">Subject</th>
                         <th className="p-3">Date</th>
                         <th className="p-3">Marks</th>
                         <th className="p-3">Status</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y">
                     {past.map(e => (
                         <tr key={e._id}>
                             <td className="p-3 font-medium">{e.subject}</td>
                             <td className="p-3">{new Date(e.examDate).toLocaleDateString()}</td>
                             <td className="p-3 font-bold">{e.isPublished ? `${e.marksObtained || '-'} / ${e.maxMarks}` : 'Pending'}</td>
                             <td className="p-3">
                                 {e.isPublished 
                                    ? <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">Declared</span> 
                                    : <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded text-xs">Awaiting</span>}
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
        </div>
      </section>
    </div>
  );
};

export default StudentExams;