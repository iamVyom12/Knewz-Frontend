import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Volume2, ExternalLink, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VerticalNavbar from '../pages/VerticalNavbar';

const categories = ["All", "Business", "Entertainment", "general", "Health", "Science", "Sports", "Technology"];
const regions = ["All", "us", "in", "ca", "au"];
const languages = ["All", "English"];
const speeds = [0.5, 1, 1.5, 2];

export default function NewsApp() {
    const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(currentArticleIndex === 0);

    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [appliedCategory, setAppliedCategory] = useState("All");
    const [appliedRegion, setAppliedRegion] = useState("All");
    const [selectedRegion, setSelectedRegion] = useState("All");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [selectedSources, setSelectedSources] = useState('');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [readingSpeed, setReadingSpeed] = useState(1);
    const searchPanelRef = useRef(null);
    const speechSynthesisRef = useRef(null);
    const [voices, setVoices] = useState([]);
    const [selectedVoiceName, setSelectedVoiceName] = useState('');
    const utteranceRef = useRef(null);
    const [highlightedText, setHighlightedText] = useState('');
    const [currentWord, setCurrentWord] = useState('');
    const [processedArticles, setProcessedArticles] = useState(new Set()); // Track processed article IDs
    const [articleQueue, setArticleQueue] = useState([]); // Queue for ordering articles
    const [isInitialLoading, setIsInitialLoading] = useState(true); // Initial loading state
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Utility function to parse stream data
    const parseStreamData = (text) => {
        return text.split('\n')
            .filter(line => line.trim())
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    console.error('Error parsing line:', e);
                    return null;
                }
            })
            .filter(item => item !== null);
    };

    // In NewsArticles4.jsx
    const fetchNews = async () => {
        try {
            setIsLoadingMore(true);

            // Build query parameters
            const queryParams = new URLSearchParams({
                q: appliedSearchTerm.trim(),
                sources: selectedSources,
                categoryQuery: appliedCategory !== "All" ? appliedCategory.toLowerCase() : "",
                countryQuery: appliedRegion !== "All" ? appliedRegion.toLowerCase() : "", // Trim whitespace
            });

            Array.from(queryParams.entries()).forEach(([key, value]) => {
                if (!value) {
                    queryParams.delete(key);
                }
            });

            // Make the API request with search parameter
            const response = await fetch(`http://192.168.231.243:3000/new/news-stream?${queryParams}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    if (buffer) {
                        const finalChunks = parseStreamData(buffer);
                        processArticles(finalChunks);
                    }
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                if (lines.length > 0) {
                    const chunks = parseStreamData(lines.join('\n'));
                    processArticles(chunks);
                }
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setIsInitialLoading(false);
            setIsLoadingMore(false);
        }
    };


    const processArticles = (chunks) => {
        const newArticles = chunks
            .filter(chunk => chunk.type === 'article' && chunk.status === 'success')
            .map(chunk => chunk.data)
            .map((article) => ({
                id: article.url, // Use URL as unique identifier
                title: article.title,
                category: 'News',
                region: 'Global',
                language: 'English',
                fullContent: article.fullContent,
                summary: article.summary,
                imageUrl: article.urlToImage,
                sourceUrl: article.url,
                source: article.source,
                timestamp: Date.now() // Add timestamp for ordering
            }))
            .filter(article => !processedArticles.has(article.id)); // Filter out already processed articles

        if (newArticles.length > 0) {
            // Update processed articles set
            const updatedProcessedArticles = new Set(processedArticles);
            newArticles.forEach(article => updatedProcessedArticles.add(article.id));
            setProcessedArticles(updatedProcessedArticles);

            // Update article queue
            setArticleQueue(prevQueue => [...prevQueue, ...newArticles].sort((a, b) => a.timestamp - b.timestamp));

            // Update articles state
            setArticles(prevArticles => {
                const updatedArticles = [...prevArticles];
                newArticles.forEach(article => {
                    const index = updatedArticles.findIndex(a => a.id === article.id);
                    if (index === -1) {
                        updatedArticles.push(article);
                    }
                });
                return updatedArticles.sort((a, b) => a.timestamp - b.timestamp);
            });

            // Update loading states
            setIsInitialLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        setIsInitialLoading(true);
        setArticles([]); // Clear articles when filters change
        setProcessedArticles(new Set()); // Reset processed articles
        setArticleQueue([]); // Reset article queue
        fetchNews();
    }, [appliedSearchTerm, appliedCategory, appliedRegion, selectedSources, selectedLanguage]);

    console.log(articles);

    // Compute filtered news based on current filters
    const filteredNews = articles;

    console.log(filteredNews);

    const currentArticle = filteredNews[currentArticleIndex];

    console.log(currentArticle);

    useEffect(() => {
        setIsLoading(articles.length === 0);
    }, [articles]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchPanelRef.current && !searchPanelRef.current.contains(event.target)) {
                setIsFilterMenuOpen(false);
            }
        };

        if (isFilterMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterMenuOpen]);

    const nextArticle = () => {
        if (currentArticleIndex < filteredNews.length - 1) {
            setCurrentArticleIndex(prev => prev + 1);
        }
    };

    const previousArticle = () => {
        if (currentArticleIndex > 0) {
            setCurrentArticleIndex(prev => prev - 1);
        }
    };

    const selectedVoice = voices.find((voice) => voice.name === selectedVoiceName);

    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const [pausedPosition, setPausedPosition] = useState(0);
    const fullTextRef = useRef(null);

    const LoadingSkeleton = ({ isInitial }) => (
        <div className={`flex h-full ${isInitial ? 'w-full' : 'w-1/2'}`}>
            <div className="w-1/2 bg-gray-200 animate-pulse"></div>
            <div className="w-1/2 p-12">
                <div className="h-12 bg-gray-200 animate-pulse mb-6"></div>
                <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    const handleTextToSpeech = () => {
        if (!currentArticle || !selectedVoice) return;

        if (!isPlaying) {
            // Cancel any ongoing speech just to be safe
            window.speechSynthesis.cancel();

            // Store the full text reference
            fullTextRef.current = currentArticle.summary;

            // Create new utterance
            const utterance = new SpeechSynthesisUtterance(currentArticle.summary);
            utterance.voice = selectedVoice;
            utterance.rate = readingSpeed;

            // If we have a paused position, start from there
            if (pausedPosition > 0) {
                const remainingText = currentArticle.summary.substring(pausedPosition);
                utterance.text = remainingText;
            }

            // Store reference to current utterance
            utteranceRef.current = utterance;

            // Add word boundary handler
            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    // Get the full text and calculate absolute position
                    const fullText = fullTextRef.current;
                    const absolutePosition = pausedPosition + event.charIndex;

                    // Get the word at the current position
                    const word = utterance.text.substring(
                        event.charIndex,
                        utterance.text.indexOf(' ', event.charIndex) === -1
                            ? utterance.text.length
                            : utterance.text.indexOf(' ', event.charIndex)
                    );

                    // Calculate word index in the full text
                    const textUpToCursor = fullText.substring(0, absolutePosition);
                    const wordIndex = textUpToCursor.split(/\s+/).length - 1;

                    setCurrentWord(word);
                    setCurrentWordIndex(wordIndex);
                }
            };

            // Add end event handler
            utterance.onend = () => {
                setIsPlaying(false);
                utteranceRef.current = null;
                setCurrentWord('');
                setCurrentWordIndex(-1);
                setPausedPosition(0);
                fullTextRef.current = null;
            };

            // Start speaking
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        } else {
            // When pausing, store the current position
            if (utteranceRef.current) {
                const currentChar = utteranceRef.current.text.indexOf(currentWord);
                if (currentChar !== -1) {
                    setPausedPosition(pausedPosition + currentChar);
                }
            }

            // Stop speaking
            window.speechSynthesis.cancel();
            utteranceRef.current = null;
            setIsPlaying(false);
        }
    };

    const HighlightedText = ({ textContent, highlightedWord, currentWordIndex }) => {
        if (!textContent) return null;

        const text = String(textContent);
        const words = text.split(/(\s+)/);

        return (
            <div className="text-lg text-gray-700 leading-relaxed mb-8">
                {words.map((word, index) => {
                    const isHighlighted =
                        word.trim() === highlightedWord?.trim() &&
                        Math.floor(index / 2) === currentWordIndex;

                    return (
                        <span
                            key={index}
                            className={`${isHighlighted
                                ? 'bg-blue-200 transition-colors duration-200'
                                : ''
                                }`}
                        >
                            {word}
                        </span>
                    );
                })}
            </div>
        );
    };

    const handleSpeedChange = (speed) => {
        setReadingSpeed(speed);
        if (isPlaying && utteranceRef.current) {
            // Store current position before changing speed
            const currentChar = utteranceRef.current.text.indexOf(currentWord);
            if (currentChar !== -1) {
                setPausedPosition(pausedPosition + currentChar);
            }

            // Cancel current speech
            window.speechSynthesis.cancel();

            // Create new utterance with updated speed
            const remainingText = fullTextRef.current.substring(pausedPosition);
            const newUtterance = new SpeechSynthesisUtterance(remainingText);
            newUtterance.voice = selectedVoice;
            newUtterance.rate = speed;

            // Add word boundary handler (using the same handler as original utterance)
            newUtterance.onboundary = utteranceRef.current.onboundary;
            newUtterance.onend = utteranceRef.current.onend;

            // Store reference and start speaking
            utteranceRef.current = newUtterance;
            window.speechSynthesis.speak(newUtterance);
        }
    };

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                setCurrentWord('');
                setCurrentWordIndex(-1);
                setPausedPosition(0);
                fullTextRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        // Reset all speech-related state when article changes
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
        setCurrentWord('');
        setCurrentWordIndex(-1);
        setPausedPosition(0);
        fullTextRef.current = null;
    }, [currentArticleIndex]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Set default voice only if no voice is selected
            if (availableVoices.length > 0 && !selectedVoiceName) {
                setSelectedVoiceName(availableVoices[0].name);
            }
        };

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        }
    }, [selectedVoiceName]);

    const navigate = useNavigate();

    const handleArticleClick = (article) => {
        navigate(`/article/${encodeURIComponent(article.id)}`, {
            state: { article }
        });
    };

    return (
        <div className="h-screen bg-gray-100 overflow-hidden relative">
            <VerticalNavbar onSearchClick={() => setIsFilterMenuOpen(true)} />

            {/* Left Navigation Button */}
            <div className="fixed left-8 top-1/2 transform -translate-y-1/2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={previousArticle}
                    disabled={currentArticleIndex === 0}
                    className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${currentArticleIndex === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                        }`}
                >
                    <ChevronLeft size={24} className="text-blue-600" />
                </motion.button>
            </div>

            {/* Right Navigation Button */}
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextArticle}
                    disabled={currentArticleIndex === filteredNews.length - 1}
                    className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${currentArticleIndex === filteredNews.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                        }`}
                >
                    <ChevronRight size={24} className="text-blue-600" />
                </motion.button>
            </div>

            {/* Search Button */}
            {!isFilterMenuOpen && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className="fixed top-4 right-4 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
                >
                    <Search size={24} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                </motion.button>
            )}


            {/* Filter Menu */}
            <AnimatePresence>
                {isFilterMenuOpen && (
                    <motion.div
                        ref={searchPanelRef}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-4 right-4 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Search articles..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
                                    <select
                                        value={selectedVoiceName}
                                        onChange={(e) => setSelectedVoiceName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {voices.map((voice, index) => (
                                            <option key={index} value={voice.name}>
                                                {voice.name} ({voice.lang})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Add this just before closing the p-6 div */}
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        setAppliedSearchTerm(searchTerm);
                                        setAppliedCategory(selectedCategory);
                                        setAppliedRegion(selectedRegion);
                                        setIsFilterMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="h-screen w-full flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {isInitialLoading ? (
                        <motion.div
                            key="initial-loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-7xl w-full h-full"
                        >
                            <LoadingSkeleton isInitial={true} />
                        </motion.div>
                    ) : articles.length > 0 ? (
                        <motion.div
                            key={articles[currentArticleIndex]?.id || 'content'}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-7xl w-full h-full flex"
                        >

                            {/* Left Side - Image */}
                            <div className="w-1/2 h-full relative bg-gray-900">
                                <img
                                    src={currentArticle.imageUrl}
                                    alt={currentArticle.title}
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute top-8 left-8 space-y-4">
                                    <div className="flex space-x-2">
                                        <motion.span
                                            whileHover={{ scale: 1.05 }}
                                            className="text-sm bg-blue-500 text-white px-4 py-2 rounded-full font-medium shadow-lg"
                                        >
                                            {currentArticle.category}
                                        </motion.span>
                                        <motion.span
                                            whileHover={{ scale: 1.05 }}
                                            className="text-sm bg-green-500 text-white px-4 py-2 rounded-full font-medium shadow-lg"
                                        >
                                            {currentArticle.region}
                                        </motion.span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Content */}
                            <div className="w-1/2 h-full p-12 flex flex-col text-left">
                                <h1 className="text-4xl font-bold mb-6">{currentArticle.title}</h1>
                                <div className="flex-grow overflow-y-auto pr-4 styled-scrollbar">
                                    <HighlightedText
                                        textContent={currentArticle.summary}
                                        highlightedWord={currentWord}
                                        currentWordIndex={currentWordIndex}
                                    />

                                    {/* Source Information */}
                                    <div className="mt-8 p-4 border-t border-gray-200">
                                        <button
                                            onClick={() => handleArticleClick(currentArticle)}
                                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <span className="font-medium">Read Full Article</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Audio Controls */}
                                <div className="flex items-center justify-between space-x-6 pt-6 border-t">
                                    <div className="flex items-center space-x-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleTextToSpeech}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                                        >
                                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                            <span className="font-medium">
                                                {isPlaying ? 'Pause' : 'Read it for me'}
                                            </span>
                                        </motion.button>

                                        <div className="flex items-center space-x-2">
                                            {speeds.map((speed) => (
                                                <motion.button
                                                    key={speed}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleSpeedChange(speed)}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${readingSpeed === speed
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {speed}x
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isLoadingMore && <LoadingSkeleton isInitial={false} />}

                        </motion.div>
                    ) : (
                        <motion.div
                            key="no-results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-gray-600"
                        >
                            No articles found. Try adjusting your filters.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .styled-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
                }
                .styled-scrollbar::-webkit-scrollbar {
                    width: 1px; /* Changed from 6px to 1px */
                }
                .styled-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .styled-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(155, 155, 155, 0.5);
                    border-radius: 20px;
                    border: transparent;
                }
            `}</style>
        </div>
    );
}
