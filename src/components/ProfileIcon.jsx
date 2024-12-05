import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserProfileIcon = ({ user }) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleProfileClick}
            className="fixed top-4 right-4 z-10 cursor-pointer"
        >
            {user ? (
                // User is logged in - show avatar
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                    <img
                        src={user.avatar || 'https://picsum.photos/200/200'}
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

export default UserProfileIcon;