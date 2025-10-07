import React, { useState, useEffect } from 'react';
import {
    getAllUsers,
    updateUserBalance,
    getUserData,
    getUserTransactions
} from '../../firebase/firestore';
import {
    Settings,
    Users,
    DollarSign,
    Plus,
    Minus,
    RefreshCw,
    Search,
    User as UserIcon,
    ArrowUpCircle,
    ArrowDownCircle,
    X,
    History
} from 'lucide-react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [adjustAmount, setAdjustAmount] = useState('');
    const [adjustType, setAdjustType] = useState('add');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showTransactions, setShowTransactions] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);
    const [userTransactions, setUserTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

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

    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'Unknown';

        let date;
        if (timestamp.seconds) {
            date = new Date(timestamp.seconds * 1000);
        } else {
            date = new Date(timestamp);
        }

        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.uid === selectedUser.uid
                        ? { ...user, balance: newBalance }
                        : user
                )
            );

            setSelectedUser(null);
            setAdjustAmount('');
            setAdjustType('add');
        }

        setIsProcessing(false);
    };

    const handleViewTransactions = async (user) => {
        console.log('🔍 Opening transaction history for user:', user);
        setViewingUser(user);
        setShowTransactions(true);
        setLoadingTransactions(true);
        setUserTransactions([]);
        
        // Fetch transactions for this user
        try {
            console.log('🚀 Fetching transactions for UID:', user.uid);
            const result = await getUserTransactions(user.uid);
            console.log('📦 Transaction result:', result);
            
            if (result.success) {
                console.log('✅ Successfully loaded transactions:', result.transactions);
                console.log('📊 Number of transactions:', result.transactions?.length || 0);
                setUserTransactions(result.transactions || []);
            } else {
                console.error('❌ Failed to load transactions:', result.error);
                setUserTransactions([]);
            }
        } catch (error) {
            console.error('💥 Error fetching transactions:', error);
            setUserTransactions([]);
        }
        
        setLoadingTransactions(false);
    };

    const getTotalBalance = () => {
        return users.reduce((sum, user) => sum + (user.balance || 0), 0);
    };

    const getActiveUsers = () => {
        return users.filter(user => (user.balance || 0) > 0).length;
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },
        loadingContainer: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '32px'
        },
        loadingContent: {
            textAlign: 'center'
        },
        loadingSpinner: {
            width: '32px',
            height: '32px',
            color: '#2563eb',
            margin: '0 auto 16px auto',
            animation: 'spin 1s linear infinite'
        },
        loadingText: {
            color: '#6b7280',
            margin: 0
        },
        headerCard: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
        },
        headerContent: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
        },
        headerLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        headerIcon: {
            backgroundColor: '#fed7aa',
            padding: '12px',
            borderRadius: '12px'
        },
        headerTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0
        },
        headerSubtitle: {
            color: '#6b7280',
            fontSize: '14px',
            margin: 0
        },
        refreshButton: {
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
        },
        statCard: {
            padding: '16px',
            borderRadius: '12px'
        },
        statCardBlue: {
            backgroundColor: '#dbeafe'
        },
        statCardGreen: {
            backgroundColor: '#dcfce7'
        },
        statCardPurple: {
            backgroundColor: '#f3e8ff'
        },
        statContent: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        statLabel: {
            fontSize: '14px',
            margin: '0 0 4px 0'
        },
        statLabelBlue: {
            color: '#2563eb'
        },
        statLabelGreen: {
            color: '#16a34a'
        },
        statLabelPurple: {
            color: '#9333ea'
        },
        statValue: {
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0
        },
        statValueBlue: {
            color: '#1e3a8a'
        },
        statValueGreen: {
            color: '#14532d'
        },
        statValuePurple: {
            color: '#581c87'
        },
        usersCard: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        usersHeader: {
            padding: '24px',
            borderBottom: '1px solid #f3f4f6'
        },
        usersHeaderContent: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        usersTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
        },
        searchContainer: {
            position: 'relative',
            width: '256px'
        },
        searchIcon: {
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '20px',
            height: '20px'
        },
        searchInput: {
            width: '100%',
            paddingLeft: '40px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease'
        },
        usersList: {
            maxHeight: '384px',
            overflowY: 'auto'
        },
        userItem: {
            padding: '24px',
            borderBottom: '1px solid #f3f4f6',
            transition: 'background-color 0.2s ease',
            cursor: 'default'
        },
        userItemContent: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        userLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },
        userAvatar: {
            backgroundColor: '#f3f4f6',
            padding: '8px',
            borderRadius: '8px'
        },
        userName: {
            fontWeight: '500',
            color: '#111827',
            margin: '0 0 4px 0'
        },
        userEmail: {
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 2px 0'
        },
        userPhone: {
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 4px 0'
        },
        userJoinDate: {
            fontSize: '12px',
            color: '#9ca3af',
            margin: 0
        },
        userRight: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },
        userBalance: {
            textAlign: 'right'
        },
        userBalanceAmount: {
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 4px 0'
        },
        userBalanceLabel: {
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
        },
        userActions: {
            display: 'flex',
            gap: '8px'
        },
        adjustButton: {
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
        },
        historyButton: {
            padding: '8px 12px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        noUsers: {
            padding: '32px',
            textAlign: 'center'
        },
        noUsersIcon: {
            width: '48px',
            height: '48px',
            color: '#9ca3af',
            margin: '0 auto 16px auto'
        },
        noUsersText: {
            color: '#6b7280',
            margin: 0
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '448px',
            margin: '16px',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        modalContentLarge: {
            maxWidth: '800px'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
        },
        modalTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
        },
        closeButton: {
            padding: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
        },
        modalSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        currentBalanceCard: {
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '8px'
        },
        currentBalanceLabel: {
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 4px 0'
        },
        currentBalanceAmount: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0
        },
        adjustTypeContainer: {
            display: 'flex',
            flexDirection: 'column'
        },
        adjustTypeLabel: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
        },
        adjustTypeButtons: {
            display: 'flex',
            gap: '8px'
        },
        adjustTypeButton: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px'
        },
        adjustTypeButtonAdd: {
            backgroundColor: '#f0fdf4',
            borderColor: '#bbf7d0',
            color: '#15803d'
        },
        adjustTypeButtonSubtract: {
            backgroundColor: '#fef2f2',
            borderColor: '#fecaca',
            color: '#dc2626'
        },
        adjustTypeButtonInactive: {
            borderColor: '#d1d5db',
            color: '#374151',
            backgroundColor: 'white'
        },
        amountContainer: {
            display: 'flex',
            flexDirection: 'column'
        },
        amountLabel: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
        },
        amountInput: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.2s ease'
        },
        newBalanceCard: {
            backgroundColor: '#eff6ff',
            padding: '16px',
            borderRadius: '8px'
        },
        newBalanceLabel: {
            fontSize: '14px',
            color: '#2563eb',
            margin: '0 0 4px 0'
        },
        newBalanceAmount: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1e40af',
            margin: 0
        },
        modalButtons: {
            display: 'flex',
            gap: '12px',
            marginTop: '24px'
        },
        cancelButton: {
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            color: '#374151',
            backgroundColor: 'white',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
        },
        confirmButton: {
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
        },
        confirmButtonAdd: {
            backgroundColor: '#16a34a'
        },
        confirmButtonSubtract: {
            backgroundColor: '#dc2626'
        },
        confirmButtonDisabled: {
            opacity: 0.5,
            cursor: 'not-allowed'
        },
        transactionsList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '16px'
        },
        transactionItem: {
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            transition: 'background-color 0.2s ease'
        },
        transactionItemContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        transactionLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1
        },
        transactionIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        transactionIconCredit: {
            backgroundColor: '#dcfce7'
        },
        transactionIconDebit: {
            backgroundColor: '#fee2e2'
        },
        transactionDetails: {
            flex: 1
        },
        transactionDescription: {
            fontWeight: '500',
            color: '#111827',
            margin: '0 0 4px 0',
            fontSize: '14px'
        },
        transactionDate: {
            fontSize: '12px',
            color: '#9ca3af',
            margin: 0
        },
        transactionRight: {
            textAlign: 'right'
        },
        transactionAmount: {
            fontSize: '16px',
            fontWeight: '700',
            margin: 0
        },
        transactionAmountCredit: {
            color: '#16a34a'
        },
        transactionAmountDebit: {
            color: '#dc2626'
        },
        noTransactions: {
            padding: '40px 24px',
            textAlign: 'center'
        },
        noTransactionsText: {
            color: '#6b7280',
            fontSize: '14px'
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingContent}>
                    <RefreshCw style={styles.loadingSpinner} />
                    <p style={styles.loadingText}>Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.headerCard}>
                <div style={styles.headerContent}>
                    <div style={styles.headerLeft}>
                        <div style={styles.headerIcon}>
                            <Settings style={{ width: '24px', height: '24px', color: '#ea580c' }} />
                        </div>
                        <div>
                            <h2 style={styles.headerTitle}>Admin Panel</h2>
                            <p style={styles.headerSubtitle}>Manage users and balances</p>
                        </div>
                    </div>
                    <button
                        onClick={loadUsers}
                        style={styles.refreshButton}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                        <RefreshCw style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                    </button>
                </div>

                {/* Stats */}
                <div style={styles.statsGrid}>
                    <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
                        <div style={styles.statContent}>
                            <Users style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                            <div>
                                <p style={{ ...styles.statLabel, ...styles.statLabelBlue }}>Total Users</p>
                                <p style={{ ...styles.statValue, ...styles.statValueBlue }}>{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
                        <div style={styles.statContent}>
                            <UserIcon style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                            <div>
                                <p style={{ ...styles.statLabel, ...styles.statLabelGreen }}>Active Users</p>
                                <p style={{ ...styles.statValue, ...styles.statValueGreen }}>{getActiveUsers()}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ ...styles.statCard, ...styles.statCardPurple }}>
                        <div style={styles.statContent}>
                            <DollarSign style={{ width: '20px', height: '20px', color: '#9333ea' }} />
                            <div>
                                <p style={{ ...styles.statLabel, ...styles.statLabelPurple }}>Total Balance</p>
                                <p style={{ ...styles.statValue, ...styles.statValuePurple }}>
                                    {formatCurrency(getTotalBalance())}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Management */}
            <div style={styles.usersCard}>
                <div style={styles.usersHeader}>
                    <div style={styles.usersHeaderContent}>
                        <h3 style={styles.usersTitle}>User Management</h3>
                        <div style={styles.searchContainer}>
                            <Search style={styles.searchIcon} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                                placeholder="Search users..."
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.usersList}>
                    {filteredUsers.map((user) => (
                        <div 
                            key={user.uid} 
                            style={styles.userItem}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <div style={styles.userItemContent}>
                                <div style={styles.userLeft}>
                                    <div style={styles.userAvatar}>
                                        <UserIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                                    </div>
                                    <div>
                                        <p style={styles.userName}>{user.name}</p>
                                        <p style={styles.userEmail}>{user.email}</p>
                                        {user.phone && (
                                            <p style={styles.userPhone}>{user.phone}</p>
                                        )}
                                        <p style={styles.userJoinDate}>
                                            Joined: {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div style={styles.userRight}>
                                    <div style={styles.userBalance}>
                                        <p style={styles.userBalanceAmount}>
                                            {formatCurrency(user.balance || 0)}
                                        </p>
                                        <p style={styles.userBalanceLabel}>Balance</p>
                                    </div>
                                    <div style={styles.userActions}>
                                        <button
                                            onClick={() => handleViewTransactions(user)}
                                            style={styles.historyButton}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                        >
                                            <History style={{ width: '16px', height: '16px' }} />
                                            History
                                        </button>
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            style={styles.adjustButton}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                                        >
                                            Adjust
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <div style={styles.noUsers}>
                        <Users style={styles.noUsersIcon} />
                        <p style={styles.noUsersText}>No users found</p>
                    </div>
                )}
            </div>

            {/* Balance Adjustment Modal */}
            {selectedUser && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>
                            Adjust Balance - {selectedUser.name}
                        </h3>

                        <div style={styles.modalSection}>
                            <div style={styles.currentBalanceCard}>
                                <p style={styles.currentBalanceLabel}>Current Balance</p>
                                <p style={styles.currentBalanceAmount}>
                                    {formatCurrency(selectedUser.balance || 0)}
                                </p>
                            </div>

                            <div style={styles.adjustTypeContainer}>
                                <label style={styles.adjustTypeLabel}>
                                    Adjustment Type
                                </label>
                                <div style={styles.adjustTypeButtons}>
                                    <button
                                        onClick={() => setAdjustType('add')}
                                        style={{
                                            ...styles.adjustTypeButton,
                                            ...(adjustType === 'add' 
                                                ? styles.adjustTypeButtonAdd 
                                                : styles.adjustTypeButtonInactive
                                            )
                                        }}
                                        onMouseEnter={(e) => {
                                            if (adjustType !== 'add') {
                                                e.target.style.backgroundColor = '#f9fafb';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (adjustType !== 'add') {
                                                e.target.style.backgroundColor = 'white';
                                            }
                                        }}
                                    >
                                        <Plus style={{ width: '16px', height: '16px' }} />
                                        <span>Add Money</span>
                                    </button>
                                    <button
                                        onClick={() => setAdjustType('subtract')}
                                        style={{
                                            ...styles.adjustTypeButton,
                                            ...(adjustType === 'subtract' 
                                                ? styles.adjustTypeButtonSubtract 
                                                : styles.adjustTypeButtonInactive
                                            )
                                        }}
                                        onMouseEnter={(e) => {
                                            if (adjustType !== 'subtract') {
                                                e.target.style.backgroundColor = '#f9fafb';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (adjustType !== 'subtract') {
                                                e.target.style.backgroundColor = 'white';
                                            }
                                        }}
                                    >
                                        <Minus style={{ width: '16px', height: '16px' }} />
                                        <span>Subtract Money</span>
                                    </button>
                                </div>
                            </div>

                            <div style={styles.amountContainer}>
                                <label style={styles.amountLabel}>
                                    Amount ($)
                                </label>
                                <input
                                    type="number"
                                    value={adjustAmount}
                                    onChange={(e) => setAdjustAmount(e.target.value)}
                                    style={styles.amountInput}
                                    placeholder="Enter amount"
                                    min="1"
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {adjustAmount && (
                                <div style={styles.newBalanceCard}>
                                    <p style={styles.newBalanceLabel}>New Balance Will Be</p>
                                    <p style={styles.newBalanceAmount}>
                                        {formatCurrency(
                                            adjustType === 'add'
                                                ? selectedUser.balance + parseFloat(adjustAmount || 0)
                                                : Math.max(0, selectedUser.balance - parseFloat(adjustAmount || 0))
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div style={styles.modalButtons}>
                            <button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setAdjustAmount('');
                                    setAdjustType('add');
                                }}
                                style={styles.cancelButton}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBalanceAdjustment}
                                disabled={isProcessing || !adjustAmount}
                                style={{
                                    ...styles.confirmButton,
                                    ...(adjustType === 'add' 
                                        ? styles.confirmButtonAdd 
                                        : styles.confirmButtonSubtract
                                    ),
                                    ...(isProcessing || !adjustAmount ? styles.confirmButtonDisabled : {})
                                }}
                                onMouseEnter={(e) => {
                                    if (!isProcessing && adjustAmount) {
                                        e.target.style.backgroundColor = adjustType === 'add' ? '#15803d' : '#b91c1c';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isProcessing && adjustAmount) {
                                        e.target.style.backgroundColor = adjustType === 'add' ? '#16a34a' : '#dc2626';
                                    }
                                }}
                            >
                                {isProcessing ? 'Processing...' : `${adjustType === 'add' ? 'Add' : 'Subtract'} Money`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction History Modal */}
            {showTransactions && viewingUser && (
                <div style={styles.modal}>
                    <div style={{ ...styles.modalContent, ...styles.modalContentLarge }}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                Transaction History - {viewingUser.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowTransactions(false);
                                    setViewingUser(null);
                                    setUserTransactions([]);
                                }}
                                style={styles.closeButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                            </button>
                        </div>

                        <div style={styles.currentBalanceCard}>
                            <p style={styles.currentBalanceLabel}>Current Balance</p>
                            <p style={styles.currentBalanceAmount}>
                                {formatCurrency(viewingUser.balance || 0)}
                            </p>
                        </div>

                        {loadingTransactions ? (
                            <div style={styles.noTransactions}>
                                <RefreshCw style={{ ...styles.noUsersIcon, animation: 'spin 1s linear infinite' }} />
                                <p style={styles.noTransactionsText}>Loading transactions...</p>
                            </div>
                        ) : userTransactions.length > 0 ? (
                            <div style={styles.transactionsList}>
                                {userTransactions.map((transaction, index) => {
                                    const isReceived = transaction.type === 'received';
                                    const isSent = transaction.type === 'sent';
                                    
                                    return (
                                        <div
                                            key={transaction.id || index}
                                            style={styles.transactionItem}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                        >
                                            <div style={styles.transactionItemContent}>
                                                <div style={styles.transactionLeft}>
                                                    <div style={{
                                                        ...styles.transactionIcon,
                                                        ...(isReceived 
                                                            ? styles.transactionIconCredit 
                                                            : styles.transactionIconDebit
                                                        )
                                                    }}>
                                                        {isReceived ? (
                                                            <ArrowUpCircle style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                                                        ) : (
                                                            <ArrowDownCircle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
                                                        )}
                                                    </div>

                                                    <div style={styles.transactionDetails}>
                                                        <p style={styles.transactionDescription}>
                                                            {isReceived 
                                                                ? `Received from ${transaction.fromName}` 
                                                                : `Sent to ${transaction.toName}`}
                                                        </p>
                                                        {transaction.description && (
                                                            <p style={{ ...styles.transactionDate, marginBottom: '4px', color: '#6b7280' }}>
                                                                {transaction.description}
                                                            </p>
                                                        )}
                                                        <p style={styles.transactionDate}>
                                                            {formatDateTime(transaction.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div style={styles.transactionRight}>
                                                    <p style={{
                                                        ...styles.transactionAmount,
                                                        ...(isReceived 
                                                            ? styles.transactionAmountCredit 
                                                            : styles.transactionAmountDebit
                                                        )
                                                    }}>
                                                        {isReceived ? '+' : '-'}
                                                        {formatCurrency(transaction.amount || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={styles.noTransactions}>
                                <p style={styles.noTransactionsText}>No transactions yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default AdminPanel;