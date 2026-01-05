// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes"; // ✅ Handles all routing logic

// Create a QueryClient instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* 
          Navbar and Footer are removed from here. 
          They are now handled inside AppRoutes.jsx using a Layout wrapper.
          This prevents the public Navbar from showing up on the Admin/Student Dashboards.
        */}
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
};

export default App;