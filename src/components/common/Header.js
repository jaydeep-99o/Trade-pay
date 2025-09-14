// src/components/common/Header.js
import React from 'react';
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../firebase/auth';

export const Header = () => {
    const { currentUser, userData } = useAuth();

    const handleLogout = async () => {
        await logoutUser();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="ml-3 text-xl font-bold text-gray-900">TradePay</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-700">
                                {userData?.name || currentUser?.displayName || 'User'}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};