import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowDown,
    Newspaper,
    Globe,
    Clock,
    ChevronRight,
    ArrowRight,
    Award,
    TrendingUp,
    Users,
    Star,
    Shield,
    Search,
    Share2,
    Bookmark,
    Bell,
    Sparkles
} from 'lucide-react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import VerticalNavbar from '../pages/VerticalNavbar';
import Profile from '../pages/Profile';

const Home = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [statistics, setStatistics] = useState({ users: 0, articles: 0, sources: 0 });

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const searchContainerRef = useRef(null);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    const handleExploreClick = () => {
        if (isAuthenticated) {
            navigate('/news');
        } else {
            navigate('/login');
        }
    };

    const handleSearchClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setIsSearchOpen(true);
    };

    // Slower animated statistics
    useEffect(() => {
        const interval = setInterval(() => {
            setStatistics(prev => ({
                users: prev.users < 100 ? prev.users + 1 : prev.users,
                articles: prev.articles < 50 ? prev.articles + 1 : prev.articles,
                sources: prev.sources < 20 ? prev.sources + 1 : prev.sources
            }));
        }, 25); // Slower update interval

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen relative">

            <div className="fixed inset-0 animate-gradient bg-gradient-to-br from-purple-400 via-blue-100 to-purple-400 opacity-60 -z-10" />

            <div className="fixed inset-0 animate-gradient-secondary bg-gradient-to-tl from-blue-100 via-purple-400 to-blue-100 opacity-40 -z-10" />


            <VerticalNavbar
                onSearchClick={handleSearchClick}
                onLogout={handleLogout}
            />
            
            {/* if user is not null, show profile */}
            {isAuthenticated && <Profile user={user} />}

            <div className="w-full">
                {/* Hero Section */}
                <section id="hero" className="min-h-screen relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid opacity-5 p-5" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-8"
                    >
                        <div className='flex flex-col items-center justify-center' style={{
                            padding: '3rem 8rem',
                            backdropFilter: 'blur(12px) saturate(200%)',
                            WebkitBackdropFilter: 'blur(12px) saturate(200%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            borderRadius: '12px',
                            border: '1px solid rgba(209, 213, 219, 0.3)'
                        }}>
                            <div className="relative">
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-5"
                                >
                                    Knewz
                                    <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -right-16 -top-16"
                            >
                                <Sparkles className="w-20 h-20 text-blue-400" />
                            </motion.div>
                                </motion.div>

                                

                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="font-semibold text-gray-800 mb-8 text-left max-w-2xl italic"
                                    style={{ fontSize: '22px' }}
                                >
                                    your news, your pace, your way
                                </motion.p>

                                {/* Enhanced Stats Cards */}
                                <div className="flex gap-8 mb-12 justify-center">
                                    {[
                                        {
                                            icon: Users,
                                            label: 'Active Users',
                                            value: `${statistics.users}+`,
                                            color: 'from-blue-500 to-blue-600'
                                        },
                                        {
                                            icon: Globe,
                                            label: 'News Sources',
                                            value: `${statistics.sources}+`,
                                            color: 'from-purple-500 to-purple-600'
                                        },
                                        {
                                            icon: TrendingUp,
                                            label: 'Daily Articles',
                                            value: `${statistics.articles}+`,
                                            color: 'from-indigo-500 to-indigo-600'
                                        }
                                    ].map((stat, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 * idx }}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 min-w-[200px]"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                                                    <stat.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <Star className="w-5 h-5 text-yellow-400" />
                                            </div>
                                            <div className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-2 font-medium">
                                                {stat.label}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl font-semibold text-gray-800 mb-8 text-center max-w-2xl"
                            >
                                Your Personal News Navigator in the Digital Age
                            </motion.h2>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
                                }}
                                transition={{ delay: 0.6 }}
                                onClick={handleExploreClick}
                                className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold"
                            >
                                <span>Explore News</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </motion.div>
                </section>

                {/* Enhanced Features Section */}
                <section id="features" className="min-h-screen flex items-center justify-center p-16 relative">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            Why Choose Knewz?
                        </motion.h2>
                        <div className="grid grid-cols-3 gap-12">
                            {[
                                {
                                    icon: Award,
                                    title: 'Smart Reading Experience',
                                    desc: 'Save time with AI-powered article summarization and voice reading',
                                    highlight: 'Multi-Modal News',
                                    features: ['Summarized Articles', 'Full Article Access', 'Multiple Voice Options']
                                },
                                {
                                    icon: Globe,
                                    title: 'Daily Fresh Content',
                                    desc: '50+ new articles daily from trusted sources',
                                    highlight: '50+ Daily Articles',
                                    features: ['Regular Updates', 'Listen or Read', 'Quality Sources']
                                },
                                {
                                    icon: Bell,
                                    title: 'Interactive Features',
                                    desc: 'Engage with content your way',
                                    highlight: 'Full Engagement',
                                    features: ['Voice Reading', 'Bookmark Articles', 'Comment & Discuss']
                                }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    whileHover={{ y: -5 }}
                                    className="relative group"
                                >
                                    <div className="h-full bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-lg bg-blue-100">
                                                    <feature.icon className="w-8 h-8 text-blue-600" />
                                                </div>
                                                <span className="ml-3 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                    {feature.highlight}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed mb-6">{feature.desc}</p>
                                        <div className="space-y-3">
                                            {feature.features.map((item, i) => (
                                                <div key={i} className="flex items-center text-gray-600">
                                                    <ChevronRight className="w-4 h-4 text-blue-500 mr-2" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call-to-Action Section with Additional Features */}
                <section id="cta" className="min-h-screen flex items-center justify-center p-16 relative">
                    <div className="max-w-6xl mx-auto text-center relative">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-gray-100"
                        >
                            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent p-2">
                                Ready to Stay Informed?
                            </h2>
                            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
                                Join our growing community and experience news reading reimagined.
                            </p>

                            {/* Additional Features Grid */}
                            <div className="grid grid-cols-4 gap-6 mb-12">
                                {[
                                    { icon: Search, label: 'Smart Search' },
                                    { icon: Bookmark, label: 'Save Articles' },
                                    { icon: Share2, label: 'Comment & Eage' },
                                    { icon: Shield, label: 'Privacy First' }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                                        <item.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                        <div className="text-sm font-medium text-gray-600">{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ y: -2 }}
                                onClick={handleExploreClick}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg text-xl font-semibold shadow-lg"
                            >
                                Start Reading Now
                            </motion.button>
                        </motion.div>
                    </div>
                </section>
            </div>

            <style jsx="true" global="true">{`
                html {
                    scroll-behavior: smooth;
                }
                
                body {
                    overflow-x: hidden;
                }
                
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
                
                .bg-grid {
                    background-image: linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                
                .vertical-navbar {
                    z-index: 1000;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(8px);
                }
                
                .vertical-navbar.open {
                    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
                }
                
                ::-webkit-scrollbar {
                    width: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                ::-webkit-scrollbar-thumb {
                    background-color: rgba(59, 130, 246, 0.5);
                    border-radius: 20px;
                }

                /* Add a subtle blur effect to content cards for better contrast */
                .bg-white {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(8px);
                }

                @media (max-width: 768px) {
                    .grid-cols-3 {
                        grid-template-columns: 1fr;
                    }
                    .grid-cols-4 {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;