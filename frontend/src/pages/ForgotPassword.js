import React, { useState } from 'react';
import { forgotPassword } from '../api/api';
import AuthForm from '../components/AuthForm';

const ForgotPassword = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const fields = [
        { name: 'email', label: 'Email', rules: { required: 'Email is required' } },
    ];

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await forgotPassword(data);
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            title="Forgot Password"
            fields={fields}
            onSubmit={onSubmit}
            error={error}
            loading={loading}
            success={success ? <Alert severity="success">{success}</Alert> : null}
        />
    );
};

export default ForgotPassword;