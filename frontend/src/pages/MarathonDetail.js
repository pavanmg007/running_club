import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Button,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { getMarathonById, getParticipants, participate, cancelParticipation } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MarathonDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { user } = useContext(AuthContext);

    // Fetch marathon details
    const { data: marathonData, isLoading: marathonLoading, error: marathonError } = useQuery(
        ['marathon', id],
        () => getMarathonById(id)
    );

    // Fetch participants
    const { data: participantsData, isLoading: participantsLoading, error: participantsError } = useQuery(
        ['participants', id],
        () => getParticipants(id)
    );

    const participateMutation = useMutation((categoryId) => participate(id, { category_id: categoryId }), {
        onSuccess: () => queryClient.invalidateQueries(['participants', id]),
    });

    const cancelParticipationMutation = useMutation((categoryId) => cancelParticipation(id, { category_id: categoryId }), {
        onSuccess: () => queryClient.invalidateQueries(['participants', id]),
    });

    // State for countdown timer
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: false,
    });

    // Calculate time remaining until marathon date
    const calculateTimeRemaining = (marathonDate) => {
        const now = new Date();
        const marathonTime = new Date(marathonDate);
        const timeDiff = marathonTime - now;

        if (timeDiff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, isPast: false };
    };

    // Update timer every second
    useEffect(() => {
        if (marathonData?.data?.date) {
            const updateTimer = () => {
                const time = calculateTimeRemaining(marathonData.data.date);
                setTimeRemaining(time);
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [marathonData]);

    // Define hasParticipated with useMemo before any early returns
    const hasParticipated = useMemo(() => {
        console.log('memoizing hasParticipated');
        return (categoryId) => {
            return participantsData?.data?.allParticipants.some(
                (participant) => participant.userId === user.id && participant.categoryId === categoryId
            ) || false;
        };
    }, [participantsData, user]);

    // Early returns after all hooks are defined
    if (marathonLoading || participantsLoading) return <LoadingSpinner />;
    if (marathonError) return <Typography color="error" align="center">Error: {marathonError.message}</Typography>;
    if (participantsError) return <Typography color="error" align="center">Error: {participantsError.message}</Typography>;

    const marathon = marathonData.data;
    const categories = marathon.categories || [];
    const participants = participantsData?.data?.allParticipants || [];

    const handleParticipate = (categoryId) => {
        console.log('Participating in category:', categoryId);
        participateMutation.mutate(categoryId);
    };

    const handleCancelParticipation = (categoryId) => {
        console.log('Cancelling participation in category:', categoryId);
        cancelParticipationMutation.mutate(categoryId);
    };

    return (
        <Box sx={{ bgcolor: '#FFF3E0', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                className="hero-gradient"
                sx={{
                    py: 8,
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.1,
                        backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1350&q=80)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0,
                    },
                }}
            >
                <Container sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ fontWeight: 700, fontFamily: 'Poppins', color: 'white' }}
                        >
                            {marathon.name}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontFamily: 'Open Sans', color: 'rgba(255,255,255,0.9)', mb: 1 }}
                        >
                            Date : {new Date(marathon.date).toLocaleDateString()}
                        </Typography>
                        {marathon.location && (
                            <Typography
                                variant="body1"
                                sx={{ fontFamily: 'Open Sans', color: 'rgba(255,255,255,0.9)', mb: 1 }}
                            >
                                Location: {marathon.location}
                            </Typography>
                        )}
                        {/* Countdown Timer */}
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                px: 2,
                                py: 1,
                                mt: 1,
                                mb: 2,
                                mx: 5,
                            }}
                        >
                            {timeRemaining.isPast ? (
                                <Typography
                                    variant="body1"
                                    sx={{ fontFamily: 'Poppins', color: 'white', fontWeight: 600 }}
                                >
                                    Race Ended
                                </Typography>
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{ fontFamily: 'Poppins', color: 'white', fontWeight: 600 }}
                                >
                                    Race starts in:{' '}
                                    <Box component="span" sx={{ color: '#FFFFF' }}>
                                        {timeRemaining.days}
                                    </Box>{' '}
                                    Days
                                </Typography>
                            )}
                        </Box>
                        {marathon.registration_link && (
                            timeRemaining.isPast ? (
                                <Button
                                    variant="outlined"
                                    disabled={true}
                                    sx={{
                                        border: '2px solid white',
                                        borderRadius: '8px',
                                        color: '#FFFFFF',
                                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                                        fontFamily: 'Poppins',
                                        fontWeight: 600,
                                        px: 1.5,
                                        py: 0.7,
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                                            border: '2px solid white',
                                        },
                                        '&.Mui-disabled': {
                                            color: 'rgba(255, 255, 255, 0.5)',
                                            border: '2px solid rgba(255, 255, 255, 0.5)',
                                        },
                                    }}
                                >
                                    Register Now
                                </Button>
                            ) : (
                                <Link
                                    component="a"
                                    href={marathon.registration_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ textDecoration: 'none' }}
                                >
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            border: '2px solid white',
                                            borderRadius: '8px',
                                            color: '#FFFFFF',
                                            bgcolor: 'transparent',
                                            fontFamily: 'Poppins',
                                            fontWeight: 600,
                                            px: 1.5,
                                            py: 0.5,
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                border: '2px solid white',
                                            },
                                        }}
                                    >
                                        Register Now
                                    </Button>
                                    {user?.role === 'admin' && (
                                        <Link href={`/admin/marathon/edit/${id}`} sx={{ textDecoration: 'none' }}>
                                            <Button variant="outlined"
                                                sx={{
                                                    border: '2px solid rgba(255, 255, 255, 0.5)',
                                                    borderRadius: '8px',
                                                    color: 'rgba(255, 255, 255, 0.81)',
                                                    bgcolor: 'transparent',
                                                    fontFamily: 'Poppins',
                                                    fontWeight: 600,
                                                    px: 1.5,
                                                    py: 0.5,
                                                    mx: 2,
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                        border: '2px solid rgba(255, 255, 255, 0.5)',
                                                    },
                                                }}>
                                                Edit
                                            </Button>
                                        </Link>
                                    )}
                                </Link>
                            )
                        )}
                    </motion.div>
                </Container>
            </Box>

            {/* Main Content */}
            <Container sx={{ py: 6 }}>
                {/* Categories Overview Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Box sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
                        <Typography
                            variant="h5"
                            align="center"
                            gutterBottom
                            sx={{ color: '#F57C00', fontFamily: 'Poppins', mb: 3 }}
                        >
                            Available Categories
                        </Typography>
                        {categories.length > 0 ? (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00' }}>
                                                Category
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00', width: '50%' }}>
                                                Price
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell sx={{ fontFamily: 'Open Sans', color: '#2E7D32' }}>
                                                    {category.name}
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: 'Open Sans' }}>
                                                    ₹{parseFloat(category.price).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00' }}>
                                                Category
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00', width: '50%' }}>
                                                Price
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily: 'Open Sans', color: '#2E7D32' }}>
                                                No categories available
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </motion.div>

                {/* Sticky Marathon Info & Categories */}
                {!timeRemaining.isPast ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <Card
                            sx={{
                                maxWidth: 800,
                                mx: 'auto',
                                mb: 4,
                                bgcolor: 'white',
                                borderRadius: 3,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                position: 'sticky',
                                top: 20,
                                zIndex: 1,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ color: '#F57C00', fontFamily: 'Poppins', mb: 1 }}
                                >
                                    Join the Race
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        overflowX: 'auto',
                                        gap: 2,
                                        py: 2,
                                        '&::-webkit-scrollbar': {
                                            height: '8px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#F57C00',
                                            borderRadius: '4px',
                                        },
                                    }}
                                >
                                    {categories.length > 0 ? (
                                        categories.map((category) => {
                                            const isParticipated = hasParticipated(category.id);
                                            return (
                                                <motion.div
                                                    key={category.id}
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Chip
                                                        label={`${category.name}`}
                                                        onClick={() => {
                                                            if (isParticipated) {
                                                                handleCancelParticipation(category.id);
                                                            } else {
                                                                handleParticipate(category.id);
                                                            }
                                                        }}
                                                        disabled={participateMutation.isLoading || cancelParticipationMutation.isLoading}
                                                        icon={isParticipated ? <CheckCircleIcon color="white" /> : null}
                                                        onDelete={isParticipated ? () => handleCancelParticipation(category.id) : undefined}
                                                        sx={{
                                                            bgcolor: isParticipated ? 'primary.main' : '#757575',
                                                            color: 'white',
                                                            fontFamily: 'Poppins',
                                                            fontWeight: 600,
                                                            px: 2,
                                                            mx: 1,
                                                            py: 2.5,
                                                            borderRadius: 20,
                                                            '&:hover': {
                                                                bgcolor: isParticipated ? '#388E3C' : '#1B5E20',
                                                                cursor: 'pointer',
                                                            },
                                                        }}
                                                    />

                                                </motion.div>
                                            );
                                        })
                                    ) : (
                                        <Typography color="text.secondary">No categories available</Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <Card
                            sx={{
                                maxWidth: 800,
                                mx: 'auto',
                                mb: 4,
                                bgcolor: 'white',
                                borderRadius: 3,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                position: 'sticky',
                                top: 20,
                                zIndex: 1,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{ color: '#F57C00', fontFamily: 'Poppins', mb: 2 }}
                                    >
                                        Participation Closed
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Participants Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Box sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
                        <Typography
                            variant="h5"
                            align="center"
                            gutterBottom
                            sx={{ color: '#2E7D32', fontFamily: 'Poppins', mb: 3 }}
                        >
                            {timeRemaining.isPast ? 'Participated Runners' : 'Participating Runners'}
                        </Typography>
                        {participants.length > 0 ? (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00' }}>
                                                Name
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00', width: '50%' }}>
                                                Category
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {participants.map((participant) => (
                                            <TableRow key={participant.userId}>
                                                <TableCell sx={{ fontFamily: 'Open Sans', color: '#2E7D32' }}>
                                                    {participant.name}
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: 'Open Sans' }}>
                                                    {participant.category}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00' }}>
                                                Name
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00', width: '50%' }}>
                                                Category
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily: 'Open Sans', color: '#2E7D32' }}>
                                                {timeRemaining.isPast ? 'No runners participated' : 'No runners yet — be the first to join!'}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default MarathonDetail;