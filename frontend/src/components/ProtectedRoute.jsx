// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // FIX: Check sessionStorage first, as that is where AdminLogin saves the token.
  const token = sessionStorage.getItem("admin-token") || localStorage.getItem("admin-token");
  const location = useLocation();

  if (!token) {
    // If there is no token, redirect to the admin login page.
    return <Navigate to="/login/admin" state={{ from: location }} replace />;
  }

  // If the token exists, render the component.
  return children;
};

export default ProtectedRoute;