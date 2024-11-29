import React, { useState } from 'react';
import styles from "../../styles/UserLoginStyles.module.css"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminExist } from '../../redux/features/adminSlice';


export const AdminLogin = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();

     const [formData, setFormData] = useState({
          adminName: "",
          password: "",
     });

     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value })
     }

     const handleLoginSubmit = async (e) => {
          e.preventDefault();

          try {
               const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/adminlogin`, formData, { withCredentials: true });

               if (response && response.data) {
                    const user = response.data.data
                    dispatch(adminExist(user));
                    toast.success(response.data.message);
                    navigate('/admin/dashboard');

               } else {
                    toast.success("Login failed. Please try again.");

               }

          } catch (error) {
               if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
               } else {
                    toast.error("An error occurred");
               }
          }

     }

     return (
          <div className={styles.loginContainer}>
               <form onSubmit={handleLoginSubmit}>
                    <h1>Admin Login</h1>
                    <input
                         type='text'
                         name='adminName'
                         id='adminName'
                         placeholder='Enter name'
                         value={formData.adminName}
                         onChange={handleChange}
                         required
                    />
                    <input
                         type='password'
                         name='password'
                         id='password'
                         placeholder='Enter password'
                         value={formData.password}
                         onChange={handleChange}
                         required
                    />
                    <button className={styles.logIn} type='submit'>Login In</button>
               </form>
          </div>
     )
}

