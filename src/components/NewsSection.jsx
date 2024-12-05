import React from 'react';
import '../styles/NewsSection.css';

function NewsSection() {
    const newsArticles = [
        { title: 'Article 1', summary: 'Summary of article 1' },
        { title: 'Article 2', summary: 'Summary of article 2' },
        { title: 'Article 3', summary: 'Summary of article 3' },
        { title: 'Article 4', summary: 'Summary of article 4' },
        { title: 'Article 5', summary: 'Summary of article 5' },
        { title: 'Article 6', summary: 'Summary of article 6' },
    ];

    return (
        <section className="news-section">
            <h2>Top Stories</h2>
            <div className="news-grid">
                {newsArticles.map((article, index) => (
                    <div className="news-card" key={index}>
                        <h3>{article.title}</h3>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis et suscipit fugiat eveniet similique dolore.</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default NewsSection;
