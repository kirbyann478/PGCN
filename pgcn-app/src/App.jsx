import { BrowserRouter, Routes, Route } from "react-router-dom";  
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin_site/Dashboard";
import ManageHospitalBill from "./pages/admin_site/ManageHospitalBill";

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

      </Routes>
    </ BrowserRouter>

    </>
  )
}

export default App
