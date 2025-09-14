// src/components/dashboard/Dashboard.js
import React, { useState } from 'react';
import { Header } from '../common/Header';
import Wallet from './Wallet';
import TransactionHistory from './TransactionHistory';
import TransferMoney from '../transfer/TransferMoney';
import AdminPanel from '../admin/AdminPanel';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    Send,
    History,
    Settings,
    CreditCard
} from 'lucide-react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
    const { userData } = useAuth();

    const isAdmin = userData?.email === 'admin@tradepay.com'; // Simple admin check

    const navigationItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'transfer', label: 'Transfer', icon: Send },
        { id: 'history', label: 'History', icon: History },
        ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Settings }] : [])
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <Wallet />;
            case 'transfer':
                return <TransferMoney />;
            case 'history':
                return <TransactionHistory />;
            case 'admin':
                return isAdmin ? <AdminPanel /> : <Wallet />;
            default:
                return <Wallet />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-8 bg-white p-1 rounded-xl shadow-sm">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === item.id
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="hidden sm:inline">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="transition-all duration-300">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

