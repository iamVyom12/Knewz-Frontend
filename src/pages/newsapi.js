const express = require('express');
const { default: axios } = require('axios');
const NewsAPI = require('newsapi');
const stopword = require('stopword');
const scraperMap = require('./scrapDict');
const url = require('url');

require('dotenv').config();

const app = express();
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const allowedSources = ['al-jazeera-english', 'bbc-news', 'breitbart-news', 'cbc-news', 'cnn', 'independant', 'msnbc', 'nbc-news', 'news-com-all', 'newsweek', 'rte', 'the-american-conservative', 'the-globe-and-mail', 'the-hindu', 'time', 'usa-today', 'vice-news'];

const getScraperForSource = (articleUrl) => {
    const parsedUrl = url.parse(articleUrl);
    const hostname = parsedUrl.hostname.replace(/^www\./, '');
    
    const matchedScraper = Object.keys(scraperMap).find(domain => 
        hostname.includes(domain)
    );

    return matchedScraper ? scraperMap[matchedScraper] : null;
};

const scrapeArticleContent = async (article, res) => {
    try {
        const scraper = getScraperForSource(article.url);
        
        if (!scraper) {
            console.warn(`No scraper found for ${article.url}`);
            res.write(JSON.stringify({
                type: 'article',
                data: article,
                status: 'no_scraper'
            }) + '\n');
            return;
        }

        const fullContent = await scraper(article.url);
        
        const processedArticle = {
            ...article,
            fullContent: fullContent
        };

        res.write(JSON.stringify({
            type: 'article',
            data: processedArticle,
            status: 'success'
        }) + '\n');
    } catch (error) {
        console.error(`Scraping error for ${article.url}:`, error.message);
        res.write(JSON.stringify({
            type: 'article',
            data: article,
            status: 'error',
            error: error.message
        }) + '\n');
    }
};

app.get('/news-stream', async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json-stream',
        'Transfer-Encoding': 'chunked'
    });

    const searchQuery = req.query.q || ''; 
    const sourcesQuery = req.query.sources || ''; 

    try {
        let response;

        if (searchQuery || sourcesQuery) {
            response = await newsapi.v2.everything({
                q: searchQuery,
                language: 'en',
                sortBy: 'relevancy',
                pageSize: 10,
                sources: sourcesQuery || allowedSources.join(','), 
            });
        } else {
            response = await newsapi.v2.topHeadlines({
                language: 'en',
                pageSize: 10,
                sources: allowedSources.join(','),
            });
        }

        const filteredArticles = response.articles
            .filter(article => 
                article.description &&
                article.description.trim() !== '' &&
                article.title &&
                article.title.trim() !== '' &&
                article.description.trim() !== '[Removed]'
            )
            .map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                content: article.content,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                source: article.source.name,
            }));

        // Process articles concurrently
        await Promise.all(filteredArticles.map(article => 
            scrapeArticleContent(article, res)
        ));

        res.write(JSON.stringify({
            type: 'end',
            status: 'complete'
        }) + '\n');
        res.end();

    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.write(JSON.stringify({
            type: 'error',
            message: 'Error fetching news.',
            details: error.message
        }) + '\n');
        res.end();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;