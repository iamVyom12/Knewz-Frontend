import React from 'react';
import '../styles/Navbar.css';
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleAbout = () => {
        navigate('/about');
    }

    const handleServices = () => {
        navigate('/services');
    }

    const handleContact = () => {
        navigate('/contact');
    }

    return (
        <header className="navbar">
            <div className="logo">Knewz</div>
            <nav>
                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li onClick={()=>handleAbout()} >About</li>
                    <li onClick={() => handleServices() }>Services</li>
                    <li onClick={()=> handleContact()}>Contact</li>
                </ul>
            </nav>
            <div className="cta">
                <button className="cta-btn" onClick={() => navigate('/signin')}>Login</button>
            </div>
        </header>
    );
};

export default Navbar;
