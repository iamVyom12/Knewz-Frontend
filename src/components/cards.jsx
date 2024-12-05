import React from 'react';
import { Card, CardHeader, CardContent, CardMedia, Button, Typography } from '@mui/material';

const NewsCard = ({ article }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                title={article.title}
                subheader={article.category}
            />
            <CardMedia
                component="img"
                height="140"
                image={article.imageUrl}
                alt={article.title}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {article.shortContent}
                </Typography>
            </CardContent>
            <Button size="small" color="primary" href={article.url} target="_blank">
                Read More
            </Button>
        </Card>
    );
};

export default NewsCard;
