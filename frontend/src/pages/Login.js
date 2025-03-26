import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { login } from '../api/api';
import AuthForm from '../components/AuthForm';

const Login = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login: loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const fields = [
        { name: 'email', label: 'Email', rules: { required: 'Email is required' } },
        { name: 'password', label: 'Password', type: 'password', rules: { required: 'Password is required' } },
    ];

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            const response = await login(data);
            const { token, user } = response.data;
            loginUser(token, user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            title="Login"
            fields={fields}
            onSubmit={onSubmit}
            error={error}
            loading={loading}
        />
    );
};

export default Login;