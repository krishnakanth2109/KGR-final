// --- START OF FILE src/layouts/StudentLayout.jsx ---
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';

const StudentLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Basic protection: check if token exists
    const token = sessionStorage.getItem('student-token');
    if (!token) {
      navigate('/student/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;