import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { signup } from '../api/api';
import AuthForm from '../components/AuthForm';

const Signup = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const fields = [
        { name: 'name', label: 'Name', rules: { required: 'Name is required' } },
        { name: 'email', label: 'Email', rules: { required: 'Email is required' } },
        { name: 'password', label: 'Password', type: 'password', rules: { required: 'Password is required' } },
        { name: 'code', label: 'Invite Code', rules: { required: 'Invite code is required' } },
    ];

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            const response = await signup(data);
            login(response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            title="Signup"
            fields={fields}
            onSubmit={onSubmit}
            error={error}
            loading={loading}
        />
    );
};

export default Signup;