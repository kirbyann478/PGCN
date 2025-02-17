import { useEffect, useState } from "react";
import NavBar from "../../components/Navbar";
import DashboardContent from "../../components/DashboardContent";

function AdminDashboard(){

    return(
        <>
            <NavBar />
            <DashboardContent />
        </>
    )
}

export default AdminDashboard;