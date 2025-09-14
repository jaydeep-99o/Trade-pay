import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { searchUsers, transferMoney, getUserData } from '../../firebase/firestore';
import { Send, Search, User, CheckCircle, AlertCircle } from 'lucide-react';

const TransferMoney = () => {
    const { userData, setUserData } = useAuth();
    const [step, setStep] = useState(1); // 1: Search, 2: Amount, 3: Confirm, 4: Success
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        setError('');

        const result = await searchUsers(searchTerm.trim());

        if (result.success) {
            // Filter out current user from results
            const filteredUsers = result.users.filter(user => user.uid !== userData.uid);
            setSearchResults(filteredUsers);
            if (filteredUsers.length === 0) {
                setError('No users found with this email or phone number');
            }
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        setStep(2);
        setError('');
    };

    const validateAmount = () => {
        const transferAmount = parseFloat(amount);

        if (!transferAmount || transferAmount <= 0) {
            setError('Please enter a valid amount');
            return false;
        }

        if (transferAmount > userData.balance) {
            setError('Insufficient balance');
            return false;
        }

        if (transferAmount < 1) {
            setError('Minimum transfer amount is ₹1');
            return false;
        }

        return true;
    };

    const proceedToConfirm = () => {
        if (validateAmount()) {
            setStep(3);
            setError('');
        }
    };

    const confirmTransfer = async () => {
        setIsLoading(true);
        setError('');

        const result = await transferMoney(
            userData.uid,
            selectedUser.uid,
            parseFloat(amount),
            description.trim()
        );

        if (result.success) {
            // Refresh user data
            const freshUserData = await getUserData(userData.uid);
            setUserData(freshUserData);
            setSuccess(true);
            setStep(4);
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    const resetTransfer = () => {
        setStep(1);
        setSearchTerm('');
        setSearchResults([]);
        setSelectedUser(null);
        setAmount('');
        setDescription('');
        setError('');
        setSuccess(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-xl">
                        <Send className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Transfer Money</h2>
                        <p className="text-gray-600 text-sm">Send money to other traders</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center mb-8">
                    {[1, 2, 3, 4].map((stepNum) => (
                        <React.Fragment key={stepNum}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                {stepNum}
                            </div>
                            {stepNum < 4 && (
                                <div className={`flex-1 h-1 mx-2 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Step 1: Search User */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search by Email or Phone
                            </label>
                            <div className="flex space-x-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter email or phone number"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={isLoading || !searchTerm.trim()}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-medium text-gray-900">Search Results</h3>
                                {searchResults.map((user) => (
                                    <div
                                        key={user.uid}
                                        onClick={() => selectUser(user)}
                                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                                    >
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            {user.phone && (
                                                <p className="text-sm text-gray-600">{user.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Enter Amount */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">Sending to</p>
                            <div className="flex items-center space-x-3">
                                <div className="bg-white p-2 rounded-lg">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{selectedUser.name}</p>
                                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter amount"
                                min="1"
                                max={userData.balance}
                            />
                            <p className="text-sm text-gray-600 mt-1">
                                Available balance: {formatCurrency(userData.balance)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="What's this for?"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={proceedToConfirm}
                                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirm Transfer */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Transfer</h3>
                            <p className="text-gray-600">Please review the details below</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">To</span>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{selectedUser.name}</p>
                                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Amount</span>
                                <span className="font-bold text-xl text-gray-900">{formatCurrency(parseFloat(amount))}</span>
                            </div>

                            {description && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Description</span>
                                    <span className="text-gray-900">{description}</span>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Remaining Balance</span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(userData.balance - parseFloat(amount))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={confirmTransfer}
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Processing...' : 'Confirm & Send'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && success && (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="bg-green-100 p-6 rounded-full">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Transfer Successful!</h3>
                            <p className="text-gray-600">
                                {formatCurrency(parseFloat(amount))} sent to {selectedUser.name}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 mb-2">Updated Balance</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(userData.balance)}</p>
                        </div>

                        <button
                            onClick={resetTransfer}
                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Send Another Transfer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferMoney;

// src/components/dashboard/TransactionHistory.js
