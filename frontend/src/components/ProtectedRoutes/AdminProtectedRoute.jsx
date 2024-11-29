import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminProtectedRoute = () => {
     const isAdminLogin = useSelector((state)=> state.adminAuth.isLoggedIn);
     return isAdminLogin ? <Outlet /> : <Navigate to="/" />;

}

