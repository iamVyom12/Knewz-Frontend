import React, { useState, useEffect } from 'react';
import { Menu, Home, Newspaper, BookMarked, User, LogIn, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NewNavbar({ onSearchClick }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Menu items configuration
    const menuItems = [
        { icon: LogIn, label: 'Login', path: '/login' },
        { icon: Search, label: 'Search', action: onSearchClick },
        { icon: Home, label: 'Home', path: '/' },
        { icon: Newspaper, label: 'News', path: '/news' },
        { icon: BookMarked, label: 'Bookmarks', path: '/bookmarks' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    // Close menu when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (isOpen && !e.target.closest('.navbar-container')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [isOpen]);

    // Handle menu item click
    const handleMenuClick = (item) => {
        if (item.path) {
            navigate(item.path);
        } else if (item.action) {
            item.action();
        }
        setIsOpen(false);
    };

    return (
        <div className="navbar-container">
            {/* Hamburger Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <Menu className="text-gray-600" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            )}

            {/* Navigation Menu */}
            <nav
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    <span className="text-2xl font-bold text-blue-600">Knewz</span>
                </div>

                {/* Menu Items */}
                <div className="py-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleMenuClick(item)}
                            className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                                item.path === location.pathname ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="ml-4 font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}