import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { BrowserRouter } from 'react-router-dom';

// User Routes
import { UserRegister } from "./pages/UserRegister";
import { UserLogin } from "./pages/UserLogin";
import { UserUpdate } from "./pages/UserUpdate";


// Admin Routes
import { AdminLogin } from "./pages/Admin/AdminLogin";
import { DashBoard } from "./pages/Admin/DashBoard";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { userExist, userNotExist } from "./redux/features/userSlice";
import axios from "axios";
import { UserProtectedRoute } from "./components/ProtectedRoutes/UserProtectedRoute";
import { AdminProtectedRoute } from "./components/ProtectedRoutes/AdminProtectedRoute";
import { adminExist, adminNotExist } from "./redux/features/adminSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/verify-token`, {}, { withCredentials: true });
        const user = userResponse.data.data;
        dispatch(userExist(user));

      } catch (error) {
        dispatch(userNotExist());
      }


      try {
        const adminResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/verify-admin-token`, {}, { withCredentials: true });
        const admin = adminResponse.data.data;
        dispatch(adminExist(admin));

      } catch (error) {
        dispatch(adminNotExist());
      }
    }

    checkAuth();
  }, [dispatch])

  return (
    <BrowserRouter future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}>
      <Routes>
        {/* Home Screen */}
        <Route path="/" element={<Home />} />

        {/* User Routes */}
        {/* User Registration and Login */}
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/userlogin" element={<UserLogin />} />

        {/* Protected Routes for securing user update details  */}
        <Route path="/user" element={<UserProtectedRoute />}>
          <Route path="update" element={<UserUpdate />} />
        </Route>

        {/* Admin Routes  */}
        {/* Admin Login  */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* Admin Protected Routes for securing dashboard  */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route path="dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
