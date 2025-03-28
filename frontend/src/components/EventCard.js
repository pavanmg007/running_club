import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
    // Event status logic
    const currentDate = new Date();
    const eventDate = new Date(event.date);
    const isEnded = eventDate.getTime() < currentDate.getTime() && eventDate.toDateString() !== currentDate.toDateString();
    const isToday = eventDate.toDateString() === currentDate.toDateString();
    const eventStatus = isEnded ? 'Ended' : isToday ? 'Today' : 'Upcoming';

    // Status-based styles using theme colors
    const statusStyles = {
        Ended: { backgroundColor: '#757575', color: '#fff' },
        Today: { backgroundColor: '#f57c00', color: '#fff' },
        Upcoming: { backgroundColor: '#2e7d32', color: '#fff' },
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
            transition={{ duration: 0.3 }}
        >
            <Card
                component={Link}
                to={`/marathon/${event.id}`}
                sx={{
                    textDecoration: 'none',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#fff3e0',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                    position: 'relative',
                    minWidth: '280px',
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                {/* Status Banner */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: statusStyles[eventStatus].backgroundColor,
                        color: statusStyles[eventStatus].color,
                        px: 1,
                        py: 0.5,
                        borderBottomLeftRadius: '12px',
                        fontWeight: 600,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}
                >
                    {eventStatus}
                </Box>

                <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                    {/* Event Name */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: '#212121', // Theme text color
                            mb: 1,
                            lineHeight: 1.2,
                            maxHeight: '48px', // Limit to 2 lines
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {event.name}
                    </Typography>

                    {/* Date */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#212121', // Theme text color
                            fontWeight: 500,
                            mb: 1.5,
                            opacity: 0.8, // Slight fade for contrast
                        }}
                    >
                        {eventDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </Typography>

                    {/* Categories */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                        }}
                    >
                        {event.categories && event.categories.length > 0 && event.categories[0].id !== null ? (
                            event.categories.map((cat) => (
                                <Chip
                                    key={cat.id}
                                    label={cat.name}
                                    size="small"
                                    sx={{
                                        bgcolor: '#f57c00', // Orange from theme
                                        color: '#fff',
                                        fontWeight: 500,
                                        borderRadius: '8px',
                                    }}
                                />
                            ))
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#212121',
                                    opacity: 0.6,
                                    fontStyle: 'italic',
                                }}
                            >
                                Categories not added
                            </Typography>
                        )}
                    </Box>
                </CardContent>

                {/* Bottom Accent */}
                <Box
                    sx={{
                        height: '6px',
                        background: 'linear-gradient(45deg, #2e7d32 0%, #f57c00 50%)',
                        borderTopLeftRadius: '4px',
                        borderTopRightRadius: '4px',
                    }}
                />
            </Card>
        </motion.div>
    );
};

export default EventCard;