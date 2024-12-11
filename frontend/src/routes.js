import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PartnerDashboard from "./pages/Partner/PartnerDashboard";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  return user?.role === role ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/partner"
        element={
          <ProtectedRoute role="partner">
            <PartnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
