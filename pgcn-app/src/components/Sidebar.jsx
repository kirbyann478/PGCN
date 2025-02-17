import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'; 

function Sidebar({ isVisible }) { 


    const location = useLocation(); // Get the current location (URL)

    // Helper function to check if the current location matches the given path
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {isVisible && (
                <aside id="sidebar" className="sidebar">
                    <ul className="sidebar-nav" id="sidebar-nav">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/dashboard') ? '' : 'collapsed'}`}
                                id="dashboard"
                                to="/admin/dashboard" // Use 'to' instead of 'href'
                            >
                                <i className="bi bi-grid"></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        <hr />

                        <li className="nav-heading">MANAGE PATIENT CARE REPORT</li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/manage_patient_records') ? '' : 'collapsed'}`}
                                to="/admin/manage_patient_records" // Use 'to' instead of 'href'
                            >
                                <i className="bx bxs-briefcase"></i>
                                <span>Patient Care Records</span>
                            </Link>

                            <Link
                                className={`nav-link ${isActive('/admin/manage_tracking_report') ? '' : 'collapsed'}`}
                                to="/admin/manage_tracking_report" // Use 'to' instead of 'href'
                            >
                                <i className="bx bxs-map"></i>
                                <span>Tracking Report</span>
                            </Link>
                        </li>

                        <hr />
                        <li className="nav-heading">CONFIGURATION</li>

                         
                    </ul>
                </aside>
            )}
        </>
    );
}

export default Sidebar;
