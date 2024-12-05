import React, {useState} from 'react';
import '../styles/SigninSignup.css';
import {FaEnvelope, FaLock, FaUser} from "react-icons/fa6";
import axios from "axios";

export default function SigninSignup() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [action, setAction] = useState("");

    const registerLinks = () => {
        setAction("active");
    }

    const loginLinks = () => {
        setAction("");
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password
            });
            console.log("Login Response:", response.data);
            // Handle successful login (e.g., store token, redirect)
            alert('Login Successful!');
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            alert('Login Failed');
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                email,
                password
            });
            console.log("Registration Response:", response.data);
            // Handle successful registration
            alert('Registration Successful!');
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error.message);
            alert('Registration Failed');
        }
    }

    return (
         <section className="signin-signup-section">
        <div className="logo1">Knewz</div>
        <div className={`wrapper ${action} `}>
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value) } required/>
                        <FaUser className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <FaLock className="icon"/>
                    </div>

                    <div className="remember-forget">
                        <label>
                            <input type="checkbox"/> Remember Me
                        </label>
                        <a href="#">Forget Password</a>
                    </div>
                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>
                            Don't have an account? <a href="#" onClick={registerLinks}>Register Now</a>
                        </p>
                    </div>
                </form>
            </div>
            <div className="form-box register">
                <form onSubmit={handleRegister}>
                    <h1>Register</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        <FaUser className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        <FaLock className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <FaEnvelope className="icon"/>
                    </div>

                    <div className="remember-forget">
                        <label>
                            <input type="checkbox"/> I agree to the terms and conditions
                        </label>
                    </div>
                    <button type="submit">register</button>

                    <div className="register-link">
                        <p>
                            Already have an account? <a href="#" onClick={loginLinks}>Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
         </section>
    )
}