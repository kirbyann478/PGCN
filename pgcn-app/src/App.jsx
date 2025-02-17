import { BrowserRouter, Routes, Route } from "react-router-dom";  
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin_site/Dashboard";

function App() { 
  return (
    <>
    
    <BrowserRouter>
      <Routes>
        {/* Admin Pages */}
        <Route path="" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </ BrowserRouter>

    </>
  )
}

export default App
