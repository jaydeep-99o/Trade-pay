// src/components/dashboard/Wallet.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserData, getUserTransactions } from '../../firebase/firestore';
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
    const [transactions, setTransactions] = useState([]);
    const [transactionStats, setTransactionStats] = useState({
        moneyReceived: 0,
        moneySent: 0,
        totalTransactions: 0
    });
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

    // Fetch transactions on component mount and when userData changes
    useEffect(() => {
        if (userData?.uid) {
            fetchTransactions();
        }
    }, [userData?.uid]);

    const fetchTransactions = async () => {
        if (!userData?.uid) return;
        
        setIsLoadingTransactions(true);
        try {
            const result = await getUserTransactions(userData.uid);
            if (result.success) {
                setTransactions(result.transactions);
                calculateTransactionStats(result.transactions);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setIsLoadingTransactions(false);
        }
    };

    const calculateTransactionStats = (transactionList) => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        let moneyReceived = 0;
        let moneySent = 0;
        let thisMonthReceived = 0;
        let thisMonthSent = 0;
        
        transactionList.forEach(transaction => {
            const transactionDate = transaction.timestamp?.toDate ? 
                transaction.timestamp.toDate() : 
                new Date(transaction.timestamp);
            
            const amount = transaction.amount || 0;
            
            // Check if transaction is from current month
            const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                                 transactionDate.getFullYear() === currentYear;
            
            if (transaction.type === 'received' || transaction.toUid === userData.uid) {
                moneyReceived += amount;
                if (isCurrentMonth) {
                    thisMonthReceived += amount;
                }
            } else if (transaction.type === 'sent' || transaction.fromUid === userData.uid) {
                moneySent += amount;
                if (isCurrentMonth) {
                    thisMonthSent += amount;
                }
            }
        });

        setTransactionStats({
            moneyReceived: thisMonthReceived,
            moneySent: thisMonthSent,
            totalTransactions: transactionList.length
        });
    };

    const refreshBalance = async () => {
        setIsRefreshing(true);
        const freshUserData = await getUserData(userData.uid);
        if (freshUserData) {
            setUserData(freshUserData);
        }
        // Also refresh transactions
        await fetchTransactions();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Mobile-first inline styles
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },

        // Balance Card styles
        balanceCard: {
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            borderRadius: '16px',
            padding: '32px',
            color: 'white',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        },
        balanceHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
        },
        balanceHeaderLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        walletIcon: {
            width: '32px',
            height: '32px'
        },
        balanceTitle: {
            fontSize: '20px',
            fontWeight: '600',
            margin: '0'
        },
        refreshButton: {
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        refreshButtonHover: {
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
        },
        refreshIcon: {
            width: '20px',
            height: '20px'
        },
        refreshIconSpinning: {
            animation: 'spin 1s linear infinite'
        },
        balanceSection: {
            marginBottom: '24px'
        },
        balanceLabel: {
            color: '#bfdbfe',
            fontSize: '14px',
            marginBottom: '8px',
            margin: '0 0 8px 0'
        },
        balanceDisplay: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        balanceAmount: {
            fontSize: '36px',
            fontWeight: '700',
            margin: '0'
        },
        toggleButton: {
            padding: '4px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        toggleButtonHover: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
        },
        toggleIcon: {
            width: '20px',
            height: '20px'
        },
        balanceFooter: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px'
        },
        balanceFooterText: {
            color: '#bfdbfe',
            margin: '0'
        },

        // Quick Actions styles
        quickActionsGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px'
        },
        quickActionCard: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
        },
        quickActionHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
        },
        quickActionIconContainer: {
            padding: '8px',
            borderRadius: '8px'
        },
        quickActionIconContainerGreen: {
            backgroundColor: '#f0fdf4'
        },
        quickActionIconContainerRed: {
            backgroundColor: '#fef2f2'
        },
        quickActionIconContainerBlue: {
            backgroundColor: '#eff6ff'
        },
        quickActionIcon: {
            width: '20px',
            height: '20px'
        },
        quickActionIconGreen: {
            color: '#16a34a'
        },
        quickActionIconRed: {
            color: '#dc2626'
        },
        quickActionIconBlue: {
            color: '#2563eb'
        },
        quickActionTitle: {
            fontWeight: '500',
            color: '#111827',
            fontSize: '16px',
            margin: '0'
        },
        quickActionAmount: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 4px 0'
        },
        quickActionSubtitle: {
            fontSize: '14px',
            margin: '0'
        },
        quickActionSubtitleGreen: {
            color: '#16a34a'
        },
        quickActionSubtitleRed: {
            color: '#dc2626'
        },
        quickActionSubtitleBlue: {
            color: '#2563eb'
        },
        loadingText: {
            fontSize: '20px',
            color: '#6b7280',
            fontStyle: 'italic'
        },

        // Quick Tips styles
        tipsCard: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
        },
        tipsTitle: {
            fontWeight: '600',
            color: '#111827',
            fontSize: '18px',
            margin: '0 0 16px 0'
        },
        tipsList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        tipItem: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
        },
        tipNumber: {
            width: '24px',
            height: '24px',
            backgroundColor: '#eff6ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
            fontSize: '14px',
            fontWeight: '500',
            marginTop: '2px',
            flexShrink: '0'
        },
        tipContent: {
            flex: '1'
        },
        tipContentTitle: {
            color: '#111827',
            fontWeight: '500',
            fontSize: '16px',
            margin: '0 0 4px 0'
        },
        tipContentDescription: {
            color: '#6b7280',
            fontSize: '14px',
            margin: '0',
            lineHeight: '1.5'
        }
    };

    // Add responsive styles and CSS keyframes for animation
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @media (min-width: 768px) {
                .quick-actions-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    return (
        <div style={styles.container}>
            {/* Balance Card */}
            <div style={styles.balanceCard}>
                <div style={styles.balanceHeader}>
                    <div style={styles.balanceHeaderLeft}>
                        <WalletIcon style={styles.walletIcon} />
                        <h2 style={styles.balanceTitle}>TradePay Wallet</h2>
                    </div>
                    <button
                        onClick={refreshBalance}
                        style={styles.refreshButton}
                        onMouseEnter={(e) => {
                            Object.assign(e.target.style, styles.refreshButtonHover);
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        }}
                    >
                        <RefreshCw 
                            style={{
                                ...styles.refreshIcon,
                                ...(isRefreshing ? styles.refreshIconSpinning : {})
                            }} 
                        />
                    </button>
                </div>

                <div style={styles.balanceSection}>
                    <p style={styles.balanceLabel}>Available Balance</p>
                    <div style={styles.balanceDisplay}>
                        <span style={styles.balanceAmount}>
                            {showBalance
                                ? formatCurrency(userData?.balance || 0)
                                : '₹ ••••••'
                            }
                        </span>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            style={styles.toggleButton}
                            onMouseEnter={(e) => {
                                Object.assign(e.target.style, styles.toggleButtonHover);
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            {showBalance ? <Eye style={styles.toggleIcon} /> : <EyeOff style={styles.toggleIcon} />}
                        </button>
                    </div>
                </div>

                <div style={styles.balanceFooter}>
                    <span style={styles.balanceFooterText}>Account: {userData?.email}</span>
                    <span style={styles.balanceFooterText}>Expo Credits</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div 
                style={styles.quickActionsGrid} 
                className="quick-actions-grid"
            >
                <div style={styles.quickActionCard}>
                    <div style={styles.quickActionHeader}>
                        <div style={{
                            ...styles.quickActionIconContainer,
                            ...styles.quickActionIconContainerGreen
                        }}>
                            <TrendingUp style={{
                                ...styles.quickActionIcon,
                                ...styles.quickActionIconGreen
                            }} />
                        </div>
                        <h3 style={styles.quickActionTitle}>Money Received</h3>
                    </div>
                    <p style={styles.quickActionAmount}>
                        {isLoadingTransactions 
                            ? <span style={styles.loadingText}>Loading...</span>
                            : formatCurrency(transactionStats.moneyReceived)
                        }
                    </p>
                    <p style={{
                        ...styles.quickActionSubtitle,
                        ...styles.quickActionSubtitleGreen
                    }}>This month</p>
                </div>

                <div style={styles.quickActionCard}>
                    <div style={styles.quickActionHeader}>
                        <div style={{
                            ...styles.quickActionIconContainer,
                            ...styles.quickActionIconContainerRed
                        }}>
                            <TrendingDown style={{
                                ...styles.quickActionIcon,
                                ...styles.quickActionIconRed
                            }} />
                        </div>
                        <h3 style={styles.quickActionTitle}>Money Sent</h3>
                    </div>
                    <p style={styles.quickActionAmount}>
                        {isLoadingTransactions 
                            ? <span style={styles.loadingText}>Loading...</span>
                            : formatCurrency(transactionStats.moneySent)
                        }
                    </p>
                    <p style={{
                        ...styles.quickActionSubtitle,
                        ...styles.quickActionSubtitleRed
                    }}>This month</p>
                </div>

                <div style={styles.quickActionCard}>
                    <div style={styles.quickActionHeader}>
                        <div style={{
                            ...styles.quickActionIconContainer,
                            ...styles.quickActionIconContainerBlue
                        }}>
                            <WalletIcon style={{
                                ...styles.quickActionIcon,
                                ...styles.quickActionIconBlue
                            }} />
                        </div>
                        <h3 style={styles.quickActionTitle}>Transactions</h3>
                    </div>
                    <p style={styles.quickActionAmount}>
                        {isLoadingTransactions 
                            ? <span style={styles.loadingText}>Loading...</span>
                            : transactionStats.totalTransactions
                        }
                    </p>
                    <p style={{
                        ...styles.quickActionSubtitle,
                        ...styles.quickActionSubtitleBlue
                    }}>Total count</p>
                </div>
            </div>

            {/* Quick Tips */}
            <div style={styles.tipsCard}>
                <h3 style={styles.tipsTitle}>Getting Started</h3>
                <div style={styles.tipsList}>
                    <div style={styles.tipItem}>
                        <div style={styles.tipNumber}>1</div>
                        <div style={styles.tipContent}>
                            <p style={styles.tipContentTitle}>Start Trading</p>
                            <p style={styles.tipContentDescription}>
                                Use the Transfer tab to send money to other traders
                            </p>
                        </div>
                    </div>
                    <div style={styles.tipItem}>
                        <div style={styles.tipNumber}>2</div>
                        <div style={styles.tipContent}>
                            <p style={styles.tipContentTitle}>Track Transactions</p>
                            <p style={styles.tipContentDescription}>
                                Monitor all your trading activities in the History tab
                            </p>
                        </div>
                    </div>
                    <div style={styles.tipItem}>
                        <div style={styles.tipNumber}>3</div>
                        <div style={styles.tipContent}>
                            <p style={styles.tipContentTitle}>Stay Updated</p>
                            <p style={styles.tipContentDescription}>
                                Refresh your balance regularly to see the latest updates
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;