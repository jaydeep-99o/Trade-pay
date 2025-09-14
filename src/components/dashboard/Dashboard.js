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

    // Styles object for mobile-first design
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#f9fafb'
        },
        wrapper: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '16px',
            paddingTop: '32px',
            '@media (min-width: 640px)': {
                padding: '24px',
                paddingTop: '32px'
            },
            '@media (min-width: 1024px)': {
                padding: '32px',
                paddingTop: '32px'
            }
        },
        navigationContainer: {
            display: 'flex',
            gap: '4px',
            marginBottom: '24px',
            backgroundColor: 'white',
            padding: '6px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            // Mobile: Stack vertically on very small screens
            flexDirection: 'row',
            overflowX: 'auto',
            // Hide scrollbar
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
            minHeight: '48px', // Touch-friendly
            minWidth: '60px', // Prevent too narrow buttons
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
        navigationButtonInactiveHover: {
            color: '#111827',
            backgroundColor: '#f9fafb'
        },
        navigationIcon: {
            width: '20px',
            height: '20px'
        },
        navigationText: {
            display: 'none'
        },
        navigationTextVisible: {
            display: 'inline'
        },
        content: {
            transition: 'all 0.3s ease-in-out'
        },
        // Mobile-specific navigation styles
        navigationMobile: {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            backgroundColor: 'white',
            padding: '8px 12px 24px 12px', // Extra bottom padding for safe area
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
            paddingBottom: '100px' // Space for bottom navigation
        }
    };

    // Check if mobile (simple approach)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={styles.container}>
            <Header />

            <div style={styles.wrapper}>
                {/* Desktop Navigation Tabs */}
                {!isMobile && (
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
                                            e.target.style.color = styles.navigationButtonInactiveHover.color;
                                            e.target.style.backgroundColor = styles.navigationButtonInactiveHover.backgroundColor;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.target.style.color = styles.navigationButtonInactive.color;
                                            e.target.style.backgroundColor = styles.navigationButtonInactive.backgroundColor;
                                        }
                                    }}
                                >
                                    <Icon style={styles.navigationIcon} />
                                    <span style={window.innerWidth >= 640 ? styles.navigationTextVisible : styles.navigationText}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Content */}
                <div style={isMobile ? styles.contentWithBottomNav : styles.content}>
                    {renderContent()}
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
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

export default Dashboard;