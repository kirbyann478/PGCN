import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';  

function NavBar() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [account, setAccount] = useState(null); // Track user account details
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Check if the user is logged in
    const navigate = useNavigate();

    // Dropdown initialization once the component has mounted
    useEffect(() => {
        // Ensure Bootstrap is loaded and dropdown is initialized
        if (window.bootstrap) {
            const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
            dropdownElementList.forEach(dropdown => {
                new window.bootstrap.Dropdown(dropdown);
            });
        } else {
            console.error("Bootstrap is not loaded!");
        }
    }, []);

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
        document.body.classList.toggle('toggle-sidebar');
        console.log("Sidebar visibility:", !isSidebarVisible);
    };

    // Handle logout
    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => navigate('/login'))
            .catch((error) => console.error("Logout error: ", error));
    };

    return (
        <>
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center">
                    <Link to="/admin/dashboard" className="logo d-flex align-items-center mx-auto">
                        {/* <img src="/assets/img/med_logo.png" alt="Logo" /> */}
                        <span className="d-none d-lg-block">PGCN</span>
                    </Link>
                    <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}></i>
                </div>

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">
                        <li className="nav-item dropdown pe-3">
                            <Link
                                className="nav-link nav-profile d-flex align-items-center justify-content-center pe-0"
                                to="/admin/notification"
                            >
                                <img
                                    src="/assets/img/notif-sym.png"
                                    alt="Profile"
                                    id="navbarProfilePicture"
                                    className="rounded-circle"
                                    style={{ width: "25px", height: "25px" }}
                                />
                            </Link>
                        </li>

                        <li className="nav-item dropdown pe-3">
                            <button
                                className="nav-link nav-profile d-flex align-items-center justify-content-center pe-0 dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <p className="navbarUserName mb-0 me-2">
                                    {account ? `Hi, ${account.firstName}!` : 'Welcome!'}
                                </p>
                                <img
                                    src="/assets/img/profile.png"
                                    alt="Profile"
                                    id="navbarProfilePicture"
                                    className="rounded-circle"
                                />
                            </button>

                            {/* Bootstrap Dropdown Menu */}
                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    <h6>{account ? account.firstName : 'Guest'}</h6>
                                    <span>{account ? account.userLevel : 'User'}</span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="/admin/profile">
                                        <i className="bi bi-person"></i>
                                        <span>My Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>  
                                <li>
                                    <Link className="dropdown-item d-flex align-items-center" to="/login">
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Login</span>
                                    </Link>
                                </li> 
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
            <Sidebar isVisible={isSidebarVisible} />
        </>
    );
}

export default NavBar;
