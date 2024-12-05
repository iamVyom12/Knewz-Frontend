import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Share2, Bookmark, ThumbsUp, Send, MessageCircle } from 'lucide-react';
import VerticalNavbar from './VerticalNavbar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import CommentService from '../services/CommentService';

const ArticlePage = () => {
    const location = useLocation();

    const [isBookmarked, setIsBookmarked] = useState(false);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const [userName, setUserName] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1
    });


    const article = location.state?.article || {
        id: null,
        title: 'Article Not Found',
        content: 'Unable to load the article details.',
        source: 'Unknown',
        date: '',
        image: ''
    };

    useEffect(() => {
        const fetchComments = async () => {
            if (!article.id) return;

            try {
                const result = await CommentService.getArticleComments(
                    article.id,
                    pagination.currentPage
                );

                setComments(result.comments);
                setPagination(prev => ({
                    ...prev,
                    totalPages: result.pages
                }));
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchComments();
    }, [article.id, pagination.currentPage]);

    const splitContentIntoParagraphs = (content) => {
        // Check if content is empty or not a string
        if (!content || typeof content !== 'string') return [];

        // First, try splitting by double newlines
        let paragraphs = content
            .split(/\n\s*\n/)
            .filter(para => para.trim() !== '')
            .map(para => para.trim());

        // If fewer than 5 paragraphs, split by periods and combine
        if (paragraphs.length < 5) {
            const sentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim() !== '');
            paragraphs = [];
            let currentParagraph = '';

            sentences.forEach((sentence, index) => {
                currentParagraph += sentence + ' ';

                // Create a new paragraph every 3-4 sentences or if it reaches a good length
                if ((index + 1) % 3 === 0 || currentParagraph.length > 200) {
                    paragraphs.push(currentParagraph.trim());
                    currentParagraph = '';
                }
            });

            // Add any remaining sentences
            if (currentParagraph.trim()) {
                paragraphs.push(currentParagraph.trim());
            }
        }

        // Ensure at least 5 paragraphs by splitting longer paragraphs
        while (paragraphs.length < 5 && paragraphs.some(p => p.length > 300)) {
            const longParagraphIndex = paragraphs.findIndex(p => p.length > 300);
            const longParagraph = paragraphs[longParagraphIndex];

            // Split the long paragraph roughly in half
            const midpoint = Math.floor(longParagraph.length / 2);
            const splitIndex = longParagraph.indexOf(' ', midpoint);

            paragraphs.splice(
                longParagraphIndex,
                1,
                longParagraph.slice(0, splitIndex).trim(),
                longParagraph.slice(splitIndex).trim()
            );
        }

        // Final fallback: if still fewer than 5, pad with repeated content
        while (paragraphs.length < 5) {
            paragraphs.push(paragraphs[paragraphs.length - 1]);
        }

        return paragraphs;
    };

    const handleBookmark = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Please log in to bookmark articles');
                return;
            }

            const response = await axios.post('http://192.168.231.243:3000/bookmarks',
                {
                    title: article.title,
                    url: article.id,
                    content: article.fullContent,
                    urlToImage: article.imageUrl
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            setIsBookmarked(true);
            alert('Article bookmarked successfully!');

        } catch (error) {
            console.error('Bookmark error:', error.response ? error.response.data : error.message);
            alert('Failed to bookmark article');
        }
    };


    const addComment = async () => {
        if (newComment.trim() === '' || !userName.trim()) {
            alert('Please enter both your name and a comment');
            return;
        }

        try {
            const newCommentObj = await CommentService.createComment(
                article.id,
                userName,
                newComment
            );

            // Update comments list and reset input
            setComments(prevComments => [newCommentObj, ...prevComments]);
            setNewComment('');
            setUserName('');
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('Failed to post comment. Please try again.');
        }
    };

    const paragraphs = splitContentIntoParagraphs(article.fullContent);



    return (
        <div className="min-h-screen bg-white">
            <VerticalNavbar />

            {/* Hero Section with Image and Title */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full h-[70vh] overflow-hidden"
            >
                <div className="absolute inset-0">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                    >
                        {article.title}
                    </motion.h1>
                </div>
            </motion.div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <Share2 size={20} />
                            <span>Share</span>
                        </motion.button>
                        <motion.button
                            onClick={handleBookmark}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full ${isBookmarked
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                                } transition-colors`}
                        >
                            <Bookmark size={20} />
                            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <ThumbsUp size={20} />
                            <span>Like</span>
                        </motion.button>
                    </div>
                </div>

                <hr className="mb-8" />

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-lg max-w-none"
                >
                    {paragraphs.map((paragraph, index) => (
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-4 text-lg leading-relaxed text-gray-800"
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </motion.article>

                {/* Comments Section */}
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Comments</h2>

                        {/* Comment Input */}
                        <div className="space-y-4 mb-6">
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-grow p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <motion.button
                                    onClick={addComment}
                                    disabled={!newComment.trim() || !userName.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-blue-500 text-white p-3 rounded-xl disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start space-x-4"
                                >
                                    <img
                                        src={`/api/placeholder/40/40?text=${comment.userName[0]}`}
                                        alt={comment.userName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="bg-gray-100 p-3 rounded-xl flex-grow">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold">{comment.userName}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(comment.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p>{comment.message}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-6 space-x-2">
                                {[...Array(pagination.totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setPagination(prev => ({
                                            ...prev,
                                            currentPage: index + 1
                                        }))}
                                        className={`h-2 w-2 rounded-full ${pagination.currentPage === index + 1
                                                ? 'bg-blue-500'
                                                : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;