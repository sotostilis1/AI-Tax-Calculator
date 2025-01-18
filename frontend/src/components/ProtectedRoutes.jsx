import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = ({ user }) => {
  // If user is null or undefined, redirect to the login page
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
