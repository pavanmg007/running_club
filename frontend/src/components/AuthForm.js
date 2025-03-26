import React from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';

const AuthForm = ({ title, fields, onSubmit, error, loading }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
                {title}
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field) => (
                    <TextField
                        key={field.name}
                        label={field.label}
                        type={field.type || 'text'}
                        fullWidth
                        margin="normal"
                        {...register(field.name, field.rules)}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]?.message}
                        disabled={loading}
                    />
                ))}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : title}
                </Button>
            </form>
        </Box>
    );
};

export default AuthForm;