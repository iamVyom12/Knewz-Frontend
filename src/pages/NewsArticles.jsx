import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Volume2, ExternalLink, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import VerticalNavbar from '../components/VerticalNavbar';

const newsData = [
    {
        id: 1,
        title: "Global Climate Summit Reaches Historic Agreement",
        category: "Environment",
        region: "Global",
        language: "English",
        shortContent: "World leaders have reached a groundbreaking agreement at the latest climate summit, pledging to reduce carbon emissions significantly by 2030.",
        fullContent: `World leaders have reached a groundbreaking agreement at the latest climate summit, pledging to reduce carbon emissions significantly by 2030. The historic pact, signed by over 190 countries, marks a turning point in global climate action. The agreement includes concrete steps to phase out fossil fuels, increase renewable energy adoption, and provide financial support to developing nations for their transition to clean energy.

Environmental experts have praised the deal as a crucial step forward, though some activists argue that even more aggressive measures are needed. The summit also saw unprecedented cooperation between major industrial nations and developing countries, bridging long-standing divides on climate responsibility. Implementation plans are already being developed, with a focus on technological innovation and green job creation.`,
        imageUrl: "https://picsum.photos/2000/1000"
    },
    {
        id: 2,
        title: "Breakthrough in Quantum Computing Announced",
        category: "Technology",
        region: "North America",
        language: "English",
        shortContent: "Scientists have achieved a major milestone in quantum computing, successfully maintaining quantum coherence for over an hour.",
        fullContent: `Scientists have achieved a major milestone in quantum computing, successfully maintaining quantum coherence for over an hour at room temperature. This breakthrough, announced by a team of researchers from leading institutions, could revolutionize the field of quantum computing and bring practical applications closer to reality.

The achievement overcomes one of the biggest obstacles in quantum computing: the extremely short lifespan of quantum states. By using a novel approach involving synthetic diamonds and carefully controlled magnetic fields, the team was able to create stable quantum bits (qubits) that remain coherent for unprecedented durations.`,
        imageUrl: "https://picsum.photos/2000/999"
    },
    {
        id: 3,
        title: "New Vaccine Shows Promising Results Against Malaria",
        category: "Health",
        region: "Global",
        language: "English",
        shortContent: "A new vaccine candidate has demonstrated high efficacy in early trials, raising hopes for the fight against malaria.",
        fullContent: `A new vaccine candidate has demonstrated high efficacy in early trials, raising hopes for the fight against malaria. The vaccine, developed by a team of researchers in collaboration with global health organizations, has shown an efficacy rate of over 90% in preventing severe cases of the disease.
        
Malaria, a mosquito-borne illness that affects millions of people worldwide, has been a major public health challenge for decades. The new vaccine leverages cutting-edge technology to target specific proteins in the malaria parasite, providing robust protection against infection. If further trials prove successful, the vaccine could be a game-changer in the fight against malaria.`,
        imageUrl: "https://picsum.photos/2000/998"
    },
    {
        id: 4,
        title: "New Discovery Sheds Light on Ancient Civilization",
        category: "History",
        region: "Middle East",
        languages: "English",
        shortContent: "Archaeologists have uncovered a trove of artifacts that offer new insights into the daily life of an ancient civilization.",
        fullContent: `Archaeologists have uncovered a trove of artifacts that offer new insights into the daily life of an ancient civilization. The discovery, made at a dig site in the Middle East, includes pottery, tools, and other items that shed light on the cultural practices and technological advancements of the ancient people.

The artifacts are believed to date back over 3,000 years, providing a glimpse into a thriving civilization that once inhabited the region. Researchers are working to analyze the findings and piece together the story of this ancient society, which is expected to contribute significantly to our understanding of the region's history.`,
        imageUrl: "https://picsum.photos/2000/997"
    }
];

const categories = ["All", "Environment", "Technology", "Health", "History"];
const regions = ["All", "Global", "North America", "Europe", "Middle East"];
const languages = ["All", "English"];
const speeds = [0.5, 1, 1.5, 2];

export default function NewsApp() {
    const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedRegion, setSelectedRegion] = useState("All");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
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

    const filteredNews = newsData.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
        const matchesRegion = selectedRegion === "All" || article.region === selectedRegion;
        const matchesLanguage = selectedLanguage === "All" || article.language === selectedLanguage;
        return matchesSearch && matchesCategory && matchesRegion && matchesLanguage;
    });

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

    const currentArticle = filteredNews[currentArticleIndex];

    const selectedVoice = voices.find((voice) => voice.name === selectedVoiceName);

    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const [pausedPosition, setPausedPosition] = useState(0); 
    const fullTextRef = useRef(null);

    const handleTextToSpeech = () => {
        if (!currentArticle || !selectedVoice) return;

        if (!isPlaying) {
            // Cancel any ongoing speech just to be safe
            window.speechSynthesis.cancel();

            // Store the full text reference
            fullTextRef.current = currentArticle.fullContent;

            // Create new utterance
            const utterance = new SpeechSynthesisUtterance(currentArticle.fullContent);
            utterance.voice = selectedVoice;
            utterance.rate = readingSpeed;

            // If we have a paused position, start from there
            if (pausedPosition > 0) {
                const remainingText = currentArticle.fullContent.substring(pausedPosition);
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

    const HighlightedText = ({ text, highlightedWord }) => {
        if (!text) return null;

        // Split text into words while preserving spaces
        const words = text.split(/(\s+)/);

        return (
            <div className="text-lg text-gray-700 leading-relaxed mb-8">
                {words.map((word, index) => {
                    // Only highlight if this is the exact word at the current index
                    const isHighlighted = 
                        word.trim() === highlightedWord.trim() && 
                        Math.floor(index / 2) === currentWordIndex;

                    return (
                        <span
                            key={index}
                            className={`${
                                isHighlighted
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

    return (
        <div className="h-screen bg-gray-100 overflow-hidden relative">
            {/* <VerticalNavbar onSearchClick={() => setIsFilterMenuOpen(true)}/> */}

            {/* Left Navigation Button */}
            <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50">
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
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
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
                    className="fixed top-4 right-4 z-50 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
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
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search articles..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={20} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                                    <select
                                        value={selectedRegion}
                                        onChange={(e) => setSelectedRegion(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {regions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {languages.map(language => (
                                            <option key={language} value={language}>{language}</option>
                                        ))}
                                    </select>
                                </div>
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="h-screen w-full flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {currentArticle && (
                        <motion.div
                            key={currentArticle.id}
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
                                    {/* Replace this paragraph */}
                                    {/* <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {currentArticle.fullContent}
        </p> */}

                                    {/* With this new component */}
                                    <HighlightedText
                                        text={currentArticle.fullContent}
                                        highlightedWord={currentWord}
                                        currentWordIndex={currentWordIndex}
                                    />

                                    {/* Source Information */}
                                    <div className="mt-8 p-4 border-t border-gray-200">
                                        <a
                                            href={currentArticle.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <span className="font-medium">Source: {currentArticle.source}</span>

                                        </a>
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
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