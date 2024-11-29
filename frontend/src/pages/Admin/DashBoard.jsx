import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../styles/HomeStyles.module.css";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Bounce, toast } from "react-toastify";
import { adminLogout } from "../../redux/features/adminSlice.js";

export const DashBoard = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const adminData = useSelector((state) => state.adminAuth.admin);
     const isAdminLoggedIn = useSelector((state) => state.adminAuth.isLoggedIn);

     const [userData, setUserData] = useState([]);
     const [selectedGarages, setSelectedGarages] = useState({}); // Track selected garages for each user

     console.log("userData", userData);

     const garageList = [
          { label: "pune main", value: "pune main" },
          { label: "pune north", value: "pune north" },
          { label: "karve nagar", value: "karve nagar" },
          { label: "baner", value: "baner" },
          { label: "kothurd", value: "kothurd" },
     ];

     useEffect(() => {
          fetchUserData();
     }, [isAdminLoggedIn]);

     const fetchUserData = async () => {
          try {
               const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/allusersdata`, {
                    withCredentials: true
               });

               if (response.data.data.user.length === 0) {
                    setUserData([]);
               } else {
                    setUserData(response.data.data.user);
                    // Initialize the selectedGarages state with existing garage assignments
                    const initialGarageState = response.data.data.user.reduce((acc, currUser) => {
                         acc[currUser._id] = currUser.garage || "";
                         return acc;
                    }, {});
                    setSelectedGarages(initialGarageState);
               }
          } catch (error) {
               toast.error("Error fetching user data");
          }
     };

     const handleLogoutClick = async () => {
          try {
               const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/adminlogout`, {}, { withCredentials: true });
               dispatch(adminLogout());
               navigate('/adminlogin');
               toast.success(response.data.message);
          } catch (error) {
               toast.error("Logout failed");
          }
     };

     const handleGarageChange = (userId, value) => {
          setSelectedGarages((prevState) => ({
               ...prevState,
               [userId]: value,
          }));
     };

     const handleGarageUpdate = async (userId) => {
          try {
               const selectedGarage = selectedGarages[userId];
               const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/updateusergaragestatus/${userId}`, { garage: selectedGarage }, {
                    withCredentials: true
               });
               toast.success("Garage updated successfully");
               // Optionally, re-fetch user data after successful update
               fetchUserData();
          } catch (error) {
               toast.error("Error updating garage");
          }
     };

     const handleClearGarage = async (userId) => {
          try {
               // Clear the garage selection in the state
               setSelectedGarages((prevState) => ({
                    ...prevState,
                    [userId]: "",
               }));
               // Update the backend with the cleared garage
               const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/updateusergaragestatus/${userId}`, { garage: "" }, {
                    withCredentials: true
               });
               toast.success("Garage cleared successfully");
               // Optionally, re-fetch user data after successful update
               fetchUserData();
          } catch (error) {
               toast.error("Error clearing garage");
          }
     };

     return (
          <section className={styles.container}>
               <p>Welcome, {adminData.adminName}</p>
               <button className={styles.logoutBtn} onClick={handleLogoutClick}>logout</button>

               <table className={styles.tableContainer}>
                    <thead>
                         <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Vehicle</th>
                              <th>Vehicle Issue</th>
                              <th>Garage Assigned</th>
                              <th>Select Garage</th>
                         </tr>
                    </thead>

                    <tbody>
                         {userData.map((currUser) => (
                              <tr key={currUser._id}>
                                   <td>{currUser.name || "-"}</td>
                                   <td>{currUser.email || "-"}</td>
                                   <td>{currUser.phone || "-"}</td>
                                   <td>{currUser.vehicle || "-"}</td>
                                   <td>{currUser.vehicleIssue || "-"}</td>
                                   <td>{currUser.garage || "-"}</td>
                                   <td>
                                        <form onSubmit={(e) => {
                                             e.preventDefault();
                                             handleGarageUpdate(currUser._id);
                                        }}>
                                             <select
                                                  name='garage'
                                                  id='garage'
                                                  value={selectedGarages[currUser._id] || ""}
                                                  onChange={(e) => handleGarageChange(currUser._id, e.target.value)}
                                                  required
                                                  style={{
                                                       padding: "0.2rem",
                                                       marginRight: "0.6rem",
                                                       borderRadius: "0.4rem"
                                                  }}>
                                                  <option value="" disabled>Select garage</option>
                                                  {garageList.map((option) => (
                                                       <option key={option.value} value={option.value}>{option.label}</option>
                                                  ))}
                                             </select>
                                             <button
                                                  style={{
                                                       padding: "0.3rem",
                                                       marginRight: "0.6rem",
                                                       border: "none",
                                                       backgroundColor: "#006989",
                                                       color: "white",
                                                       cursor: "pointer",
                                                       borderRadius: "0.4rem"
                                                  }}
                                                  type="submit">
                                                  Update
                                             </button>
                                             <button
                                                  type="button"
                                                  onClick={() => handleClearGarage(currUser._id)}
                                                  style={{
                                                       padding: "0.3rem",
                                                       marginRight: "0.6rem",
                                                       border: "none",
                                                       backgroundColor: "#E88D67",
                                                       color: "white",
                                                       cursor: "pointer",
                                                       borderRadius: "0.4rem"
                                                  }}>
                                                  Clear
                                             </button>
                                        </form>
                                   </td>
                              </tr>
                         ))}
                    </tbody>
               </table>
          </section>
     );
};
