// src/components/dashboard/Wallet.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserData } from '../../firebase/firestore';
import {
    Wallet as WalletIcon,
    TrendingUp,
    TrendingDown,
    Eye,
    EyeOff,
    RefreshCw
} from 'lucide-react';

const Wallet = () => {
    const { userData, setUserData } = useAuth();
    const [showBalance, setShowBalance] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshBalance = async () => {
        setIsRefreshing(true);
        const freshUserData = await getUserData(userData.uid);
        if (freshUserData) {
            setUserData(freshUserData);
        }
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <WalletIcon className="w-8 h-8" />
                        <h2 className="text-xl font-semibold">TradePay Wallet</h2>
                    </div>
                    <button
                        onClick={refreshBalance}
                        className={`p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors ${isRefreshing ? 'animate-spin' : ''
                            }`}
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-blue-100 text-sm mb-2">Available Balance</p>
                    <div className="flex items-center space-x-3">
                        <span className="text-4xl font-bold">
                            {showBalance
                                ? formatCurrency(userData?.balance || 0)
                                : '₹ ••••••'
                            }
                        </span>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="p-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-100">Account: {userData?.email}</span>
                    <span className="text-blue-100">Expo Credits</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Money Received</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹ 0</p>
                    <p className="text-green-600 text-sm">This month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <TrendingDown className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Money Sent</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹ 0</p>
                    <p className="text-red-600 text-sm">This month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <WalletIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Transactions</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-blue-600 text-sm">Total count</p>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Getting Started</h3>
                <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium mt-0.5">
                            1
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium">Start Trading</p>
                            <p className="text-gray-600 text-sm">Use the Transfer tab to send money to other traders</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium mt-0.5">
                            2
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium">Track Transactions</p>
                            <p className="text-gray-600 text-sm">Monitor all your trading activities in the History tab</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium mt-0.5">
                            3
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium">Stay Updated</p>
                            <p className="text-gray-600 text-sm">Refresh your balance regularly to see the latest updates</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;