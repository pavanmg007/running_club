// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        // Redirect to login if not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to home if user doesn't have the required role
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
