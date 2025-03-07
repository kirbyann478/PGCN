import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar({ isVisible }) { 
    const navigate = useNavigate(); // Use navigate for redirection 

    const location = useLocation(); // Get the current location (URL)

    // Helper function to check if the current location matches the given path
    const isActive = (path) => location.pathname === path;


    const handleLogout = async () => {
        // Get the current user from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
    
        if (user && user.email) {
            console.log("Logging out user:", user.email);
        } else {
            console.log("No user found in localStorage");
        }
    
        try {
            // Send logout request to the server
            await axios.post("http://192.168.1.248:5000/logout");
            console.log("Server session destroyed");
    
            // Remove user data from localStorage
            localStorage.removeItem("user");
    
            // Confirm logout in the console
            console.log("User logged out:", localStorage.getItem("user") === null ? "Success" : "Failed");
    
            // Redirect to login page
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
 
    
    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            console.log("Stored User:", JSON.parse(storedUser));
        } 
    }, []);
 

    

    return (
        <>
            {isVisible && (
                <aside id="sidebar" className="sidebar">
                    <ul className="sidebar-nav" id="sidebar-nav">
                        
                        <li className="nav-heading">ADMIN TOOL</li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/dashboard') ? '' : 'collapsed'}`}
                                id="dashboard"
                                to="/admin/dashboard" // Use 'to' instead of 'href'
                            >
                                <i className='bx bxs-dashboard' ></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        
                        <hr />
                        <li className="nav-heading">MANAGE TRANSACTIONS</li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/hospital_bill') ? '' : 'collapsed'}`}
                                id="dashboard"
                                to="/admin/hospital_bill" // Use 'to' instead of 'href'
                            >
                                {/* <i className="bi bi-briefcase-fill"></i> */}
                                <i className='bx bxs-briefcase' ></i>
                                <span>Hospital Bill</span>
                            </Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/manage_burial') ? '' : 'collapsed'}`}
                                id="dashboard"
                                to="/admin/manage_burial" // Use 'to' instead of 'href'
                            >
                                {/* <i className="bi bi-briefcase-fill"></i> */}
                                <i className='bx bxs-briefcase' ></i>
                                <span>Burial Assistance</span>
                            </Link>
                        </li> 
                        
                        <hr />
                        <li className="nav-heading">REPORTS</li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/manage_report') ? '' : 'collapsed'}`}
                                id="dashboard"
                                to="/admin/manage_report" // Use 'to' instead of 'href'
                            > 
                                <i className='bx bxs-report' ></i>
                                <span>Generate Reports</span>
                            </Link>
                        </li> 
                        
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/report_statistics') ? '' : 'collapsed'}`}
                                id="dashboard"
                                to="/admin/report_statistics" // Use 'to' instead of 'href'
                            >
                                <i className='bx bx-line-chart'></i>
                                <span>Reports and Statistics</span>
                            </Link>
                        </li> 

                        <hr />
                        <li className="nav-heading">CONFIGURATION</li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/manage_user_accounts') ? '' : 'collapsed'}`}
                                id="dashboard"
                                to="/admin/dashboard" // Use 'to' instead of 'href'
                            >
                                <i className='bx bxs-user-account' ></i>
                                <span>Manage User Accounts</span>
                            </Link>
                        </li> 
                        <hr /> 

                        <li className="nav-item">
                            <Link 
                                className="nav-link" 
                                onClick={handleLogout} 
                                style={{ border: "none", background: "none", cursor: "pointer" }}
                            >
                                <i className='bx bx-log-out' ></i>
                                <span>Logout</span>
                            </Link>
                        </li>



                    </ul>
                </aside>
            )}
        </>
    );
}

export default Sidebar;
