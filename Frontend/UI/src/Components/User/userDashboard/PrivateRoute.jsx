import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // prevent redirect until AuthContext finishes restoring
    return <div className="text-white p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/LoginModal" replace />;
  }

  return children;
};

export default PrivateRoute;
