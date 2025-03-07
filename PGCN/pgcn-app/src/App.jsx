import { BrowserRouter, Routes, Route } from "react-router-dom";  
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin_site/Dashboard";
import ManageHospitalBill from "./pages/admin_site/ManageHospitalBill";
import ManageReport from "./pages/admin_site/ManageReport";
import { ManageBurial } from "./pages/admin_site/ManageBurial";
import ReportStatistics from "./pages/admin_site/ReportStatistics";
import ViewBurialRecord from "./pages/admin_site/ViewBurialRecord";

function App() { 
  return (
    <>
    
    <BrowserRouter>
      <Routes>
        {/* Auth Pages */}
        <Route path="" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Pages */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/hospital_bill" element={<ManageHospitalBill />} />
        <Route path="/admin/manage_report" element={<ManageReport />} />
        <Route path="/admin/manage_burial" element={<ManageBurial />} />
        <Route path="/admin/report_statistics" element={<ReportStatistics />} />
        {/* <Route path="/admin/view_burial_assistance" element={<ViewBurialRecord />} /> */}
        <Route path="/admin/view_burial_assistance/:id" element={<ViewBurialRecord />} />


      </Routes>
    </ BrowserRouter>

    </>
  )
}

export default App
