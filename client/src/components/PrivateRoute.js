import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, requiredRole }) => {
  const token = localStorage.getItem('token'); // Replace this with your actual authentication logic
  const userRole = localStorage.getItem('role'); // Replace this with your actual role checking logic

  console.log("Token:", token);
  console.log("User Role:", userRole);

  if (!token) {
    console.log("No token found, redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    console.log("User role does not match required role, redirecting to home.");
    return <Navigate to="/" />;
  }

  console.log("Rendering element for user with role:", userRole);
  return <Element />;
};

export default PrivateRoute;
