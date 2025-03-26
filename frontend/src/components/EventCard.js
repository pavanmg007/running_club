import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => (
    <motion.div
        whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
        transition={{ duration: 0.3 }}
    >
        <Card
            component={Link}
            to={`/marathons/${event.id}`}
            sx={{
                textDecoration: 'none',
                bgcolor: 'white',
                borderRadius: 9,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #2E7D32, #F57C00)',
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#212121' }}>
                    {event.name}
                </Typography>
                <Typography color="text.secondary">
                    {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    {event.categories.map((cat) => (
                        <Typography
                            key={cat.id}
                            variant="body2"
                            sx={{ display: 'inline-block', mr: 1, color: '#F57C00' }}
                        >
                            {cat.name}
                        </Typography>
                    ))}
                </Box>
            </CardContent>
        </Card>
    </motion.div>
);

export default EventCard;