import React, { useState } from 'react';
import { Search, BookOpen, ChevronLeft } from 'lucide-react';

// Mock news data
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
        title: "Archaeological Discovery Reshapes Understanding of Ancient Civilization",
        category: "History",
        region: "Middle East",
        language: "English",
        shortContent: "Archaeologists have unearthed a vast ancient city in the Middle East, challenging current theories about early urban development.",
        fullContent: `Archaeologists have unearthed a vast ancient city in the Middle East, challenging current theories about early urban development. The discovery, dating back to approximately 4000 BCE, suggests that complex urban planning existed much earlier than previously thought.

The site, spanning over 100 hectares, contains well-preserved structures, including what appears to be an advanced water management system, public buildings, and evidence of sophisticated metallurgy. Artifacts found at the site indicate extensive trade networks and a complex social hierarchy.`,
        imageUrl: "https://picsum.photos/2000/998"
    },
    {
        id: 4,
        title: "Revolutionary Medical Treatment Shows Promise in Clinical Trials",
        category: "Health",
        region: "Europe",
        language: "English",
        shortContent: "A new gene therapy treatment has shown remarkable results in treating a previously incurable genetic disorder.",
        fullContent: `A new gene therapy treatment has shown remarkable results in treating a previously incurable genetic disorder. The breakthrough, developed by a team of international researchers, has successfully completed Phase III clinical trials with unprecedented success rates.

The treatment, which uses a modified virus to deliver corrective genes to patients, has shown complete remission in over 90% of participants. This marks a significant advancement in the field of genetic medicine and offers hope to millions of people worldwide affected by similar conditions.`,
        imageUrl: "/api/placeholder/800/400"
    }
];

const categories = ["All", "Environment", "Technology", "Health", "History"];
const regions = ["All", "Global", "North America", "Europe", "Middle East"];
const languages = ["All", "English"];

export default function NewsApp() {
    const [expandedArticle, setExpandedArticle] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedRegion, setSelectedRegion] = useState("All");
    const [selectedLanguage, setSelectedLanguage] = useState("All");

    const filteredNews = newsData.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
        const matchesRegion = selectedRegion === "All" || article.region === selectedRegion;
        const matchesLanguage = selectedLanguage === "All" || article.language === selectedLanguage;

        return matchesSearch && matchesCategory && matchesRegion && matchesLanguage;
    });

    const handleArticleClick = (id) => {
        setExpandedArticle(expandedArticle === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-screen-lg mx-auto">
                <div className="mb-6 space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search news..."
                            className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-2 shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-2 shadow-sm"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-2 shadow-sm"
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>

                        <select
                            className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-2 shadow-sm"
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            {languages.map(language => (
                                <option key={language} value={language}>{language}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {filteredNews.map(article => (
                        <div
                            key={article.id}
                            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                                expandedArticle === article.id ? 'col-span-full row-span-full' : ''
                            }`}
                            onClick={() => handleArticleClick(article.id)}
                        >
                            <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                                    <div className="flex space-x-2">
                                        <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded">{article.category}</span>
                                        <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">{article.region}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-2 md:line-clamp-2">{article.title}</h2>
                                {expandedArticle === article.id ? (
                                    <div className="space-y-4">
                                        <p className="text-gray-700 leading-relaxed">{article.fullContent}</p>
                                        <button
                                            className="mt-4 text-blue-600 flex items-center hover:text-blue-800 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedArticle(null);
                                            }}
                                        >
                                            <ChevronLeft size={16} className="mr-1" /> Collapse article
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-600 line-clamp-3">{article.shortContent}</p>
                                        <button className="mt-2 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
                                            <BookOpen size={16} className="mr-1" /> Read more
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}