import React, { useState } from 'react';

const CustomDropdown = ({ selectedLanguage, setSelectedLanguage, languages }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectLanguage = (language) => {
        setSelectedLanguage(language);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                className="flex items-center justify-between p-2 pl-4 pr-4 rounded-md bg-white/10 hover:bg-white/20 text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedLanguage ? selectedLanguage.label : 'Select Language'}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {isOpen && (
                <ul
                    className="absolute top-full left-0 w-full bg-white/10 p-2 rounded-md shadow-md"
                >
                    {languages.map((language) => (
                        <li
                            key={language.value}
                            className="p-2 hover:bg-white/20 cursor-pointer"
                            onClick={() => handleSelectLanguage(language)}
                        >
                            {language.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdown;