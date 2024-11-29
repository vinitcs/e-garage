import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export const UserProtectedRoute = () => {
     const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);
     return isLoggedIn ? <Outlet /> : <Navigate to="/adminlogin" />;

}

