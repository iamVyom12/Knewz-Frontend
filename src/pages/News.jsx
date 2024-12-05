import React, { useState } from 'react';
import VerticalNavbar from '../components/VerticalNavbar';
import AutocompleteSearchBar from '../components/SearchBar';
import '../styles/prototype.css';
import { User, ChevronRight, Bookmark } from 'lucide-react';
import Select from 'react-select';

export default function NewsPage() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isArticleExpanded, setIsArticleExpanded] = useState(false);
    const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(null);

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

    const languages = [
        { label: 'English', value: 'english' },
        { label: 'Hindi', value: 'hindi' },
        { label: 'Gujrati', value: 'gujrati' }
    ];

    const currentArticle = articles[currentArticleIndex];

    const handleNextArticle = () => {
        setCurrentArticleIndex((prevIndex) => (prevIndex + 1) % articles.length);
        setIsBookmarked(false);
    };

    const handleTranslate = (articleId) => {
        // Implement translation logic here
        console.log(`Translate article with ID: ${articleId}`);
    };

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
                            <Select
                                value={selectedLanguage}
                                onChange={setSelectedLanguage}
                                options={languages}
                                placeholder="Select Language"
                                className="w-48 text-black"
                                classNamePrefix="react-select"
                            />
                            <button
                                className="p-2 hover:bg-white/10 rounded-full text-white"
                                onClick={() => setIsBookmarked(!isBookmarked)}
                            >
                                <Bookmark
                                    size={24}
                                    className={isBookmarked ? "fill-current" : ""}
                                />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-full text-white">
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
                            <button
                                onClick={() => handleTranslate(currentArticle.id)}
                                className="ml-4 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Translate
                            </button>
                        </div>
                    </div>

                    {/* Next Article Button */}
                    <div className="absolute inset-y-0 right-4 flex items-center text-white">
                        <button
                            onClick={handleNextArticle}
                            className="p-2 bg-transparent rounded-full hover:bg-white/10 animate-click"
                        >
                            <ChevronRight size={35} />
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
}