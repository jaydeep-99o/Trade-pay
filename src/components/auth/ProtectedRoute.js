// src/components/auth/ProtectedRoute.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginRegister from './LoginRegister';
import Loading from '../common/Loading';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    return currentUser ? children : <LoginRegister />;
};

export default ProtectedRoute;