import React, { useEffect, useState } from 'react';
import styles from "../styles/UserRegisterStyles.module.css"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export const UserUpdate = () => {
     const navigate = useNavigate();
     // const { id } = useParams();
     const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);
     const [userData, setUserData] = useState(null);

console.log("update ", userData);

     
     useEffect(() => {
          if (isLoggedIn) {

               // Fetch the current student data
               axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/loggeduser`, { withCredentials: true })
                    .then((response) => {
                         const data = response.data.data.user;
                         setUserData(data);
                         setFormData({
                              name: data.name || '',
                              email: data.email || '',
                              phone: data.phone || '',
                              vehicle: data.vehicle || '',
                              vehicleIssue: data.vehicleIssue || '',
                         });
                    })
                    .catch((error) => {
                         console.error('Error fetching student data:', error);
                    });
          }
     }, [isLoggedIn]);



     const vehicleOptions = [
          { label: "Bike", value: "Bike" },
          { label: "Car", value: "Car" },
     ];


     const [formData, setFormData] = useState({
          name: "",
          email: "",
          phone: "",
          vehicle: "",
          vehicleIssue: "",
          password: "",
          confirmPassword: "",
     });


     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value })
     }

     const handlePhoneChange = (e) => {
          // Extract the value from event object
          const numericValue = e.target.value.replace(/[^0-9]/g, '');
          if (numericValue.length <= 10) {
               setFormData({ ...formData, phone: numericValue });
          }
     }


     const handleClose = () => {
          navigate('/');

     }


     const handleSubmit = async (e) => {
          e.preventDefault();

          try {
               const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/userupdate`, formData, { withCredentials: true });
               toast.success(response.data.message);
               navigate("/");

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
               <form onSubmit={handleSubmit}>
                    <h1>Update Details</h1>
                    <input
                         type='text'
                         name='name'
                         id='name'
                         placeholder='Enter name'
                         value={formData.name}
                         onChange={handleChange}
                         required
                    />
                    <input
                         type='email'
                         name='email'
                         id='email'
                         placeholder='Enter email'
                         value={formData.email}
                         onChange={handleChange}
                         required
                    />
                    <input
                         type='tel'
                         name='phone'
                         id='phone'
                         placeholder='Enter phone'
                         value={formData.phone}
                         onChange={handlePhoneChange} // separate function as to change Number to String
                         required
                    />
                    <select
                         name='vehicle'
                         id='vehicle'
                         value={formData.vehicle}
                         onChange={handleChange}
                         required>
                         <option value="" disabled>Select vehicle</option>
                         {vehicleOptions.map((option, key) => (
                              <option key={key} value={option.value}>{option.label}</option>
                         ))}
                    </select>
                    <textarea
                         name='vehicleIssue'
                         id='vehicleIssue'
                         placeholder='What is your vehicle issue?'
                         value={formData.vehicleIssue}
                         onChange={handleChange}
                         required
                         rows="3"
                    ></textarea>

                    {isLoggedIn?(
                         <button className={styles.signUp} type='submit'>Update</button>
                    ):(
                         <h2>You are not logged In!</h2>
                    )
                    }
                    <p className={styles.close} onClick={handleClose}>Close</p>
               </form>
          </div>
     )
}

