// src/components/common/ErrorMessage.js
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
    // Mobile-first inline styles
    const styles = {
        // Container styles
        container: {
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px'
        },
        
        // Content wrapper styles
        content: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
        },

        // Icon styles
        iconContainer: {
            flexShrink: 0
        },
        icon: {
            width: '20px',
            height: '20px',
            color: '#ef4444'
        },

        // Text content styles
        textContent: {
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },

        // Message text styles
        message: {
            color: '#dc2626',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: '0'
        },

        // Retry button styles
        retryButton: {
            color: '#dc2626',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: '4px 0',
            transition: 'color 0.2s ease',
            outline: 'none',
            textAlign: 'left'
        },
        retryButtonHover: {
            color: '#991b1b'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {/* Error Icon */}
                <div style={styles.iconContainer}>
                    <AlertCircle style={styles.icon} />
                </div>

                {/* Text Content */}
                <div style={styles.textContent}>
                    {/* Error Message */}
                    <p style={styles.message}>{message}</p>

                    {/* Retry Button */}
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            style={styles.retryButton}
                            onMouseEnter={(e) => {
                                Object.assign(e.target.style, styles.retryButtonHover);
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#dc2626';
                            }}
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};