// --- START OF FILE CourseDetail.jsx ---
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaGraduationCap, FaUserMd, FaCheckCircle } from "react-icons/fa";
import api from "../api"; // Imports the dynamic API helper

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading course details...</p>;
  }

  if (!course) {
    return (
      <p className="text-center text-gray-600 mt-10 text-lg font-medium">
        Course not found
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
        {/* Header Image */}
        <div className="relative h-80">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          <div className="absolute top-6 left-6">
            <Link
              to="/courses"
              className="flex items-center bg-white/90 text-blue-900 px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-white hover:scale-105 transition"
            >
              <FaArrowLeft className="mr-2" /> Back to Courses
            </Link>
          </div>

          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              About the Course
            </h2>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Course Highlights
            </h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              {course.highlights.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start bg-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <FaCheckCircle className="text-blue-600 mt-1 mr-3" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-bold text-indigo-700 mb-2 flex items-center">
                <FaGraduationCap className="mr-2 text-indigo-600" /> Duration & Format
              </h2>
              <p className="text-gray-700">{course.duration}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-bold text-indigo-700 mb-2 flex items-center">
                <FaUserMd className="mr-2 text-green-600" /> Eligibility
              </h2>
              <p className="text-gray-700">{course.eligibility}</p>
            </div>
          </section>

          <section className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">
              Career Opportunities
            </h2>
            <p className="text-gray-700">{course.careerIntro}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;