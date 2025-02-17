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
                        
                        <li className="nav-heading">ADMIN TOOL</li>

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
                        
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/transactions') ? '' : 'collapsed'}`}
                                id="dashboard"
                                to="/admin/dashboard" // Use 'to' instead of 'href'
                            >
                                <i className="bi bi-briefcase-fill"></i>
                                <span>Transactions</span>
                            </Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/admin/reports') ? '' : 'collapsed'}`}
                                id="dashboard"
                                to="/admin/dashboard" // Use 'to' instead of 'href'
                            >
                                <i className="bi bi-reception-4"></i>
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
                                <i className="bi bi-people-fill"></i>
                                <span>Manage User Accounts</span>
                            </Link>
                        </li> 
                         
                    </ul>
                </aside>
            )}
        </>
    );
}

export default Sidebar;
