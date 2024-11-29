import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/HomeStyles.module.css";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Bounce, toast } from "react-toastify";
import { logout } from '../redux/features/userSlice';

export const Home = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);
     const isAdminLoggedIn = useSelector((state) => state.adminAuth.isLoggedIn);
     const userData = useSelector((state) => state.userAuth.user);

     // console.log(userData);


     const [toastId, setToastId] = useState(null);

     const [userLoggedData, setUserLoggedData] = useState(null);

     // console.log("loggedUser", userLoggedData);


     useEffect(() => {
          const fetchData = async () => {
               try {

                    if (isLoggedIn) {
                         await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/loggeduser`, { withCredentials: true }).then((response) => {
                              setUserLoggedData(response.data.data.user);
                         })
                    }
               } catch (error) {
                    if (error.response && error.response.data && error.response.data.message) {
                         toast.error(error.response.data.message || "An error occurred");
                    } else {
                         toast.error("An error occurred");
                    }
               }
          }
          fetchData()
     }, [isLoggedIn]);


     const handleLoginClick = () => {
          navigate('/userlogin');
     };

     const handleUpdate = (id) => {
          navigate("/user/update");
     };

     const handleLogoutClick = async () => {
          try {
               const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/userlogout`, {}, { withCredentials: true })
               dispatch(logout());
               toast.success(response.data.message);
               navigate('/');

          } catch (error) {
               toast.error("Logout failed");
          }
     }


     const handleDeleteConfirmation = (id) => {
          const idToast = toast.info(
               <div>
                    <p style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>Are you sure to delete your account?</p>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",
                         marginRight: "1rem"

                    }}
                         onClick={() => {
                              toast.dismiss(idToast);
                              confirmDelete(id)
                         }
                         }
                    >Yes</button>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",

                    }}
                         onClick={() => toast.dismiss(idToast)}>No</button>
               </div >,
               {
                    position: "top-center",
                    autoClose: "5000",
                    closeOnClick: false,
                    draggable: false,
                    closeButton: false,
                    transition: Bounce,
                    style: { width: "150%" }
                    // className: styles.confirmationToast
               }
          );
          setToastId(idToast);
     }


     const confirmDelete = (id) => {
          toast.dismiss();
          deleteUserAccount(id);
     };


     const deleteUserAccount = async (id) => {
          try {
               const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/userdelete/${id}`, { withCredentials: true });
               toast.success(response.data.message);
               dispatch(logout());
               navigate('/');
          } catch (error) {
               if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message || "An error occurred");
               } else {
                    toast.error("An error occurred");
               }
          }
     }

     const handleAdminDashboard = () => {
          navigate("/admin/dashboard")
     }


     return (
          <section className={styles.container}>
               <h1>
                    Welcome to <span>Grease Monkey</span> e-garage.
               </h1>

               {isAdminLoggedIn && (
                    <button className={styles.loginBtn} onClick={handleAdminDashboard}>Dashboard</button>
               )}

               {!isLoggedIn ? (
                    <>
                         <p>Booked for an appointment at our selected garage.</p>
                         <button className={styles.loginBtn} onClick={handleLoginClick}>Login</button>
                    </>
               ) : (

                    <div className={styles.actionBtn}>
                         <button className={styles.logoutBtn} onClick={handleLogoutClick}>logout</button>
                         <button className={styles.accountDeleteBtn} onClick={() => handleDeleteConfirmation(userData.id)}>Delete Account</button>
                    </div>

               )}


               {isLoggedIn && userLoggedData && (
                    <table className={styles.tableContainer}>
                         <thead>
                              <tr>
                                   <th>Name</th>
                                   <th>Email</th>
                                   <th>Phone</th>
                                   <th>Vehicle</th>
                                   <th>Vehicle Issue</th>
                                   <th>Suggested garage</th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr>
                                   <td>{userLoggedData.name || "-"}</td>
                                   <td>{userLoggedData.email || "-"}</td>
                                   <td>{userLoggedData.phone || "-"}</td>
                                   <td>{userLoggedData.vehicle || "-"}</td>
                                   <td>{userLoggedData.vehicleIssue || "-"}</td>
                                   <td>{userLoggedData.garage || "-"}</td>
                              </tr>
                         </tbody>
                    </table>
               )}

               {
                    isLoggedIn && (
                         <button className={styles.updateBtn} onClick={() => handleUpdate(userData.id)}>Update Details</button>
                    )
               }
          </section>
     );
};
