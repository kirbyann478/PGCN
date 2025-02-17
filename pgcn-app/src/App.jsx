import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import AdminDashboard from "./pages/admin_site/Dashboard";

function App() { 
  return (
    <>
    
    <BrowserRouter>
      <Routes>
        {/* Admin Pages */}
        <Route path="" element={<AdminDashboard />} />

      </Routes>
    </ BrowserRouter>

    </>
  )
}

export default App
