import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Admissions", path: "/admissions" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="logo.png"
            alt="KGR Logo"
            className="h-12 w-12 object-contain"
          />
          <span className="font-bold text-xl text-red-800 tracking-wide">
            KGR Vocational Junior College
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-gray-700 font-medium hover:text-blue-600 transition ${
                  isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="ml-4 px-5 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="flex flex-col space-y-4 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block text-gray-700 font-medium hover:text-blue-600 transition ${
                    isActive ? "text-blue-600" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2 text-center bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
