import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Container, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { getMarathons } from '../api/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import Helmet from '../components/Helmet';

const Home = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery('marathons', getMarathons, {
        onError: (err) => {
            if (err.response?.status === 401) {
                logout();
                navigate('/login');
            }
        }
    });

    if (isLoading) return <LoadingSpinner />;
    if (error) return <Typography color="error" align="center">Error: {error.message}</Typography>;

    return (
        <>
            <Helmet
                title="Home"
                description="Discover and join exciting running events with your community. Find upcoming marathons, register for races, and connect with fellow runners."
            />
            {/* Hero Section */}
            <Box
                className="hero-gradient"
                sx={{ py: 10, color: 'white', textAlign: 'center' }}
            >
                <Container>
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <Typography variant="h4" gutterBottom>
                            {user ? `Welcome, ${user.name}!` : 'Join the Runaರಂಗ'}
                        </Typography>
                        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Discover and join exciting running events with your community.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            {/* Events Section */}
            <Container sx={{ py: 4 }}>
                <>
                    <Typography variant="h5" align="center" py={6} gutterBottom sx={{ color: '#2E7D32' }}>
                        Upcoming Events
                    </Typography>
                    <Grid container spacing={3}>
                        {data?.data.map((event) => (
                            <Grid item xs={12} sm={6} md={4} key={event.id}>
                                <EventCard event={event} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            </Container>
        </>
    );
};

export default Home;