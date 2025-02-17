import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';  

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); 

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const body = document.body;
        if (location.pathname === "/login") {
            body.style.backgroundColor = "#f0f0f0";
        } else {
            body.style.backgroundColor = "#ffffff";
        }
        return () => {
            body.style.backgroundColor = "";
        };
    }, [location]);

    
    const handleLogin = async (e) => {
        e.preventDefault();
    
        // Check if email and password are provided
        if (!email || !password) {
            setError("Please provide both email and password.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password
                })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Login failed.");
            }
    
            console.log("Login successful!", data);
            setSuccess("Login successful!");
    
            // Show success message with SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back!',
            });
    
            // Optionally, store user data (e.g., token) in localStorage or context
            // localStorage.setItem("user", JSON.stringify(data));
            
            // Redirect user after successful login (adjust according to your app structure)
            setTimeout(() => navigate('/admin/dashboard'), 2000); // Navigate to a protected route like '/dashboard'
    
        } catch (err) {
            console.error("Error:", err.message);
            setError(err.message);
    
            // Show error message with SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.message,
            });
        }
    };
    
    

    return (
        <div className="login_page d-flex justify-content-center align-items-center vh-100">
            <div className="login_container">

                <div className="container"  >
                    <div className="login-form-wrapper"  >
                        <div className="row">
                            <div className="col-md-6 " >
                                <div className="caption_container">
                                    <img src='assets/img/authbg/ambulance.gif'
                                        className='ambulance_gif' />

                                    <h2 className="title">PGCN</h2>
                                    <p className="subtitle">Real-Time Ambulance Patient Information Dissemination: An Application for Immediate Ambulance to Hospital Patient Data and Incident Report Transmission</p>
                                </div>
                            </div>

                            <div className="col-md-6"  >
                                {/* <img src='assets/img/authbg/ambulance.gif'
                                    className='ambulance_gif' /> */}

                                <div className="login_form_container">

                                    <h2 className="title">LOGIN</h2>
                                    <p className="subtitle">Login to continue</p>
                                    {error && <p className="error">{error}</p>}
                                    {/* {success && <p className="success">{success}</p>} */}

                                    <form onSubmit={handleLogin} className="form">

                                        <div className="input-group">
                                            <label htmlFor="email" className="label">Email:</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="input"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="password" className="label">Password:</label>
                                            <input
                                                type="password"
                                                id="password"
                                                className="input"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="button">Log In</button>
                                    </form>
                                    <p className="footer">
                                        Don't have an account? <a href="/signup" className="link">Sign up</a>
                                    </p>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
}

export default LoginForm;
