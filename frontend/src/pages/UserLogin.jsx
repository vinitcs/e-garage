import React, { useState } from 'react';
import styles from "../styles/UserLoginStyles.module.css"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from "axios";
import { userExist } from '../redux/features/userSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const UserLogin = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();

     const [formData, setFormData] = useState({
          email: "",
          password: "",
     });

     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value })
     }

     const handleLoginClick = () => {
          navigate('/userregister');
     };

     const handleClose = () => {
          navigate('/');

     }

     const handleLoginSubmit = async (e) => {
          e.preventDefault();

          try {
               const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/userlogin`, formData, { withCredentials: true });

               if (response && response.data) {
                    const user = response.data.data
                    dispatch(userExist(user));
                    toast.success(response.data.message);
                    navigate('/');

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
                    <h1>Login</h1>
                    <input
                         type='email'
                         name='email'
                         id='email'
                         placeholder='Enter email'
                         value={formData.name}
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
                    <p>Don't have an account, <button className={styles.signUpBtn} onClick={handleLoginClick}>Sign Up</button></p>
                    <p className={styles.close} onClick={handleClose}>Close</p>
               </form>
          </div>
     )
}

