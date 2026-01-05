import React, { useState, useRef, useEffect } from "react";
import api from "../api/api"; // Importing your configured Axios instance
import {
  FaFileAlt,
  FaPhoneAlt,
  FaCheckCircle,
  FaUniversity,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaFlask,
  FaPaperPlane
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Simplified Steps Data
const steps = [
  {
    id: 1,
    title: "Fill Details",
    description: "Provide your basic contact information so we can reach you.",
    icon: <FaFileAlt className="text-white text-3xl" />,
    color: "bg-pink-600",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: 2,
    title: "Counseling",
    description: "Our experts will contact you to guide you through course selection.",
    icon: <FaPhoneAlt className="text-white text-3xl" />,
    color: "bg-rose-600",
    gradient: "from-rose-500 to-red-600",
  },
  {
    id: 3,
    title: "Admission",
    description: "Finalize your paperwork and join our campus.",
    icon: <FaCheckCircle className="text-white text-3xl" />,
    color: "bg-red-700",
    gradient: "from-red-600 to-pink-700",
  },
];

// Features Content
const features = [
  {
    icon: <FaUniversity className="text-4xl text-pink-600" />,
    title: "State-of-the-Art Campus",
    desc: "Experience learning in a modern environment.",
  },
  {
    icon: <FaChalkboardTeacher className="text-4xl text-rose-600" />,
    title: "Expert Faculty",
    desc: "Learn from industry experts dedicated to your success.",
  },
  {
    icon: <FaUserGraduate className="text-4xl text-red-600" />,
    title: "Career Guidance",
    desc: "Dedicated placement cell providing career counseling.",
  },
  {
    icon: <FaFlask className="text-4xl text-pink-700" />,
    title: "Practical Training",
    desc: "Hands-on training in our fully equipped labs.",
  },
];

const Admissions = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  // Accessibility: trap focus in modal
  useEffect(() => {
    if (showModal) {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setShowModal(false);
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showModal]);

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    let newErrors = {};

    // 1. Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name should contain only alphabets.";
    }

    // 2. Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // 3. Phone Validation (Exactly 10 digits)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for the modified field
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      const res = await api.post("/admissions", payload);

      if (res.status === 200 || res.status === 201) {
        alert("Details submitted successfully! We will contact you soon.");
        setShowModal(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      alert("Error: " + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 font-sans text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-pink-900 via-rose-800 to-red-900 text-white py-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-pink-800/50 border border-pink-400/30 text-pink-100 text-sm font-semibold tracking-wider mb-6">
              ADMISSIONS OPEN FOR 2025-26
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-md">
              Start Your <br />
              <span className="text-pink-200">Journey Today</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-pink-50 max-w-3xl mx-auto leading-relaxed">
              Join <span className="font-semibold text-white">KGR Vocational Junior College</span>. Fill out the form below and let us guide you toward a successful career.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="px-10 py-4 bg-white text-rose-900 font-bold rounded-full shadow-xl hover:bg-pink-50 hover:scale-105 transition-all duration-300"
              >
                Enquire Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-pink-600 font-bold tracking-wide uppercase text-sm mb-2">Why Choose KGR?</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Empowering Students, Building Careers</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-6 bg-rose-50 rounded-2xl border border-rose-100 hover:shadow-xl hover:border-pink-200 transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-700 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gradient-to-b from-rose-50 to-white py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple Admission Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get started in three easy steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-pink-200 via-rose-300 to-red-200 -z-0"></div>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className={`w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-lg shadow-pink-200 mb-6 transform hover:scale-110 transition-transform duration-300 border-4 border-white`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed px-4">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-rose-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-gradient-to-r from-pink-600 to-rose-700 p-6 text-white relative">
                <h2 className="text-2xl font-bold">Quick Enquiry</h2>
                <p className="text-pink-100 text-sm">Fill in your details and we will call you back.</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-8">
                <form className="space-y-5" autoComplete="off" onSubmit={handleSubmit}>
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                      placeholder="Enter your name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl shadow-lg hover:bg-pink-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Sending..." : "Submit Enquiry"} 
                      {!isSubmitting && <FaPaperPlane />}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admissions;