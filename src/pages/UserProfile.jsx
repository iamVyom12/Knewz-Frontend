import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Camera, Bookmark, Mail, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import VerticalNavbar from './VerticalNavbar';

const UserProfile = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        avatar: 'https://picsum.photos/200/200' // Default avatar
    });

    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            console.log(token);
            
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const response = await axios.get('http://192.168.231.243:3000/auth/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userDetails = {
                    username: response.data.username || '',
                    email: response.data.email || '',
                    avatar: response.data.avatar || 'https://picsum.photos/200/200'
                };
                setUser(userDetails);

                // Fetch user's bookmarks
                const bookmarksResponse = await axios.get(`http://192.168.231.243:3000/bookmarks/user/${response.data._id}/bookmarks`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Transform bookmarks to match existing structure
                const transformedBookmarks = bookmarksResponse.data.map(bookmark => ({
                    id: bookmark._id,
                    title: bookmark.article.title,
                    image: bookmark.article.urlToImage || `https://picsum.photos/400/30${bookmark.article._id % 10}`,
                    date: bookmark.createdAt
                }));

                setBookmarkedArticles(transformedBookmarks);
            } catch (error) {
                console.error('Failed to fetch user profile or bookmarks', error);
                localStorage.removeItem('token');
                window.location.href = '/login';
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <VerticalNavbar />
            
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-xl p-8 mb-8"
                >
                    {/* User profile section remains the same */}
                    <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-grow">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <User size={24} className="text-gray-400" />
                                    <div className="flex-grow">
                                        <label className="block text-sm text-gray-500">Username</label>
                                        <h2 className="text-xl font-semibold">{user.username}</h2>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Mail size={24} className="text-gray-400" />
                                    <div>
                                        <label className="block text-sm text-gray-500">Email</label>
                                        <p className="text-gray-700">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleLogout}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Bookmarked Articles */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Bookmark size={24} className="text-blue-600" />
                        <h2 className="text-2xl font-bold">Bookmarked Articles</h2>
                    </div>

                    {bookmarkedArticles.length === 0 ? (
                        <div className="text-center text-gray-500">
                            No bookmarked articles found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookmarkedArticles.map((article) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Bookmarked on {new Date(article.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default UserProfile;