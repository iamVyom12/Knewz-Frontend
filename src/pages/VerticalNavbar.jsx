import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Newspaper, BookMarked, User, LogIn, Search, Info, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NewNavbar({ onSearchClick }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check authentication status on component mount and when localStorage changes
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        };

        // Initial check
        checkAuth();

        // Listen for localStorage changes
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    // Menu items configuration with authentication requirements
    const menuItems = [
        { icon: LogIn, label: 'Login', path: '/login', requiresAuth: false, hideWhenAuth: true },
        { icon: Home, label: 'Home', path: '/', requiresAuth: false },
        // { icon: Search, label: 'Search', action: onSearchClick, requiresAuth: true },
        { icon: Newspaper, label: 'News', path: '/news', requiresAuth: true },
        { icon: BookMarked, label: 'Bookmarks', path: '/profile', requiresAuth: true },
        { icon: Info, label: 'About', path: '/about', requiresAuth: true },
        { icon: User, label: 'Profile', path: '/profile', requiresAuth: true },
        { 
            icon: LogOut, 
            label: 'Logout', 
            action: () => {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                navigate('/login');
            }, 
            requiresAuth: true 
        },
    ];

    // Filter menu items based on authentication status
    const filteredMenuItems = menuItems.filter(item => {
        if (isAuthenticated) {
            return !item.hideWhenAuth;
        }
        return !item.requiresAuth;
    });

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isOpen && 
                !e.target.closest('.navbar-menu') && 
                !e.target.closest('.hamburger-button')
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Handle menu item click
    const handleMenuClick = (item) => {
        if (!isAuthenticated && item.requiresAuth) {
            navigate('/login');
            setIsOpen(false);
            return;
        }

        if (item.path) {
            navigate(item.path);
        } else if (item.action) {
            item.action();
        }
        setIsOpen(false);
    };

    // Protected route helper
    const checkAuthAndRedirect = (path) => {
        if (!isAuthenticated) {
            navigate('/login');
            return false;
        }
        return true;
    };

    return (
        <div className="navbar-container">
            {/* Hamburger Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="hamburger-button fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <Menu className="text-gray-600" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Navigation Menu */}
            <nav
                className={`navbar-menu fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                    <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                </button>

                {/* Logo */}
                <div className="h-16 flex items-center justify-space-between border-b border-gray-100">
                    <span className="text-2xl pl-8 font-bold text-blue-600">Knewz</span>
                </div>

                {/* Menu Items */}
                <div className="py-4">
                    {filteredMenuItems.map((item, index) => (
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