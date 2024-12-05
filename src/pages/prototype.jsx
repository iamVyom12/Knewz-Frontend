import React, { useState } from 'react';
import { User, ChevronRight, Bookmark, Globe } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import VerticalNavbar from '../components/VerticalNavbar';
import AutocompleteSearchBar from '../components/SearchBar';

// Language Dropdown Component
function LanguageDropdown() {
    const languages = ['English', 'Español', 'Français', '中文', 'العربية'];

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-2 hover:bg-white/10 rounded-full text-white">
                <Globe size={24} />
            </Menu.Button>
            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                        {languages.map((language) => (
                            <Menu.Item key={language}>
                                {({ active }) => (
                                    <button
                                        className={`${
                                            active ? 'bg-gray-700 text-white' : 'text-gray-200'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {language}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}

// Profile Page Component
function ProfilePage({ onClose }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Back to News
                    </button>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-6">
                        <div className="w-24 h-24 bg-gray-600 rounded-full mr-6"></div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">John Doe</h2>
                            <p className="text-gray-400">Tech enthusiast & news junkie</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Reading Preferences</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Technology</span>
                                    <span className="text-blue-400">85%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Science</span>
                                    <span className="text-blue-400">70%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>World News</span>
                                    <span className="text-blue-400">65%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Account Info</h3>
                            <div className="space-y-2">
                                <p><span className="text-gray-400">Email:</span> john.doe@example.com</p>
                                <p><span className="text-gray-400">Member since:</span> January 2023</p>
                                <p><span className="text-gray-400">Articles read:</span> 1,234</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Bookmarked Articles</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="border-b border-gray-700 pb-4 last:border-0">
                                <h4 className="text-lg font-medium mb-2">Article Title {index + 1}</h4>
                                <p className="text-gray-400 mb-2">Short preview of the article content...</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Bookmarked 2 days ago</span>
                                    <button className="text-blue-400 hover:text-blue-300">Read Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main NewsPage Component
export default function NewsPage() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isArticleExpanded, setIsArticleExpanded] = useState(false);
    const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const articles = [
        {
            id: 1,
            title: "Major Technology Breakthrough in AI Development",
            shortInfo: "Researchers announce groundbreaking advancement in artificial intelligence, promising to revolutionize...",
            fullContent: `In a significant leap forward for artificial intelligence, researchers at a leading tech institute
            have developed a new neural network architecture that promises to revolutionize how AI systems learn and adapt.
            This breakthrough could have far-reaching implications across various sectors, from healthcare to autonomous vehicles.

            Early tests show that the new system can process complex tasks up to 100 times faster than current models while
            using only a fraction of the computational power. This development not only promises more efficient AI systems
            but also makes advanced AI more accessible to researchers and developers worldwide.`,
            thumbnail: "https://picsum.photos/2000/1000"
        },
        {
            id: 2,
            title: "New Renewable Energy Sources Discovered",
            shortInfo: "Scientists have discovered new renewable energy sources that could significantly reduce our reliance on fossil fuels...",
            fullContent: `In a groundbreaking discovery, scientists have identified new renewable energy sources that have the potential to
            significantly reduce our reliance on fossil fuels. These sources are not only more efficient but also more environmentally friendly.

            The discovery could lead to a new era of clean energy, with the potential to transform industries and reduce carbon emissions
            on a global scale. Researchers are now working on ways to harness these sources and make them commercially viable.`,
            thumbnail: "https://picsum.photos/2000/1001"
        },
        {
            id: 3,
            title: "Space Exploration Reaches New Heights",
            shortInfo: "Astronauts aboard the latest space mission have made a historic discovery that could change our understanding of the universe...",
            fullContent: `Astronauts aboard the latest space mission have made a historic discovery that could change our understanding of the universe.
            The crew has found evidence of a new celestial body that challenges existing theories about the formation of galaxies and stars.

            The discovery has sparked excitement among scientists and space enthusiasts worldwide, with many hailing it as a major milestone
            in space exploration. Researchers are now analyzing the data to learn more about this mysterious object and its implications.`,
            thumbnail: "https://picsum.photos/2000/1002"
        }
    ];

    const currentArticle = articles[currentArticleIndex];

    const handleNextArticle = () => {
        setCurrentArticleIndex((prevIndex) => (prevIndex + 1) % articles.length);
        setIsBookmarked(false);
    };

    if (showProfile) {
        return <ProfilePage onClose={() => setShowProfile(false)} />;
    }

    return (
        <div className="h-screen">
            <article
                className={`relative h-full transition-all duration-300 ease-in-out
                ${isNavOpen ? 'ml-64' : 'ml-16'}`}
            >
                {/* Background Image */}
                <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500
                    ${isArticleExpanded ? 'opacity-30' : 'opacity-100'}`}
                    style={{
                        backgroundImage: `url(${currentArticle.thumbnail})`,
                    }}
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
                </div>

                {/* Content Container */}
                <div className="relative h-full flex flex-col">
                    {/* Top Navigation */}
                    <div className="flex justify-between items-center p-4 z-10">
                        <div className="flex items-center">
                            <VerticalNavbar />
                        </div>
                        <div className="flex-grow mx-8">
                            <AutocompleteSearchBar query={searchQuery} setQuery={setSearchQuery}/>
                        </div>
                        <div className="flex items-center space-x-2">
                            <LanguageDropdown />
                            <button
                                className="p-2 hover:bg-white/10 rounded-full text-white"
                                onClick={() => setIsBookmarked(!isBookmarked)}
                            >
                                <Bookmark
                                    size={24}
                                    className={isBookmarked ? "fill-current" : ""}
                                />
                            </button>
                            <button
                                className="p-2 hover:bg-white/10 rounded-full text-white"
                                onClick={() => setShowProfile(true)}
                            >
                                <User size={24}/>
                            </button>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className={`flex-grow flex flex-col justify-end transition-all duration-500
                        ${isArticleExpanded ? 'pb-16' : 'pb-32'}`}>
                        <div className="p-8 text-white">
                            <h1 className={`font-bold transition-all duration-500 ${
                                isArticleExpanded ? 'text-3xl mb-4 text-black' : 'text-5xl mb-6'
                            }`}>
                                {currentArticle.title}
                            </h1>
                            <p className={`text-lg mb-4 transition-colors duration-500 ${
                                isArticleExpanded ? 'text-black' : 'text-gray-200'
                            }`}>
                                {isArticleExpanded ? currentArticle.fullContent : currentArticle.shortInfo}
                            </p>
                            <button
                                onClick={() => setIsArticleExpanded(!isArticleExpanded)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                {isArticleExpanded ? 'Show less' : '... Read more'}
                            </button>
                        </div>
                    </div>

                    {/* Next Article Button */}
                    <div className="absolute inset-y-0 right-4 flex items-center text-white">
                        <button
                            onClick={handleNextArticle}
                            className="p-2 bg-transparent rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight size={35} />
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
}