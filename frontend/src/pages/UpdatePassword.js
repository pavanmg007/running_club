import React, { useState } from 'react';
import { updatePassword } from '../api/api';
import AuthForm from '../components/AuthForm';
import { Alert } from '@mui/material';

const UpdatePassword = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const fields = [
        { name: 'current_password', label: 'Current Password', type: 'password', rules: { required: 'Current password is required' } },
        { name: 'new_password', label: 'New Password', type: 'password', rules: { required: 'New password is required' } },
    ];

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await updatePassword(data);
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            title="Update Password"
            fields={fields}
            onSubmit={onSubmit}
            error={error}
            loading={loading}
            success={success ? <Alert severity="success">{success}</Alert> : null}
        />
    );
};

export default UpdatePassword;