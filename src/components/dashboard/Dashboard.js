// src/components/dashboard/Dashboard.js
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from '../common/Header';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    Send,
    History,
    Settings
} from 'lucide-react';

// Lazy load components for better performance
const Wallet = lazy(() => import('./Wallet'));
const TransferMoney = lazy(() => import('../transfer/TransferMoney'));
const TransactionHistory = lazy(() => import('./TransactionHistory'));
const AdminPanel = lazy(() => import('../admin/AdminPanel'));

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('history'); // Default to history for country users
    const { userData } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    const isAdmin = userData?.isAdmin === true;
    const isCountry = userData?.isCountry === true;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set default tab based on user type
    useEffect(() => {
        if (isCountry) {
            setActiveTab('history');
        } else {
            setActiveTab('home');
        }
    }, [isCountry]);

    // Define navigation items based on user role
    const navigationItems = isCountry
        ? [{ id: 'history', label: 'History', icon: History }]
        : [
            { id: 'home', label: 'Home', icon: Home },
            { id: 'transfer', label: 'Transfer', icon: Send },
            { id: 'history', label: 'History', icon: History },
            ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Settings }] : [])
        ];

    const renderContent = () => {
        // Country users can only access history
        if (isCountry) {
            return (
                <Suspense fallback={<LoadingSpinner />}>
                    <TransactionHistory />
                </Suspense>
            );
        }

        // Regular users have full access
        switch (activeTab) {
            case 'home':
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Wallet />
                    </Suspense>
                );
            case 'transfer':
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <TransferMoney />
                    </Suspense>
                );
            case 'history':
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <TransactionHistory />
                    </Suspense>
                );
            case 'admin':
                return isAdmin ? (
                    <Suspense fallback={<LoadingSpinner />}>
                        <AdminPanel />
                    </Suspense>
                ) : (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Wallet />
                    </Suspense>
                );
            default:
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Wallet />
                    </Suspense>
                );
        }
    };

    return (
        <div style={styles.container}>
            <Header />

            <div style={styles.wrapper}>
                {/* Desktop Navigation - Hidden if country user has only one tab */}
                {!isMobile && navigationItems.length > 1 && (
                    <div style={styles.navigationContainer}>
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        ...styles.navigationButton,
                                        ...(isActive ? styles.navigationButtonActive : styles.navigationButtonInactive)
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.target.style.color = '#111827';
                                            e.target.style.backgroundColor = '#f9fafb';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.target.style.color = '#6b7280';
                                            e.target.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <Icon style={styles.navigationIcon} />
                                    <span style={styles.navigationTextVisible}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Content */}
                <div style={isMobile && navigationItems.length > 1 ? styles.contentWithBottomNav : styles.content}>
                    {renderContent()}
                </div>
            </div>

            {/* Mobile Bottom Navigation - Hidden if only one tab */}
            {isMobile && navigationItems.length > 1 && (
                <div style={styles.navigationMobile}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        ...styles.navigationMobileButton,
                                        color: isActive ? '#2563eb' : '#6b7280'
                                    }}
                                >
                                    <Icon style={{
                                        width: '24px',
                                        height: '24px',
                                        color: isActive ? '#2563eb' : '#6b7280'
                                    }} />
                                    <span style={{
                                        ...styles.navigationMobileText,
                                        color: isActive ? '#2563eb' : '#6b7280'
                                    }}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// Loading spinner component
const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px'
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

// Styles
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
    },
    wrapper: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px',
        paddingTop: '32px'
    },
    navigationContainer: {
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        backgroundColor: 'white',
        padding: '6px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        flexDirection: 'row',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
    },
    navigationButton: {
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 8px',
        borderRadius: '8px',
        fontWeight: '500',
        fontSize: '14px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minHeight: '48px',
        minWidth: '60px',
        whiteSpace: 'nowrap'
    },
    navigationButtonActive: {
        backgroundColor: '#2563eb',
        color: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    navigationButtonInactive: {
        color: '#6b7280',
        backgroundColor: 'transparent'
    },
    navigationIcon: {
        width: '20px',
        height: '20px'
    },
    navigationTextVisible: {
        display: 'inline'
    },
    content: {
        transition: 'all 0.3s ease-in-out'
    },
    navigationMobile: {
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'white',
        padding: '8px 12px 24px 12px',
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.05)',
        zIndex: '50'
    },
    navigationMobileButton: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        padding: '8px 4px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minHeight: '56px'
    },
    navigationMobileText: {
        fontSize: '11px',
        fontWeight: '500',
        lineHeight: '1'
    },
    contentWithBottomNav: {
        paddingBottom: '100px'
    }
};

export default Dashboard;