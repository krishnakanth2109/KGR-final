// --- START OF FILE Courses.jsx ---
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaStethoscope, FaMicroscope } from "react-icons/fa";
import { FlaskConical } from "lucide-react";
import api from "../api"; // Imports the dynamic API helper

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Now uses the dynamic base URL from api.js
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getCourseIcon = (slug) => {
    if (slug === 'mlt') {
      return <FaMicroscope className="text-red-500 w-6 h-6" />;
    }
    return <FaStethoscope className="text-magenta-600 w-6 h-6" />;
  };

  if (loading) {
    return <div className="text-center py-20">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magenta-50 via-white to-red-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-extrabold text-red-900 tracking-tight drop-shadow-lg">
            <span className="inline-block align-middle mr-2">
              <FlaskConical className="inline text-magenta-700" size={40} />
            </span>
            Our Courses
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-magenta-600 to-red-600 mx-auto mt-4 rounded-full animate-pulse"></div>
          <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover specialized vocational programs designed to empower
            students with skills for the healthcare and medical fields.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-14">
          {courses.map((course) => (
            <div
              key={course._id}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 animate-fade-in"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white/80 rounded-full p-3 shadow-lg">
                  {getCourseIcon(course.slug)}
                </div>
              </div>

              <div className="p-10 space-y-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-red-900 group-hover:text-magenta-700 transition-colors">
                  {course.title}
                </h2>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {course.description}
                </p>

                <div className="flex items-center text-gray-500 text-sm font-semibold">
                  <FaCalendarAlt className="mr-2 text-magenta-500" />
                  Duration:{" "}
                  <span className="ml-1 text-red-800">{course.duration}</span>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/courses/${course.slug}`}
                    className="block w-full text-center py-3 px-6 bg-gradient-to-r from-magenta-600 to-red-600 text-white font-bold rounded-xl shadow-lg hover:from-red-600 hover:to-magenta-600 transition-all duration-300 hover:scale-105"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;