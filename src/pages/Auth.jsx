import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock, Mail, ArrowRight } from 'lucide-react';
import axios from 'axios';
import VerticalNavbar from './VerticalNavbar';

const AuthPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const extractUsername = (email) => {
        return email.split('@')[0];
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const signupData = {
                ...formData,
                username: extractUsername(formData.email)
            };
            const response = await axios.post('https://45w3fw18-3000.inc1.devtunnels.ms/auth/register', signupData);
            alert(response.data.message);

            // Redirect to the login page
            setIsSignup(false);

        } catch (error) {
            alert(error.response?.data?.message || 'Signup failed');
        }
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://45w3fw18-3000.inc1.devtunnels.ms/auth/login', {
                username: extractUsername(formData.email),
                password: formData.password
            });

            const token = response.data.token;
            const username = response.data.username;
            const email = response.data.email;
            
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            alert(response.data.message);

            // Redirect to the home page
            window.location.href = '/';

        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    const pageVariants = {
        initial: { opacity: 0, x: isSignup ? '-100%' : '100%' },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: isSignup ? '100%' : '-100%' }
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5
    };

    return (
        <div className="min-h-screen relative">

            <VerticalNavbar />

            <div className="fixed inset-0 animate-gradient bg-gradient-to-br from-purple-400 via-blue-100 to-purple-400 opacity-60 -z-10" />
            <div className="fixed inset-0 animate-gradient-secondary bg-gradient-to-tl from-blue-100 via-purple-400 to-blue-100 opacity-40 -z-10" />

            <div className="min-h-screen flex items-center justify-center p-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg h-[670px] bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex items-center"
                    style={{
                        backdropFilter: 'blur(12px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(12px) saturate(200%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        borderRadius: '12px',
                        border: '1px solid rgba(209, 213, 219, 0.3)'
                    }}
                >
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={isSignup ? 'signup' : 'signin'}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="p-10 w-full"
                        >
                            <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                                {isSignup ? 'Create Account !' : 'Welcome Back !'}
                            </h1>

                            <form onSubmit={isSignup ? handleSignup : handleSignin} className="space-y-7">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 px-5 py-3 text-lg border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-600 transition-all"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 px-5 py-3 text-lg border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-600 transition-all"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </div>

                                {isSignup && (
                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-3">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 px-5 py-3 text-lg border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-600 transition-all"
                                                placeholder="Confirm your password"
                                            />
                                        </div>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-700 to-purple-700 text-white py-4 text-lg rounded-xl flex items-center justify-center gap-3 hover:brightness-110 transition-all"
                                >
                                    {isSignup ? 'Create Account' : 'Sign In'}
                                    <Send size={24} />
                                </motion.button>
                            </form>

                            <div className="text-center mt-8">
                                <p className="text-lg text-gray-600">
                                    {isSignup 
                                        ? 'Already have an account? ' 
                                        : 'Don\'t have an account? '}
                                    <button 
                                        onClick={() => setIsSignup(!isSignup)}
                                        className="text-blue-700 hover:underline text-lg font-semibold ml-2"
                                    >
                                        {isSignup ? 'Sign In' : 'Sign Up'}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            <style jsx="true" global="true">{`
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                
                @keyframes gradient-secondary {
                    0% {
                        background-position: 100% 50%;
                    }
                    50% {
                        background-position: 0% 50%;
                    }
                    100% {
                        background-position: 100% 50%;
                    }
                }
                
                .animate-gradient {
                    animation: gradient 15s ease infinite;
                    background-size: 300% 300%;
                }
                
                .animate-gradient-secondary {
                    animation: gradient-secondary 12s ease infinite;
                    background-size: 300% 300%;
                }
            `}</style>
        </div>
    );
};

export default AuthPage;