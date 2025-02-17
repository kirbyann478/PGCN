import { useEffect, useState } from "react";  
import NavBar from "../../components/admin_site/NavBar";
import DashboardContent from "../../components/admin_site/DashboardContent";

function AdminDashboard(){

    return(
        <>
            <NavBar />
            <DashboardContent />
        </>
    )
}

export default AdminDashboard;