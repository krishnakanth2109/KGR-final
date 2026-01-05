import React, { useState, useEffect } from "react";
import { 
  Award, 
  HeartHandshake, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Users, 
  Monitor, 
  Briefcase, 
  TrendingUp, 
  CheckCircle,
  Target,
  GraduationCap,
  Shield,
  Sparkles,
  Zap,
  Star,
  Rocket
} from "lucide-react";

const AboutUs = () => {
  const [showValues, setShowValues] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Trigger animations on load
  useEffect(() => {
    setIsVisible(true);
    // Auto rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Features data - Updated Colors to Magenta -> Red spectrum
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Vision",
      description: "To develop skilled professionals who are confident, competent, and ready to meet industry demands.",
      color: "from-fuchsia-600 to-pink-600",
      bgColor: "bg-fuchsia-50",
      borderColor: "border-fuchsia-200"
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Our Mission",
      description: "To offer quality vocational education that combines practical skills, professional knowledge, and career development.",
      color: "from-pink-600 to-rose-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "What We Offer",
      description: "Industry-oriented courses, hands-on training, experienced faculty, and career guidance to support student success.",
      color: "from-rose-600 to-red-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Our Teaching Approach",
      description: "We follow a practical learning approach with workshops, labs, and real-time projects to enhance student skills.",
      color: "from-red-600 to-orange-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Experienced Faculty",
      description: "Our faculty consists of trained professionals who guide students with practical knowledge and industry insights.",
      color: "from-orange-600 to-amber-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Our Commitment",
      description: "We are committed to providing quality education, continuous improvement, and student-focused learning.",
      color: "from-amber-600 to-yellow-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    }
  ];

  // Custom CSS for advanced animations and gradients
  const customStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.3); }
      50% { box-shadow: 0 0 40px rgba(192, 38, 211, 0.6); }
    }
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    .animate-slide-in {
      animation: slideIn 0.6s ease-out forwards;
    }
    .animate-gradient-shift {
      background-size: 200% 200%;
      animation: gradient-shift 3s ease infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
    .image-hover-zoom {
      overflow: hidden;
    }
    .image-hover-zoom img {
      transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .image-hover-zoom:hover img {
      transform: scale(1.12);
    }
    /* Updated Text Gradient: Fuchsia to Red */
    .text-gradient {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(to right, #c026d3, #dc2626); 
    }
    .feature-card-hover {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .feature-card-hover:hover {
      transform: translateY(-10px) scale(1.02);
    }
    .glass-effect {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .text-shadow-glow {
      text-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
    }
  `;

  return (
    // Updated background gradient
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 via-white to-red-50 font-sans overflow-hidden selection:bg-red-200 selection:text-red-900">
      <style>{customStyles}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
            alt="Vocational College Campus"
            className="w-full h-full object-cover"
          />
          {/* Magenta to Red Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-900/95 via-rose-900/90 to-red-900/80"></div>
        </div>
        
        <div className={`relative z-10 text-center px-4 max-w-5xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 border border-red-400/30 rounded-full bg-fuchsia-900/30 backdrop-blur-md animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-red-300" />
            <span className="text-red-100 text-sm font-semibold tracking-wider uppercase">Excellence in Vocational Training</span>
            <Sparkles className="w-5 h-5 text-red-300" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight text-shadow-glow">
            Building Careers.<br />
            {/* Gradient Text: Fuchsia to Red */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-pink-300 to-red-300 animate-gradient-shift">
              Empowering Futures.
            </span>
          </h1>
          <p className="text-xl text-red-100 font-light max-w-2xl mx-auto leading-relaxed">
            Practical, skill-based education designed for the modern world. We turn ambition into ability.
          </p>
        </div>
        
        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16 md:h-24 text-fuchsia-50/30" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
          </svg>
        </div>
      </section>

      {/* --- FEATURES GRID SECTION --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Animated Background Elements - Magenta/Red spectrum */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-fuchsia-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-rose-300 to-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              <Star className="w-6 h-6 text-fuchsia-600 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-gradient">Core Pillars</span> of Excellence
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover what makes us the preferred choice for vocational education and career development
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 feature-card-hover ${feature.bgColor} border ${feature.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 ${
                  activeFeature === index ? 'ring-4 ring-opacity-50 ring-red-400 scale-[1.03]' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                {/* Corner Accents */}
                <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-3xl`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 transform rotate-45 -translate-y-1/2 translate-x-1/2`}></div>
                </div>
                
                {/* Icon Container */}
                <div className={`mb-6 w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                
                {/* Hover Indicator */}
                <div className={`absolute bottom-6 left-8 right-8 h-1 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 transition-transform duration-500 ${
                  activeFeature === index ? 'scale-x-100' : 'group-hover:scale-x-100'
                }`}></div>
                
                {/* Animated Badge for Active Card */}
                {activeFeature === index && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-fuchsia-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        Active
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Feature Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeFeature === index 
                    ? 'bg-gradient-to-r from-fuchsia-600 to-red-600 w-12' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT OVERVIEW --- */}
      <section className="py-24 px-6 md:px-20 container mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-2 mb-6">
              <span className="h-0.5 w-12 bg-gradient-to-r from-fuchsia-600 to-red-600 rounded"></span>
              <span className="text-fuchsia-700 font-bold uppercase tracking-wider text-sm">About Our College</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
              Bridging the Gap Between <span className="text-gradient">Education</span> & <span className="text-gradient">Employment</span>
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
              Our vocational college focuses on practical, skill-based education that prepares students for immediate employment. We combine hands-on training, industry-relevant curriculum, and guided learning to help students build strong foundations for their careers.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              With a commitment to quality, innovation, and hands-on learning, we prepare students to meet the demands of modern industries seamlessly.
            </p>
          </div>
          
          <div className="relative image-hover-zoom rounded-[2rem] shadow-2xl shadow-red-900/20 transform -rotate-2 hover:rotate-0 transition duration-500 border-8 border-white bg-white">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
              alt="Students in a workshop"
              className="w-full h-full object-cover rounded-[1.5rem]"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl shadow-red-900/10 animate-float hidden md:block border border-red-100">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-fuchsia-600 to-red-600 p-4 rounded-full text-white shadow-lg shadow-fuchsia-600/30">
                  <Award size={28} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">25+</p>
                  <p className="text-sm text-red-800 font-semibold">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INFRASTRUCTURE & PLACEMENT SECTION --- */}
      <section className="py-24 px-6 bg-gradient-to-br from-white to-red-50">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Facilities & <span className="text-gradient">Career Support</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              State-of-the-art infrastructure combined with comprehensive career guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Infrastructure Card */}
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-rose-600 opacity-90 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                alt="Modern Infrastructure"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="relative z-20 p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Monitor className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Infrastructure & Facilities</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                  Modern classrooms, well-equipped labs, and a supportive learning environment for effective education.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {['Digital Classrooms', 'Advanced Labs', 'Library', 'Workshops'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Placement Card */}
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600 to-red-600 opacity-90 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="Career Support"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="relative z-20 p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Career & Placement Support</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                  We assist students with career guidance, skill development, and placement support to help them achieve employment opportunities.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {['Career Counseling', 'Resume Building', 'Interview Prep', 'Company Tie-ups'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US (CTA) --- */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Animated Background - Fuchsia/Red spectrum */}
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50 via-rose-50 to-red-50"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-16 h-16 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full animate-float opacity-20"></div>
        <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-gradient-to-r from-rose-400 to-red-400 rounded-full animate-float animation-delay-2000 opacity-20"></div>
        <div className="absolute top-3/4 left-1/4 w-20 h-20 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-float animation-delay-4000 opacity-20"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-8">
              <div className="bg-gradient-to-r from-fuchsia-600 to-red-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-2xl animate-pulse-glow">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6" />
                  Why Choose Our College?
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Your Pathway to <span className="text-gradient">Professional Success</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-12 leading-relaxed max-w-3xl mx-auto">
              We are committed to quality, practical training, industry relevance, and student success. With accessible education, strong support systems, and a career-focused approach, we help students build solid professional futures.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {[
                { value: "98%", label: "Placement Rate" },
                { value: "25+", label: "Years Experience" },
                { value: "5000+", label: "Students Trained" },
                { value: "100+", label: "Industry Partners" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-fuchsia-600 to-red-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <button className="group relative px-12 py-4 bg-gradient-to-r from-fuchsia-600 to-red-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  Start Your Journey
                  <Rocket className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;