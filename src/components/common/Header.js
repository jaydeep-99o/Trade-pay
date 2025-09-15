// src/components/common/Header.js
import React from 'react';
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../firebase/auth';

export const Header = () => {
    const { currentUser, userData } = useAuth();

    const handleLogout = async () => {
        await logoutUser();
    };

    // Mobile-first inline styles
    const styles = {
        // Header container styles
        header: {
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid #e5e7eb'
        },
        headerInner: {
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '0 16px'
        },
        headerContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0'
        },

        // Left section styles
        leftSection: {
            display: 'flex',
            alignItems: 'center'
        },
        logoContainer: {
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        logoIcon: {
            width: '24px',
            height: '24px',
            color: 'white'
        },
        appName: {
            marginLeft: '12px',
            fontSize: '20px',
            fontWeight: '700',
            color: '#111827',
            margin: '0'
        },

        // Right section styles
        rightSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },

        // User info styles
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        userIcon: {
            width: '20px',
            height: '20px',
            color: '#9ca3af'
        },
        userName: {
            fontSize: '14px',
            color: '#374151',
            margin: '0'
        },

        // Logout button styles
        logoutButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            outline: 'none'
        },
        logoutButtonHover: {
            color: '#111827',
            backgroundColor: '#f9fafb'
        },
        logoutIcon: {
            width: '20px',
            height: '20px'
        },
        logoutText: {
            margin: '0'
        },

        // Mobile responsive adjustments
        '@media (max-width: 640px)': {
            headerInner: {
                padding: '0 12px'
            },
            headerContent: {
                padding: '12px 0'
            },
            appName: {
                fontSize: '18px'
            },
            rightSection: {
                gap: '12px'
            },
            userName: {
                display: 'none' // Hide username on very small screens
            },
            logoutText: {
                display: 'none' // Show only icon on small screens
            }
        }
    };

    return (
        <header style={styles.header}>
            <div style={styles.headerInner}>
                <div style={styles.headerContent}>
                    {/* Left Section - Logo and App Name */}
                    <div style={styles.leftSection}>
                        <div style={styles.logoContainer}>
                            <Shield style={styles.logoIcon} />
                        </div>
                        <h1 style={styles.appName}>TradePay</h1>
                    </div>

                    {/* Right Section - User Info and Logout */}
                    <div style={styles.rightSection}>
                        {/* User Info */}
                        <div style={styles.userInfo}>
                            <User style={styles.userIcon} />
                            <span style={styles.userName}>
                                {userData?.name || currentUser?.displayName || 'User'}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            style={styles.logoutButton}
                            onMouseEnter={(e) => {
                                Object.assign(e.target.style, styles.logoutButtonHover);
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#6b7280';
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            <LogOut style={styles.logoutIcon} />
                            <span style={styles.logoutText}>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};