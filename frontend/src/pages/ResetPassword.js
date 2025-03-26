import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/api';
import AuthForm from '../components/AuthForm';

const ResetPassword = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const fields = [
        { name: 'new_password', label: 'New Password', type: 'password', rules: { required: 'Password is required' } },
    ];

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await resetPassword({ token, new_password: data.new_password });
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            title="Reset Password"
            fields={fields}
            onSubmit={onSubmit}
            error={error}
            loading={loading}
            success={success ? <Alert severity="success">{success}</Alert> : null}
        />
    );
};

export default ResetPassword;