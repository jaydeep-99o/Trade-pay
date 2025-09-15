// src/components/common/Loading.js
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...' }) => {
    // Mobile-first inline styles
    const styles = {
        // Container styles
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
            padding: '16px'
        },

        // Content wrapper styles
        content: {
            textAlign: 'center'
        },

        // Spinner container styles
        spinnerContainer: {
            position: 'relative',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },

        // Main spinner styles
        spinner: {
            width: '40px',
            height: '40px',
            color: '#2563eb',
            animation: 'spin 1s linear infinite',
            zIndex: 2,
            position: 'relative'
        },
        spinnerLarge: {
            width: '48px',
            height: '48px'
        },

        // Pulse background styles
        pulseBackground: {
            position: 'absolute',
            width: '40px',
            height: '40px',
            backgroundColor: '#dbeafe',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
            opacity: 0.3
        },
        pulseBackgroundLarge: {
            width: '48px',
            height: '48px'
        },

        // Message text styles
        message: {
            color: '#6b7280',
            fontSize: '16px',
            fontWeight: '500',
            padding: '0 16px',
            maxWidth: '320px',
            margin: '0 auto 16px',
            lineHeight: '1.5'
        },
        messageLarge: {
            fontSize: '18px',
            maxWidth: '384px'
        },

        // Loading dots container
        dotsContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '4px',
            marginTop: '16px'
        },

        // Individual dot styles
        dot: {
            width: '8px',
            height: '8px',
            backgroundColor: '#60a5fa',
            borderRadius: '50%',
            animation: 'bounce 1.4s infinite ease-in-out'
        },

        // Brand section styles
        brandSection: {
            marginTop: '32px',
            opacity: 0.6
        },
        brandText: {
            fontSize: '12px',
            color: '#9ca3af',
            margin: '0'
        },
        brandTextLarge: {
            fontSize: '14px'
        }
    };

    // Add CSS animations via useEffect
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.3; }
                50% { transform: scale(1.1); opacity: 0.1; }
            }
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Responsive breakpoint check (simple approach for inline styles)
    const [isLargeScreen, setIsLargeScreen] = React.useState(false);

    React.useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 640);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {/* Loading Spinner */}
                <div style={styles.spinnerContainer}>
                    <Loader2 style={{
                        ...styles.spinner,
                        ...(isLargeScreen ? styles.spinnerLarge : {})
                    }} />
                    {/* Pulse Background */}
                    <div style={{
                        ...styles.pulseBackground,
                        ...(isLargeScreen ? styles.pulseBackgroundLarge : {})
                    }} />
                </div>
                
                {/* Loading Message */}
                <p style={{
                    ...styles.message,
                    ...(isLargeScreen ? styles.messageLarge : {})
                }}>
                    {message}
                </p>
                
                {/* Loading Dots Animation */}
                <div style={styles.dotsContainer}>
                    <div style={{
                        ...styles.dot,
                        animationDelay: '0ms'
                    }} />
                    <div style={{
                        ...styles.dot,
                        animationDelay: '150ms'
                    }} />
                    <div style={{
                        ...styles.dot,
                        animationDelay: '300ms'
                    }} />
                </div>
                
                {/* Brand Section */}
                <div style={styles.brandSection}>
                    <p style={{
                        ...styles.brandText,
                        ...(isLargeScreen ? styles.brandTextLarge : {})
                    }}>
                        TradePay
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Loading;