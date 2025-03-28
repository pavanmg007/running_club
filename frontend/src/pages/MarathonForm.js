import React, { useState, useEffect, useContext } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    IconButton,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from 'react-query';
import { createMarathon, updateMarathon, getMarathonById, setAuthToken } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MarathonForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [marathonData, setMarathonData] = useState({
        name: '',
        date: '',
        location: '',
        registration_link: '',
        categories: [],
        is_private: true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const validCategoryNames = ['3K Run', '5K Run', '7K Run', '10K Run', '15K Run', 'Half Marathon', 'Full Marathon'];
    const { token } = useContext(AuthContext);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    setAuthToken(token);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            setIsEditMode(true);
            getMarathonById(id)
                .then(res => {
                    const marathon = res.data;
                    setMarathonData({
                        name: marathon.name,
                        date: marathon.date.split('T')[0],
                        location: marathon.location,
                        registration_link: marathon.registration_link,
                        categories: marathon.categories || [],
                        is_private: marathon.is_private
                    });
                })
                .catch(err => console.error('Error fetching marathon:', err))
                .finally(() => setIsLoading(false));
        }
    }, [id]);


    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setMarathonData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (index, event) => {
        const { name, value } = event.target;
        setMarathonData(prevData => {
            const newCategories = [...prevData.categories];
            newCategories[index] = { ...newCategories[index], [name]: value };
            return { ...prevData, categories: newCategories };
        });
    };

    const addCategory = () => {
        setMarathonData(prevData => ({
            ...prevData,
            categories: [...prevData.categories, { name: '', price: '' }]
        }));
    };

    const removeCategory = (index) => {
        setMarathonData(prevData => ({
            ...prevData,
            categories: prevData.categories.filter((_, i) => i !== index)
        }));
    };

    const mutation = useMutation(
        (data) => {
            if (isEditMode) {
                console.log('Updating marathon:', id, data);
                return updateMarathon(id, data);
            } else {
                return createMarathon(data);
            }
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('marathons');
                setSuccessMessage(isEditMode ? 'Marathon updated successfully!' : 'Marathon created successfully!');
                setErrorMessage(null);
                // Update marathonData with the response from the server
                if (isEditMode) {
                    setMarathonData(prevData => ({
                        ...prevData,
                        categories: data.data.categories || []
                    }));
                }
                window.scrollTo(0, 0);
            },
            onError: (error) => {
                console.error('Error:', error);
                setErrorMessage(error.response?.data?.error || 'An error occurred.');
                setSuccessMessage(null);
                window.scrollTo(0, 0);
            },
        }
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate(marathonData);
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Typography variant="h4" align="center" color='primary' gutterBottom>
                    {isEditMode ? 'Edit Event' : 'Add New Event'}
                </Typography>
                {successMessage && (
                    <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name"
                        name="name"
                        value={marathonData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Date"
                        type="date"
                        name="date"
                        value={marathonData.date}
                        onChange={handleInputChange}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Location"
                        name="location"
                        value={marathonData.location}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Registration Link"
                        name="registration_link"
                        value={marathonData.registration_link}
                        onChange={handleInputChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={marathonData.is_private}
                                onChange={handleInputChange}
                                name="is_private"
                            />
                        }
                        label="Private Marathon"
                    />
                    <Typography variant="h6" my={2}>Categories</Typography>
                    {marathonData.categories.map((category, index) => (
                        <Grid container spacing={2} my={1} key={index} alignItems="center">
                            <Grid item xs={5}>
                                <FormControl fullWidth>
                                    <InputLabel>Category Name</InputLabel>
                                    <Select
                                        name="name"
                                        value={category.name}
                                        label="Category Name"
                                        onChange={(e) => handleCategoryChange(index, e)}
                                    >
                                        {validCategoryNames.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    name="price"
                                    value={category.price}
                                    onChange={(e) => handleCategoryChange(index, e)}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={() => removeCategory(index)} color="error" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid container spacing={2} my={1} justifyContent={'space-evenly'}>
                        <Button onClick={addCategory} sx={{ mt: 2 }}>Add Category</Button>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            {isEditMode ? 'Update Marathon' : 'Create Marathon'}
                        </Button>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default MarathonForm;
