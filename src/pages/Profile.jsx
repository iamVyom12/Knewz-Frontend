import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            setIsAuthenticated(!!token);
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    // Handle invalid user data
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkAuth();

        // Listen for localStorage changes
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const handleProfileClick = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleProfileClick}
            className="fixed top-5 right-5 z-10 cursor-pointer shadow-lg bg-white rounded-full p-1"
        >
            {isAuthenticated && user ? (
                // User is logged in - show avatar
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                    <img
                        src={user.avatar || '/api/placeholder/200/200'}
                        alt={user.username}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                // No user - show default user icon
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={24} className="text-gray-500" />
                </div>
            )}
        </motion.div>
    );
};

export default Profile;