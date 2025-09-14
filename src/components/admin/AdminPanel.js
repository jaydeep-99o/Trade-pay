// src/components/admin/AdminPanel.js
import React, { useState, useEffect } from 'react';
import {
    getAllUsers,
    updateUserBalance,
    getUserData
} from '../../firebase/firestore';
import {
    Settings,
    Users,
    DollarSign,
    Plus,
    Minus,
    RefreshCw,
    Search,
    User as UserIcon
} from 'lucide-react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [adjustAmount, setAdjustAmount] = useState('');
    const [adjustType, setAdjustType] = useState('add'); // add or subtract
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const result = await getAllUsers();
        if (result.success) {
            setUsers(result.users);
        }
        setLoading(false);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';

        let date;
        if (timestamp.seconds) {
            date = new Date(timestamp.seconds * 1000);
        } else {
            date = new Date(timestamp);
        }

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleBalanceAdjustment = async () => {
        if (!selectedUser || !adjustAmount) return;

        const amount = parseFloat(adjustAmount);
        if (isNaN(amount) || amount <= 0) return;

        setIsProcessing(true);

        let newBalance;
        if (adjustType === 'add') {
            newBalance = selectedUser.balance + amount;
        } else {
            newBalance = Math.max(0, selectedUser.balance - amount);
        }

        const result = await updateUserBalance(selectedUser.uid, newBalance);

        if (result.success) {
            // Update local state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.uid === selectedUser.uid
                        ? { ...user, balance: newBalance }
                        : user
                )
            );

            // Close modal
            setSelectedUser(null);
            setAdjustAmount('');
            setAdjustType('add');
        }

        setIsProcessing(false);
    };

    const getTotalBalance = () => {
        return users.reduce((sum, user) => sum + (user.balance || 0), 0);
    };

    const getActiveUsers = () => {
        return users.filter(user => (user.balance || 0) > 0).length;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading admin panel...</p>
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
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <Settings className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                            <p className="text-gray-600 text-sm">Manage users and balances</p>
                        </div>
                    </div>
                    <button
                        onClick={loadUsers}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex items-center space-x-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-blue-600">Total Users</p>
                                <p className="text-xl font-bold text-blue-900">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl">
                        <div className="flex items-center space-x-3">
                            <UserIcon className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-green-600">Active Users</p>
                                <p className="text-xl font-bold text-green-900">{getActiveUsers()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl">
                        <div className="flex items-center space-x-3">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-purple-600">Total Balance</p>
                                <p className="text-xl font-bold text-purple-900">
                                    {formatCurrency(getTotalBalance())}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Management */}
            <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Search users..."
                            />
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {filteredUsers.map((user) => (
                        <div key={user.uid} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <UserIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        {user.phone && (
                                            <p className="text-sm text-gray-600">{user.phone}</p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Joined: {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(user.balance || 0)}
                                        </p>
                                        <p className="text-sm text-gray-600">Balance</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        Adjust
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No users found</p>
                    </div>
                )}
            </div>

            {/* Balance Adjustment Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Adjust Balance - {selectedUser.name}
                        </h3>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Current Balance</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(selectedUser.balance || 0)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adjustment Type
                                </label>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setAdjustType('add')}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border transition-colors ${adjustType === 'add'
                                                ? 'bg-green-50 border-green-300 text-green-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Money</span>
                                    </button>
                                    <button
                                        onClick={() => setAdjustType('subtract')}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border transition-colors ${adjustType === 'subtract'
                                                ? 'bg-red-50 border-red-300 text-red-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Minus className="w-4 h-4" />
                                        <span>Subtract Money</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={adjustAmount}
                                    onChange={(e) => setAdjustAmount(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter amount"
                                    min="1"
                                />
                            </div>

                            {adjustAmount && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-blue-600">New Balance Will Be</p>
                                    <p className="text-xl font-bold text-blue-900">
                                        {formatCurrency(
                                            adjustType === 'add'
                                                ? selectedUser.balance + parseFloat(adjustAmount || 0)
                                                : Math.max(0, selectedUser.balance - parseFloat(adjustAmount || 0))
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setAdjustAmount('');
                                    setAdjustType('add');
                                }}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBalanceAdjustment}
                                disabled={isProcessing || !adjustAmount}
                                className={`flex-1 py-3 px-4 rounded-lg transition-colors text-white ${adjustType === 'add'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isProcessing ? 'Processing...' : `${adjustType === 'add' ? 'Add' : 'Subtract'} Money`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;