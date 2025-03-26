import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { setAuthToken } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            try {
                setAuthToken(token);
                localStorage.setItem('token', token);
            } catch (error) {
                logout();
            }
        } else {
            logout();
        }
    }, [token]);

    const login = (token, userData) => {
        setToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};