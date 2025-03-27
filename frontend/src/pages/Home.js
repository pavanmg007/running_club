import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Container, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { getMarathons } from '../api/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

// Utility function to check if the token is valid
const isTokenValid = (token) => {
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp > currentTime; // Check if token is not expired
};

const Home = () => {
    const { user, token, logout } = useContext(AuthContext); // Assuming token is available in AuthContext
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isValidToken = isTokenValid(token);

    const { data, isLoading, error } = useQuery('marathons', getMarathons, {
        enabled: !!user && isValidToken, // Ensure user exists and token is valid
    });

    if (user && !isValidToken) {
        return (
            <Typography align="center" sx={{ mt: 4 }}>
                Your session has expired. Please log in again.
            </Typography>
        );
    }

    if (user && !isValidToken) {
        handleLogout();
    }

    if (isLoading) return <LoadingSpinner />;
    if (error) return <Typography color="error" align="center">Error: {error.message}</Typography>;

    return (
        <>
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
                {user ? (
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
                ) : (
                    <Typography align="center" sx={{ mt: 4 }}>
                        Please log in to view events.
                    </Typography>
                )}
            </Container>
        </>
    );
};

export default Home;