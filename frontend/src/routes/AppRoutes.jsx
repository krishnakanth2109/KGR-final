// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound";

// Public pages
import Home from "../pages/Home";
import About from "../pages/About";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import Admissions from "../pages/Admissions";
import Contact from "../pages/Contact";
import Gallery from "../pages/Gallery";
import LoginOptions from "../pages/login/LoginOptions";
import ForgotPassword from '../components/ForgotPassword';

// Auth
import AdminLogin from "../pages/login/AdminLogin";
const StudentLogin = lazy(() => import("../pages/student/StudentLogin"));

// Admin Layout & Dashboard
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));

// Admin Features
const CoursesAdmin = lazy(() => import("../pages/admin/CoursesAdmin"));
const GalleryAdmin = lazy(() => import("../pages/admin/GalleryAdmin"));
const StudentsPage = lazy(() => import("../pages/admin/Students"));
const AdminDocumentManager = lazy(() => import("../pages/admin/AdminDocumentManager"));
const AdminExamManager = lazy(() => import("../pages/admin/AdminExamManager"));
const ContactMessages = lazy(() => import("../pages/admin/ContactMessages"));
// NEW IMPORT FOR ADMISSIONS
const AdminAdmissions = lazy(() => import("../pages/admin/AdminAdmissions"));

// Admin Fee Management
const FeeDashboard = lazy(() => import("../pages/admin/fees/FeeDashboard"));
const FeeStructure = lazy(() => import("../pages/admin/fees/FeeStructure"));

// UPDATED IMPORT NAME
const StudentFeeGenerator = lazy(() => import("../pages/admin/fees/StudentFeeGenerator"));

const PendingDues = lazy(() => import("../pages/admin/fees/PendingDues"));
const FeeReports = lazy(() => import("../pages/admin/fees/FeeReports"));

// Old Admin Fee Manager (Legacy)
const AdminFeeManager = lazy(() => import("../pages/admin/AdminFeeManager"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));
// Student Specific Admin Views
const StudentFeeManager = lazy(() => import("../pages/admin/StudentFeeManager"));
const StudentAcademicManager = lazy(() => import("../pages/admin/StudentAcademicManager"));
const StudentFormPage = lazy(() => import("../features/students/StudentFormPage"));
const StudentProfilePage = lazy(() => import("../features/students/StudentProfilePage"));

// Faculty
const FacultyPage = lazy(() => import("../features/faculty/FacultyPage"));
const FacultyFormPage = lazy(() => import("../features/faculty/FacultyFormPage"));
const FacultyProfilePage = lazy(() => import("../features/faculty/FacultyProfilePage"));

// Student Portal Pages
const StudentLayout = lazy(() => import("../layouts/StudentLayout"));
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
const StudentFeesPay = lazy(() => import("../pages/student/StudentFeesPay"));
const StudentFeesHistory = lazy(() => import("../pages/student/StudentFeesHistory"));
const StudentExams = lazy(() => import("../pages/student/StudentExams"));
const StudentDocuments = lazy(() => import("../pages/student/StudentDocuments"));
const StudentTimetable = lazy(() => import("../pages/student/StudentTimetable"));
const StudentResources = lazy(() => import("../pages/student/StudentResources"));
const StudentNotifications = lazy(() => import("../pages/student/StudentNotifications"));
const StudentProfile = lazy(() => import("../pages/student/StudentProfile"));

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<LoginOptions />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* LOGIN ROUTES */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* General */}
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* NEW ADMISSIONS ROUTE */}
          <Route path="admissions" element={<AdminAdmissions />} />
          
          {/* Fee Management System */}
          <Route path="fees/dashboard" element={<FeeDashboard />} />
          <Route path="fees/structure" element={<FeeStructure />} />
               <Route path="settings" element={<AdminSettings />} />
          {/* UPDATED ROUTE PATH */}
          <Route path="fees/generator" element={<StudentFeeGenerator />} />
          
          <Route path="fees/dues" element={<PendingDues />} />
          <Route path="fees/reports" element={<FeeReports />} />
          
          {/* Legacy Fee Route */}
          <Route path="fees" element={<AdminFeeManager />} />

          {/* Academics & Content */}
          <Route path="courses" element={<CoursesAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="documents" element={<AdminDocumentManager />} />
          <Route path="exams" element={<AdminExamManager />} />
          <Route path="contact-messages" element={<ContactMessages />} />

          {/* Student Management */}
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/new" element={<StudentFormPage />} />
          <Route path="students/edit/:id" element={<StudentFormPage />} />
          <Route path="students/view/:id" element={<StudentProfilePage />} />
          
          {/* Specific Student Actions */}
          <Route path="students/fees/:id" element={<StudentFeeManager />} />
          <Route path="students/academic/:id" element={<StudentAcademicManager />} />

          {/* Faculty Management */}
          <Route path="faculty" element={<FacultyPage />} />
          <Route path="faculty/new" element={<FacultyFormPage />} />
          <Route path="faculty/edit/:id" element={<FacultyFormPage />} />
          <Route path="faculty/view/:id" element={<FacultyProfilePage />} />
        </Route>

        {/* STUDENT PORTAL ROUTES */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          
          <Route path="fees">
            <Route index element={<Navigate to="pay" replace />} />
            <Route path="pay" element={<StudentFeesPay />} />
            <Route path="history" element={<StudentFeesHistory />} />
          </Route>

          <Route path="exams" element={<StudentExams />} />
          <Route path="documents" element={<StudentDocuments />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="resources" element={<StudentResources />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;