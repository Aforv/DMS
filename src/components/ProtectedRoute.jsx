// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
//   const { user } = useAuth();

//   if (!user) {
//     // Not logged in, redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   if (roles && !roles.includes(user.role)) {
//     // User role not authorized
//     return <Navigate to="/" replace />;
//   }

 const { token } = useAuth();

  if (!token) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}
