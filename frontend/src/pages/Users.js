import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Grid,
    TextField,
    InputAdornment,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AuthContext } from '../contexts/AuthContext';
import { users, setAuthToken } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Users = () => {
    const { token, user, logout } = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user || !token) {
            logout();
        }
        setAuthToken(token);
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await users();
                setAllUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token, user, logout]);

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = allUsers.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" align="center" mb={4} color="primary" gutterBottom>
                Club Members
            </Typography>

            {/* Search Bar */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Members"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* User List */}
            <Grid container spacing={2}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user.id}>
                            <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', p: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                <ListItem sx={{ p: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.name}
                                        secondary={user.email}
                                    />
                                </ListItem>
                            </Box>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center">
                            No members found.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default Users;
