import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserTransactions } from '../../firebase/firestore';
import {
    History as HistoryIcon,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    Calendar,
    Filter
} from 'lucide-react';

const TransactionHistory = () => {
    const { userData } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, sent, received

    useEffect(() => {
        loadTransactions();
    }, [userData]);

    const loadTransactions = async () => {
        setLoading(true);
        const result = await getUserTransactions(userData.uid);
        if (result.success) {
            setTransactions(result.transactions);
        }
        setLoading(false);
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'sent') return transaction.type === 'sent';
        if (filter === 'received') return transaction.type === 'received';
        return true;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';

        let date;
        if (timestamp.seconds) {
            date = new Date(timestamp.seconds * 1000);
        } else {
            date = new Date(timestamp);
        }

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <HistoryIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
                            <p className="text-gray-600 text-sm">Track all your trading activities</p>
                        </div>
                    </div>
                    <button
                        onClick={loadTransactions}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'sent', label: 'Sent' },
                        { id: 'received', label: 'Received' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${filter === tab.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl shadow-sm">
                {filteredTransactions.length === 0 ? (
                    <div className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? 'Start trading to see your transaction history here'
                                : `No ${filter} transactions found`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${transaction.type === 'sent'
                                            ? 'bg-red-100'
                                            : 'bg-green-100'
                                        }`}>
                                        {transaction.type === 'sent' ? (
                                            <ArrowUpRight className="w-5 h-5 text-red-600" />
                                        ) : (
                                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {transaction.type === 'sent'
                                                        ? `To ${transaction.toName}`
                                                        : `From ${transaction.fromName}`
                                                    }
                                                </p>
                                                {transaction.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${transaction.type === 'sent'
                                                        ? 'text-red-600'
                                                        : 'text-green-600'
                                                    }`}>
                                                    {transaction.type === 'sent' ? '-' : '+'}
                                                    {formatCurrency(transaction.amount)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(transaction.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;