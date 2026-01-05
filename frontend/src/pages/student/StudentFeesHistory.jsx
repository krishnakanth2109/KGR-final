import React, { useEffect, useState } from 'react';
import { getStudentFeeDetails } from '../../api/feeApi';
import { Download, History } from 'lucide-react';

const StudentFeesHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const student = JSON.parse(sessionStorage.getItem('student-user'));

  useEffect(() => {
    getStudentFeeDetails(student.id).then(data => {
      // Backend returns transactions array in the Fee record
      setTransactions(data?.transactions?.reverse() || []);
    });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="text-blue-600"/>
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Mode</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((txn) => (
              <tr key={txn._id} className="hover:bg-gray-50">
                <td className="p-4">{new Date(txn.date).toLocaleDateString()}</td>
                <td className="p-4 font-mono text-xs">{txn.transactionId}</td>
                <td className="p-4">{txn.mode}</td>
                <td className="p-4 font-bold text-green-700">₹ {txn.amount.toLocaleString()}</td>
                <td className="p-4">
                   <button className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Download size={16}/></button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">No payment history available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFeesHistory;