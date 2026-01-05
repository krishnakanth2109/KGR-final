
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaCheckCircle, 
  FaIndustry, 
  FaUserMd, 
  FaBriefcase, 
  FaBuilding, 
  FaComments, 
  FaImages, 
  FaPhoneAlt,
  FaGraduationCap,
  FaHandsHelping,
  FaMicroscope,
  FaStethoscope,
  FaHeartbeat,
  FaBookOpen,
  FaUsers,
  FaAward,
  FaChartLine
} from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const rotateIn = {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      transition: { duration: 0.8 }
    }
  };

  const slideIn = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  // --- Theme: Magenta (Fuchsia) & Red ---
  // Note: Tailwind uses 'fuchsia' for Magenta colors.
  const keyHighlights = [
    { icon: <FaIndustry />, title: "Industry-aligned curriculum", color: "from-fuchsia-600 to-red-600" },
    { icon: <FaUserMd />, title: "Hands-on practical training", color: "from-red-500 to-pink-600" },
    { icon: <FaBriefcase />, title: "Experienced certified faculty", color: "from-pink-600 to-fuchsia-600" },
    { icon: <FaCheckCircle />, title: "Dedicated placement support", color: "from-red-600 to-fuchsia-500" },
    { icon: <FaBuilding />, title: "Modern labs & classrooms", color: "from-fuchsia-700 to-red-700" },
    { icon: <FaAward />, title: "Certified programs", color: "from-red-600 to-pink-700" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      course: "MPHW Graduate",
      text: "The hands-on training and supportive faculty helped me secure a position at a leading hospital immediately after graduation.",
      avatarColor: "bg-gradient-to-r from-fuchsia-600 to-red-600"
    },
    {
      name: "Rahul Verma",
      course: "MLT Student",
      text: "The practical sessions in modern labs gave me the confidence and skills needed for my career in diagnostic centers.",
      avatarColor: "bg-gradient-to-r from-red-600 to-pink-600"
    },
    {
      name: "Anjali Patel",
      course: "Vocational Graduate",
      text: "The placement assistance was exceptional. I received multiple job offers even before completing my course.",
      avatarColor: "bg-gradient-to-r from-pink-600 to-red-700"
    }
  ];

  const facilities = [
    { icon: <FaMicroscope />, title: "Modern Medical Labs", desc: "State-of-the-art diagnostic equipment", bg: "bg-gradient-to-br from-fuchsia-50 to-red-50" },
    { icon: <FaStethoscope />, title: "Clinical Training Centers", desc: "Real-world healthcare simulation", bg: "bg-gradient-to-br from-red-50 to-pink-50" },
    { icon: <FaHeartbeat />, title: "Patient Care Labs", desc: "Comprehensive patient handling training", bg: "bg-gradient-to-br from-pink-50 to-fuchsia-50" },
    { icon: <FaBookOpen />, title: "Digital Library", desc: "Extensive medical resources", bg: "bg-gradient-to-br from-fuchsia-50 to-red-50" },
    { icon: <FaUsers />, title: "Smart Classrooms", desc: "Interactive learning spaces", bg: "bg-gradient-to-br from-red-50 to-pink-50" },
    { icon: <FaGraduationCap />, title: "Career Center", desc: "Placement & counseling services", bg: "bg-gradient-to-br from-pink-50 to-fuchsia-50" }
  ];

  const courses = [
    {
      icon: <FaUserMd />,
      title: "Multi-Purpose Health Worker (MPHW)",
      description: "Comprehensive healthcare training focusing on patient care and medical procedures",
      duration: "2 Years",
      seats: "Limited Seats",
      gradient: "from-fuchsia-600 via-pink-600 to-red-600"
    },
    {
      icon: <FaMicroscope />,
      title: "Medical Laboratory Technology (MLT)",
      description: "Advanced training in diagnostic procedures and lab management",
      duration: "2 Years",
      seats: "Limited Seats",
      gradient: "from-red-600 via-rose-600 to-fuchsia-600"
    }
  ];

  const news = [
    { 
      title: "Admission Open for 2024", 
      date: "March 1, 2024", 
      category: "Admission",
      gradient: "from-fuchsia-500 to-red-500"
    },
    { 
      title: "New Lab Equipment Installation", 
      date: "Feb 28, 2024", 
      category: "Facilities",
      gradient: "from-red-500 to-pink-500"
    },
    { 
      title: "Healthcare Workshop", 
      date: "Feb 25, 2024", 
      category: "Events",
      gradient: "from-pink-500 to-fuchsia-600"
    }
  ];

  const galleryImages = [
    {
      id: 1,
      src: "https://image2url.com/images/1765531014941-3213c232-3f53-4c67-b8b3-1e6cb73c28f9.png", 
      alt: "College Activity Main",
      label: "Community Health Camp"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Laboratory Session",
      label: "Advanced Lab Training"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Classroom Learning",
      label: "Interactive Learning"
    }
  ];

  return (
    // Base Background: Very Light Rose/White
    <div className="min-h-screen bg-[#fffafa] text-stone-800">
      
      {/* 
        ================================================================
        SECTION: HERO (Background Image with Overlay)
        ================================================================
      */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative h-[90vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://image2url.com/images/1765531014941-3213c232-3f53-4c67-b8b3-1e6cb73c28f9.png"
            alt="KGR College Texture Background"
            className="w-full h-full object-cover"
          />
          {/* 
             Overlay Change: Magenta to Red Theme
             Using fuchsia-600 to red-600 gradient mix
          */}
          <div className="absolute inset-0 bg-gradient-to-r 
            from-fuchsia-600/90 
            via-pink-600/80 
            to-red-600/90 
            mix-blend-multiply"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div 
            variants={slideIn}
            className="flex flex-col items-center"
          >
           
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-2xl mb-6">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 via-pink-200 to-red-200">
                KGR College
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-pink-50 max-w-2xl font-medium leading-relaxed mb-10 drop-shadow-md">
              Shaping the future of students who aspire to build careers in healthcare through excellence in vocational education.
            </p>
            
            <motion.div 
              variants={staggerContainer}
              className="flex flex-col sm:flex-row gap-6 justify-center mt-4"
            >
              <motion.div variants={scaleIn}>
                <Link
                  to="/admissions"
                  className="px-10 py-4 bg-white text-red-900 font-black rounded-full shadow-2xl 
                  hover:bg-red-50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] 
                  transform hover:-translate-y-1 text-lg flex items-center gap-2"
                >
                  Apply Now <FaCheckCircle className="text-red-600"/>
                </Link>
              </motion.div>
              <motion.div variants={scaleIn}>
                <Link
                  to="/courses"
                  className="px-10 py-4 border-2 border-red-200 text-white rounded-full font-bold
                  hover:bg-white/10 transition-all duration-300 backdrop-blur-sm
                  hover:scale-110 hover:shadow-2xl transform hover:-translate-y-1 text-lg flex items-center gap-2"
                >
                  Explore Courses <FaAward />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Bottom Curve */}
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#fffafa] to-transparent z-20"></div>
      </motion.section>

      {/* SECTION: HERO QUOTE */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-20 bg-white"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2 
            variants={scaleIn}
            className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-fuchsia-700 to-red-600 bg-clip-text text-transparent"
          >
            "Shaping Skills for a Successful Career"
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-stone-600 max-w-4xl mx-auto font-medium leading-relaxed"
          >
            Gain industry-ready vocational training with practical learning, expert faculty, and strong placement support. 
            Start your career journey with real skills that matter.
          </motion.p>
        </div>
      </motion.section>

      {/* SECTION: ABOUT */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-28 px-6 max-w-7xl mx-auto bg-gradient-to-b from-white to-[#fff0f5]"
      >
        <motion.div variants={fadeInUp} className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-fuchsia-800 to-red-700 bg-clip-text text-transparent">
            About Our College
          </h2>
          <p className="text-xl text-stone-600 leading-relaxed max-w-5xl mx-auto">
            We are a leading vocational training institution focused on delivering skill-based education that prepares 
            students for today's healthcare workforce with modern facilities and practical curriculum.
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div variants={slideIn} className="flex-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-400 to-red-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <img
                src="https://img.freepik.com/free-photo/smiling-doctor-with-stethoscope_23-2147896180.jpg"
                alt="Doctor representing healthcare education"
                className="relative rounded-3xl shadow-2xl border-4 border-white w-full max-w-2xl object-cover"
              />
            </motion.div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="flex-1 space-y-8">
            <h3 className="text-4xl md:text-5xl font-black text-stone-800 mb-6">
              Building Healthcare Professionals
            </h3>
            <p className="text-lg text-stone-600 leading-relaxed">
              KGR Vocational Junior College was founded with the vision of making career-focused education 
              accessible to every student who dreams of entering the healthcare field. We provide a foundation 
              built on skill-based and practical learning, ensuring students are industry-ready upon graduation.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-red-600 text-white font-bold rounded-2xl shadow-xl 
                hover:from-fuchsia-700 hover:to-red-700 transition-all duration-300 hover:shadow-2xl group"
              >
                <span>Learn More</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="group-hover:translate-x-2 transition-transform"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION: COURSES */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-28 bg-[#fffafa]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-red-700 to-fuchsia-700 bg-clip-text text-transparent">
              Job-Oriented Vocational Courses
            </h2>
            <p className="text-xl text-stone-600 max-w-4xl mx-auto">
              Explore our certified vocational programs designed to develop real-world skills with practical 
              sessions, industry exposure, and placement guidance.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                className={`relative group overflow-hidden rounded-3xl bg-white p-1 shadow-xl`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-100 to-red-100 opacity-50"></div>
                <div className="relative rounded-3xl p-10 h-full border border-pink-100">
                  <div className="flex items-start justify-between mb-8">
                    <div className="text-5xl bg-gradient-to-r from-fuchsia-600 to-red-600 bg-clip-text text-transparent">
                      {course.icon}
                    </div>
                    <div className="flex gap-3">
                      <span className="px-4 py-2 bg-fuchsia-50 rounded-full text-sm font-semibold text-fuchsia-700 border border-fuchsia-200">
                        {course.duration}
                      </span>
                      <span className="px-4 py-2 bg-red-50 rounded-full text-sm font-semibold text-red-700 border border-red-200">
                        {course.seats}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-stone-800 mb-4 group-hover:text-fuchsia-700 transition-all">
                    {course.title}
                  </h3>
                  <p className="text-stone-600 mb-8">
                    {course.description}
                  </p>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-red-600 rounded-xl 
                      text-white font-semibold hover:from-fuchsia-700 hover:to-red-700 transition-all duration-300"
                    >
                      <span>Course Details</span>
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="text-lg"
                      >
                        ↻
                      </motion.span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION: HIGHLIGHTS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-28 bg-gradient-to-br from-fuchsia-50 via-white to-red-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-red-700 to-fuchsia-700 bg-clip-text text-transparent">
              Why Choose Our College?
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Our goal is to help students gain strong technical and professional skills for immediate employment.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyHighlights.map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-200 to-red-200 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-pink-100 shadow-lg">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-2xl text-white">{item.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 mb-3">{item.title}</h3>
                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-fuchsia-400 to-red-400 transition-all duration-500 rounded-full mb-4"></div>
                  <p className="text-stone-600 text-sm">
                    Comprehensive support and training for career success
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION: PLACEMENT */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-28 bg-[#fdf2f8]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={slideIn} className="space-y-10">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-700 to-fuchsia-800 bg-clip-text text-transparent">
                Building Your Professional Future
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                We offer dedicated placement assistance, career counseling, resume preparation, and interview training. 
                Our students have been placed in reputable healthcare institutions with strong career growth opportunities.
              </p>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-8 border border-pink-200 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                  <FaChartLine className="text-red-600" />
                  Placement Success
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-black text-red-600">95%</div>
                  <div className="text-stone-600">
                    of our graduates secure employment within 3 months of completing their vocational training
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div variants={scaleIn} className="relative">
              <div className="absolute -ins-4 bg-gradient-to-r from-red-200 to-fuchsia-200 rounded-3xl blur-2xl opacity-40"></div>
              <div className="relative bg-white rounded-3xl p-10 border border-pink-200 shadow-xl">
                <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-red-700 to-fuchsia-700 bg-clip-text text-transparent">
                  Career Support Services
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {['Personalized Counseling', 'Resume Building', 'Mock Interviews', 
                    'Networking Events', 'Job Placement', 'Growth Workshops'].map((service, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="bg-red-50 rounded-xl p-6 border border-pink-200 
                      hover:border-fuchsia-400 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="text-2xl text-red-600 mb-3 group-hover:scale-110 transition-transform">
                        <FaCheckCircle />
                      </div>
                      <h4 className="text-stone-800 font-semibold">{service}</h4>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SECTION: FACILITIES */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-28 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-fuchsia-700 to-red-600 bg-clip-text text-transparent">
              Campus Facilities
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Designed for practical learning and skill development in healthcare education
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
                transition={{ rotate: { duration: 0.5 } }}
                className={`${facility.bg} rounded-2xl p-8 border border-pink-100 
                shadow-lg hover:shadow-2xl transition-all duration-500 group`}
              >
                <div className="relative mb-6">
                  <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-200 to-red-200 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative text-4xl bg-gradient-to-r from-fuchsia-600 to-red-600 bg-clip-text text-transparent">
                    {facility.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-3 group-hover:text-fuchsia-700 transition-all">
                  {facility.title}
                </h3>
                <p className="text-stone-600">{facility.desc}</p>
                <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-fuchsia-400 to-red-400 transition-all duration-500 rounded-full mt-6"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION: TESTIMONIALS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-28 bg-[#fffafa]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-red-700 to-fuchsia-800 bg-clip-text text-transparent">
              What Our Students Say
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Experience of learning, growth, and career development from our successful graduates
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  y: { 
                    repeat: Infinity, 
                    duration: 3 + idx, 
                    ease: "easeInOut" 
                  } 
                }}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-200 to-red-300 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white rounded-3xl p-10 border border-pink-200 shadow-xl">
                  <div className="flex items-center mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`${testimonial.avatarColor} w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mr-6 shadow-lg`}
                    >
                      {testimonial.name.charAt(0)}
                    </motion.div>
                    <div>
                      <h4 className="text-2xl font-bold text-stone-800">{testimonial.name}</h4>
                      <p className="text-fuchsia-700 font-medium">{testimonial.course}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="text-6xl text-stone-200 absolute -top-8 -left-4">"</div>
                    <p className="text-lg text-stone-600 italic relative z-10">"{testimonial.text}"</p>
                    <div className="text-6xl text-stone-200 absolute -bottom-12 -right-4">"</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION: NEWS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-28 bg-white"
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-fuchsia-700 to-red-700 bg-clip-text text-transparent flex items-center justify-center gap-4">
              <FaComments className="text-red-600" />
              Latest Updates & Notifications
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Stay informed with important announcements, admission updates, and campus events
            </p>
          </motion.div>
          
          <div className="space-y-8">
            {news.map((item, idx) => (
              <motion.div
                key={idx}
                variants={slideIn}
                whileHover={{ x: 10 }}
                className="relative pl-12 group cursor-pointer"
              >
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-fuchsia-400 to-red-400 rounded-full"></div>
                
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r ${item.gradient} shadow-lg 
                  group-hover:scale-150 transition-transform duration-300`}></div>
                
                <div className="bg-stone-50 backdrop-blur-sm rounded-2xl p-8 border border-pink-200 
                  hover:border-fuchsia-300 transition-all duration-500 shadow-lg hover:shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-stone-800 group-hover:text-fuchsia-700 transition-all">
                      {item.title}
                    </h3>
                    <span className={`px-4 py-2 bg-gradient-to-r ${item.gradient} rounded-full text-sm font-semibold text-white 
                      whitespace-nowrap group-hover:scale-110 transition-transform`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500">
                    <span className="text-lg">📅</span>
                    <span className="font-medium">{item.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION: GALLERY */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-28 bg-[#1c1917]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-red-200 to-fuchsia-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
              <FaImages className="text-fuchsia-300" />
              Campus Life & Activities
            </h2>
            <p className="text-xl text-stone-400 max-w-3xl mx-auto">
              Explore moments from our vibrant learning environment and skill-focused atmosphere
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {galleryImages.map((item) => (
              <motion.div
                key={item.id}
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <h4 className="text-white font-semibold">{item.label}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION: CONTACT CTA */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scaleIn}
        className="py-28 relative overflow-hidden"
      >
        {/* Animated background: Magenta to Red Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-red-600">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.2),transparent_50%)]"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.h2 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black mb-10 text-white drop-shadow-md"
          >
            Get in Touch
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-2xl text-pink-50 mb-16 max-w-3xl mx-auto leading-relaxed"
          >
            Have questions about admissions, courses, or campus details? Reach out to us anytime.
            Our team is here to guide you through every step of your vocational journey.
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-red-900 font-black rounded-3xl shadow-2xl hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] 
              transition-all duration-500 text-2xl group relative overflow-hidden"
            >
              <span className="relative z-10">Contact Us Today</span>
              <motion.span 
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="relative z-10 text-3xl"
              >
                ✆
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;