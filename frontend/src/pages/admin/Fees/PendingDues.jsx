import React, { useEffect, useState } from 'react';
import { getFeeDefaulters } from '../../../api/feeApi';
import { AlertTriangle, Phone, Mail } from 'lucide-react';

const PendingDues = () => {
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeeDefaulters().then(data => {
      setDefaulters(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pending Dues Report</h2>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
           {defaulters.length} Students Pending
        </span>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Program</th>
              <th className="p-4">Total Fee</th>
              <th className="p-4">Paid</th>
              <th className="p-4 text-red-600">Balance Due</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {defaulters.map((d) => (
              <tr key={d._id} className="hover:bg-red-50/30">
                <td className="p-4">
                  <p className="font-bold text-gray-800">{d.student?.first_name} {d.student?.last_name}</p>
                  <p className="text-xs text-gray-500">{d.student?.admission_number}</p>
                </td>
                <td className="p-4">{d.student?.program}</td>
                <td className="p-4">₹ {(d.totalPayable - d.discount).toLocaleString()}</td>
                <td className="p-4 text-green-600">₹ {d.totalPaid.toLocaleString()}</td>
                <td className="p-4 font-bold text-red-600">₹ {d.dueAmount.toLocaleString()}</td>
                <td className="p-4 flex gap-2">
                  <a href={`tel:${d.student?.phone_number}`} className="p-2 bg-gray-100 rounded hover:bg-gray-200" title="Call">
                    <Phone size={16}/>
                  </a>
                  <a href={`mailto:${d.student?.email}`} className="p-2 bg-gray-100 rounded hover:bg-gray-200" title="Email">
                    <Mail size={16}/>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && defaulters.length === 0 && <div className="p-6 text-center text-gray-500">No pending dues!</div>}
      </div>
    </div>
  );
};

export default PendingDues;