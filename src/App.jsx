import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import NewsArticle from "./pages/NewsArticles6.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import About  from './pages/About.jsx';
import AuthPage from './pages/Auth.jsx';
import ArticlePage from './pages/Article3.jsx';

function App() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <BrowserRouter>
            <main className="flex-1">
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/login" element={<AuthPage />} />
                    <Route exact path="/news" element={<NewsArticle />} />
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/profile" element={<UserProfile />} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                    <Route path="/article/:id" element={<ArticlePage />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;