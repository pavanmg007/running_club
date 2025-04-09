import React, { useEffect, useState } from 'react';
import { getAllMarathonParticipants } from '../api/api';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';

const Participants = () => {
    const [marathons, setMarathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await getAllMarathonParticipants();
                setMarathons(response.data);
            } catch (err) {
                setError('Failed to fetch marathon participants.');
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, []);

    if (loading) return <Container><CircularProgress /></Container>;
    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container>
            <Typography variant="h4" align="center" color='primary' gutterBottom sx={{ marginTop: '20px' }}>
                Marathon Participants
            </Typography>
            {marathons.map((marathon, index) => (
                <div key={index} style={{ marginBottom: '30px' }}>
                    <Typography variant="h5" color='primary' marginLeft={2} gutterBottom>
                        {marathon.name}
                    </Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00', width: '50%' }}>Category</TableCell>
                                    <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F57C00', width: '50%' }}>Participants</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {marathon.categories.map((category, catIndex) => (
                                    <TableRow key={catIndex}>
                                        <TableCell sx={{ fontFamily: 'Open Sans', color: '#2E7D32', width: '50%' }}>{category.category}</TableCell>
                                        <TableCell sx={{ width: '50%' }}>
                                            {category.participants.map((participant, partIndex) => (
                                                <Typography key={partIndex} variant="body2" sx={{ fontFamily: 'Poppins', paddingBottom: '3px' }}>
                                                    {participant.userName}
                                                </Typography>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ))}
        </Container>
    );
};

export default Participants;
