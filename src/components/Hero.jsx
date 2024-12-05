import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Breaking News</h1>
                <p>
                    Major Event Unfolds in India: Stay tuned for more updates as the story develops. Get real-time insights and the latest breaking news coverage.
                </p>
                <button className="hero-btn">Read More</button>
            </div>
        </section>
    );
};

export default Hero;

