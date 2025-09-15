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
        console.log('🔍 Starting to load transactions...');
        console.log('👤 Current userData:', userData);
        
        if (!userData?.uid) {
            console.error('❌ No userData.uid available');
            setLoading(false);
            return;
        }
        
        setLoading(true);
        
        try {
            console.log('🚀 Calling getUserTransactions with UID:', userData.uid);
            const result = await getUserTransactions(userData.uid);
            
            console.log('📦 getUserTransactions full result:', result);
            console.log('✅ Success status:', result.success);
            
            if (result.success) {
                console.log('📊 Transactions array:', result.transactions);
                console.log('📈 Number of transactions:', result.transactions?.length || 0);
                
                // Log each transaction individually
                result.transactions?.forEach((transaction, index) => {
                    console.log(`📄 Transaction ${index + 1}:`, transaction);
                    console.log(`   - ID: ${transaction.id}`);
                    console.log(`   - Type: ${transaction.type}`);
                    console.log(`   - Amount: ${transaction.amount}`);
                    console.log(`   - From: ${transaction.fromName} (${transaction.fromUid})`);
                    console.log(`   - To: ${transaction.toName} (${transaction.toUid})`);
                    console.log(`   - Timestamp:`, transaction.timestamp);
                });
                
                setTransactions(result.transactions || []);
            } else {
                console.error('❌ Failed to load transactions:', result.error);
                setTransactions([]);
            }
        } catch (error) {
            console.error('💥 Error in loadTransactions:', error);
            setTransactions([]);
        }
        
        setLoading(false);
    };

    // Add this useEffect to log when transactions state changes
    useEffect(() => {
        console.log('🔄 Transactions state updated:', transactions);
        console.log('📊 Current filter:', filter);
        console.log('📋 Filtered transactions length:', filteredTransactions.length);
    }, [transactions, filter]);

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

    // Mobile-first inline styles
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        
        // Loading component styles
        loadingCard: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
        },
        loadingContent: {
            textAlign: 'center'
        },
        loadingSpinner: {
            width: '32px',
            height: '32px',
            color: '#2563eb',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
        },
        loadingText: {
            color: '#6b7280',
            fontSize: '14px',
            margin: '0'
        },

        // Header card styles
        headerCard: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '16px'
        },
        headerTop: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
        },
        headerLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        iconContainer: {
            backgroundColor: '#f3e8ff',
            padding: '10px',
            borderRadius: '12px'
        },
        icon: {
            width: '20px',
            height: '20px',
            color: '#7c3aed'
        },
        headerText: {
            display: 'flex',
            flexDirection: 'column'
        },
        title: {
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 2px 0'
        },
        subtitle: {
            color: '#6b7280',
            fontSize: '12px',
            margin: '0'
        },
        refreshButton: {
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            minHeight: '40px',
            minWidth: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        refreshIcon: {
            width: '18px',
            height: '18px',
            color: '#6b7280'
        },

        // Filter tabs styles
        filterContainer: {
            display: 'flex',
            gap: '4px',
            backgroundColor: '#f3f4f6',
            padding: '4px',
            borderRadius: '8px'
        },
        filterButton: {
            flex: '1',
            padding: '10px 12px',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minHeight: '44px'
        },
        filterButtonActive: {
            backgroundColor: 'white',
            color: '#111827',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        filterButtonInactive: {
            backgroundColor: 'transparent',
            color: '#6b7280'
        },

        // Transactions list styles
        transactionsCard: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },

        // Empty state styles
        emptyState: {
            padding: '32px 16px',
            textAlign: 'center'
        },
        emptyIcon: {
            width: '48px',
            height: '48px',
            color: '#9ca3af',
            margin: '0 auto 16px'
        },
        emptyTitle: {
            fontSize: '16px',
            fontWeight: '500',
            color: '#111827',
            margin: '0 0 8px 0'
        },
        emptyDescription: {
            color: '#6b7280',
            fontSize: '14px',
            margin: '0',
            lineHeight: '1.5'
        },

        // Transaction item styles
        transactionsList: {
            display: 'flex',
            flexDirection: 'column'
        },
        transactionItem: {
            padding: '16px',
            borderBottom: '1px solid #f3f4f6',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
        },
        transactionItemLast: {
            borderBottom: 'none'
        },
        transactionContent: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
        },
        transactionIcon: {
            padding: '8px',
            borderRadius: '8px',
            flexShrink: '0'
        },
        transactionIconSent: {
            backgroundColor: '#fef2f2'
        },
        transactionIconReceived: {
            backgroundColor: '#f0fdf4'
        },
        transactionIconInner: {
            width: '18px',
            height: '18px'
        },
        transactionIconSentColor: {
            color: '#dc2626'
        },
        transactionIconReceivedColor: {
            color: '#16a34a'
        },
        transactionDetails: {
            flex: '1',
            minWidth: '0'
        },
        transactionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '8px'
        },
        transactionLeft: {
            flex: '1',
            minWidth: '0'
        },
        transactionName: {
            fontWeight: '500',
            color: '#111827',
            fontSize: '14px',
            margin: '0 0 2px 0'
        },
        transactionDescription: {
            fontSize: '12px',
            color: '#6b7280',
            margin: '0',
            lineHeight: '1.4'
        },
        transactionRight: {
            textAlign: 'right',
            flexShrink: '0'
        },
        transactionAmount: {
            fontWeight: '600',
            fontSize: '14px',
            margin: '0 0 2px 0'
        },
        transactionAmountSent: {
            color: '#dc2626'
        },
        transactionAmountReceived: {
            color: '#16a34a'
        },
        transactionDate: {
            fontSize: '11px',
            color: '#9ca3af',
            margin: '0'
        }
    };

    // Add CSS keyframes for animation
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    if (loading) {
        return (
            <div style={styles.loadingCard}>
                <div style={styles.loadingContent}>
                    <RefreshCw style={styles.loadingSpinner} />
                    <p style={styles.loadingText}>Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.headerCard}>
                <div style={styles.headerTop}>
                    <div style={styles.headerLeft}>
                        <div style={styles.iconContainer}>
                            <HistoryIcon style={styles.icon} />
                        </div>
                        <div style={styles.headerText}>
                            <h2 style={styles.title}>Transaction History</h2>
                            <p style={styles.subtitle}>Track all your trading activities</p>
                        </div>
                    </div>
                    <button
                        onClick={loadTransactions}
                        style={styles.refreshButton}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                        }}
                    >
                        <RefreshCw style={styles.refreshIcon} />
                    </button>
                </div>

                {/* Filter Tabs */}
                <div style={styles.filterContainer}>
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'sent', label: 'Sent' },
                        { id: 'received', label: 'Received' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            style={{
                                ...styles.filterButton,
                                ...(filter === tab.id ? styles.filterButtonActive : styles.filterButtonInactive)
                            }}
                            onMouseEnter={(e) => {
                                if (filter !== tab.id) {
                                    e.target.style.color = '#111827';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (filter !== tab.id) {
                                    e.target.style.color = '#6b7280';
                                }
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions List */}
            <div style={styles.transactionsCard}>
                {filteredTransactions.length === 0 ? (
                    <div style={styles.emptyState}>
                        <Calendar style={styles.emptyIcon} />
                        <h3 style={styles.emptyTitle}>No transactions yet</h3>
                        <p style={styles.emptyDescription}>
                            {filter === 'all'
                                ? 'Start trading to see your transaction history here'
                                : `No ${filter} transactions found`
                            }
                        </p>
                    </div>
                ) : (
                    <div style={styles.transactionsList}>
                        {filteredTransactions.map((transaction, index) => (
                            <div 
                                key={transaction.id} 
                                style={{
                                    ...styles.transactionItem,
                                    ...(index === filteredTransactions.length - 1 ? styles.transactionItemLast : {})
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                <div style={styles.transactionContent}>
                                    <div style={{
                                        ...styles.transactionIcon,
                                        ...(transaction.type === 'sent' ? styles.transactionIconSent : styles.transactionIconReceived)
                                    }}>
                                        {transaction.type === 'sent' ? (
                                            <ArrowUpRight style={{
                                                ...styles.transactionIconInner,
                                                ...styles.transactionIconSentColor
                                            }} />
                                        ) : (
                                            <ArrowDownLeft style={{
                                                ...styles.transactionIconInner,
                                                ...styles.transactionIconReceivedColor
                                            }} />
                                        )}
                                    </div>

                                    <div style={styles.transactionDetails}>
                                        <div style={styles.transactionHeader}>
                                            <div style={styles.transactionLeft}>
                                                <p style={styles.transactionName}>
                                                    {transaction.type === 'sent'
                                                        ? `To ${transaction.toName}`
                                                        : `From ${transaction.fromName}`
                                                    }
                                                </p>
                                                {transaction.description && (
                                                    <p style={styles.transactionDescription}>
                                                        {transaction.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div style={styles.transactionRight}>
                                                <p style={{
                                                    ...styles.transactionAmount,
                                                    ...(transaction.type === 'sent' ? styles.transactionAmountSent : styles.transactionAmountReceived)
                                                }}>
                                                    {transaction.type === 'sent' ? '-' : '+'}
                                                    {formatCurrency(transaction.amount)}
                                                </p>
                                                <p style={styles.transactionDate}>
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