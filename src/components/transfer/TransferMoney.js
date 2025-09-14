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

    // Mobile-first inline styles
    const styles = {
        container: {
            maxWidth: '28rem',
            margin: '0 auto'
        },

        // Main Card styles
        mainCard: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            padding: '24px'
        },

        // Header styles
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
        },
        headerIcon: {
            backgroundColor: '#eff6ff',
            padding: '12px',
            borderRadius: '12px'
        },
        headerIconInner: {
            width: '24px',
            height: '24px',
            color: '#2563eb'
        },
        headerText: {
            flex: '1'
        },
        headerTitle: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 4px 0'
        },
        headerSubtitle: {
            color: '#6b7280',
            fontSize: '14px',
            margin: '0'
        },

        // Progress Steps styles
        progressContainer: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px'
        },
        progressStep: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '500'
        },
        progressStepActive: {
            backgroundColor: '#2563eb',
            color: 'white'
        },
        progressStepInactive: {
            backgroundColor: '#e5e7eb',
            color: '#6b7280'
        },
        progressLine: {
            flex: '1',
            height: '4px',
            margin: '0 8px'
        },
        progressLineActive: {
            backgroundColor: '#2563eb'
        },
        progressLineInactive: {
            backgroundColor: '#e5e7eb'
        },

        // Error Message styles
        errorContainer: {
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
        },
        errorContent: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        errorIcon: {
            width: '20px',
            height: '20px',
            color: '#ef4444'
        },
        errorText: {
            color: '#dc2626',
            fontSize: '14px',
            margin: '0'
        },

        // Step content container
        stepContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },

        // Form elements
        formGroup: {
            display: 'flex',
            flexDirection: 'column'
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px',
            display: 'block'
        },
        searchContainer: {
            display: 'flex',
            gap: '8px'
        },
        inputContainer: {
            position: 'relative',
            flex: '1'
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
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            outline: 'none'
        },
        inputWithIcon: {
            paddingLeft: '44px'
        },
        inputFocus: {
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
        },
        
        // Button styles
        button: {
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: 'none',
            outline: 'none'
        },
        buttonPrimary: {
            backgroundColor: '#2563eb',
            color: 'white'
        },
        buttonPrimaryHover: {
            backgroundColor: '#1d4ed8'
        },
        buttonSecondary: {
            backgroundColor: 'transparent',
            color: '#374151',
            border: '1px solid #d1d5db'
        },
        buttonSecondaryHover: {
            backgroundColor: '#f9fafb'
        },
        buttonSuccess: {
            backgroundColor: '#16a34a',
            color: 'white'
        },
        buttonSuccessHover: {
            backgroundColor: '#15803d'
        },
        buttonDisabled: {
            opacity: '0.5',
            cursor: 'not-allowed'
        },
        buttonFlex: {
            display: 'flex',
            gap: '12px'
        },
        buttonFlexItem: {
            flex: '1'
        },

        // Search Results styles
        searchResultsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        searchResultsTitle: {
            fontWeight: '500',
            color: '#111827',
            fontSize: '16px',
            margin: '0'
        },
        userItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        userItemHover: {
            borderColor: '#93c5fd',
            backgroundColor: '#eff6ff'
        },
        userIcon: {
            backgroundColor: '#f3f4f6',
            padding: '8px',
            borderRadius: '8px'
        },
        userIconInner: {
            width: '20px',
            height: '20px',
            color: '#6b7280'
        },
        userInfo: {
            flex: '1'
        },
        userName: {
            fontWeight: '500',
            color: '#111827',
            fontSize: '16px',
            margin: '0 0 4px 0'
        },
        userEmail: {
            fontSize: '14px',
            color: '#6b7280',
            margin: '0'
        },

        // Selected User Display styles
        selectedUserContainer: {
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '12px'
        },
        selectedUserLabel: {
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '4px',
            margin: '0 0 4px 0'
        },
        selectedUserInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        selectedUserIcon: {
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '8px'
        },

        // Amount section styles
        balanceInfo: {
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '4px',
            margin: '4px 0 0 0'
        },

        // Confirmation styles
        confirmationHeader: {
            textAlign: 'center'
        },
        confirmationTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 8px 0'
        },
        confirmationSubtitle: {
            color: '#6b7280',
            margin: '0'
        },
        confirmationDetails: {
            backgroundColor: '#f9fafb',
            padding: '24px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        confirmationRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        confirmationLabel: {
            color: '#6b7280'
        },
        confirmationValue: {
            textAlign: 'right'
        },
        confirmationValuePrimary: {
            fontWeight: '500',
            color: '#111827'
        },
        confirmationValueAmount: {
            fontWeight: '700',
            fontSize: '20px',
            color: '#111827'
        },
        confirmationDivider: {
            borderTop: '1px solid #e5e7eb',
            paddingTop: '16px'
        },

        // Success styles
        successContainer: {
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },
        successIconContainer: {
            display: 'flex',
            justifyContent: 'center'
        },
        successIconWrapper: {
            backgroundColor: '#f0fdf4',
            padding: '24px',
            borderRadius: '50%'
        },
        successIcon: {
            width: '48px',
            height: '48px',
            color: '#16a34a'
        },
        successTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 8px 0'
        },
        successSubtitle: {
            color: '#6b7280',
            margin: '0'
        },
        balanceUpdateContainer: {
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '12px'
        },
        balanceUpdateLabel: {
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '8px',
            margin: '0 0 8px 0'
        },
        balanceUpdateAmount: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            margin: '0'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.mainCard}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerIcon}>
                        <Send style={styles.headerIconInner} />
                    </div>
                    <div style={styles.headerText}>
                        <h2 style={styles.headerTitle}>Transfer Money</h2>
                        <p style={styles.headerSubtitle}>Send money to other traders</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div style={styles.progressContainer}>
                    {[1, 2, 3, 4].map((stepNum) => (
                        <React.Fragment key={stepNum}>
                            <div style={{
                                ...styles.progressStep,
                                ...(step >= stepNum ? styles.progressStepActive : styles.progressStepInactive)
                            }}>
                                {stepNum}
                            </div>
                            {stepNum < 4 && (
                                <div style={{
                                    ...styles.progressLine,
                                    ...(step > stepNum ? styles.progressLineActive : styles.progressLineInactive)
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div style={styles.errorContainer}>
                        <div style={styles.errorContent}>
                            <AlertCircle style={styles.errorIcon} />
                            <p style={styles.errorText}>{error}</p>
                        </div>
                    </div>
                )}

                {/* Step 1: Search User */}
                {step === 1 && (
                    <div style={styles.stepContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Search by Email or Phone
                            </label>
                            <div style={styles.searchContainer}>
                                <div style={styles.inputContainer}>
                                    <Search style={styles.searchIcon} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        style={{
                                            ...styles.input,
                                            ...styles.inputWithIcon
                                        }}
                                        onFocus={(e) => {
                                            Object.assign(e.target.style, styles.inputFocus);
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                        placeholder="Enter email or phone number"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={isLoading || !searchTerm.trim()}
                                    style={{
                                        ...styles.button,
                                        ...styles.buttonPrimary,
                                        ...(isLoading || !searchTerm.trim() ? styles.buttonDisabled : {})
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isLoading && searchTerm.trim()) {
                                            Object.assign(e.target.style, styles.buttonPrimaryHover);
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isLoading && searchTerm.trim()) {
                                            e.target.style.backgroundColor = '#2563eb';
                                        }
                                    }}
                                >
                                    {isLoading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div style={styles.searchResultsContainer}>
                                <h3 style={styles.searchResultsTitle}>Search Results</h3>
                                {searchResults.map((user) => (
                                    <div
                                        key={user.uid}
                                        onClick={() => selectUser(user)}
                                        style={styles.userItem}
                                        onMouseEnter={(e) => {
                                            Object.assign(e.currentTarget.style, styles.userItemHover);
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                            e.currentTarget.style.backgroundColor = 'white';
                                        }}
                                    >
                                        <div style={styles.userIcon}>
                                            <User style={styles.userIconInner} />
                                        </div>
                                        <div style={styles.userInfo}>
                                            <p style={styles.userName}>{user.name}</p>
                                            <p style={styles.userEmail}>{user.email}</p>
                                            {user.phone && (
                                                <p style={styles.userEmail}>{user.phone}</p>
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
                    <div style={styles.stepContainer}>
                        <div style={styles.selectedUserContainer}>
                            <p style={styles.selectedUserLabel}>Sending to</p>
                            <div style={styles.selectedUserInfo}>
                                <div style={styles.selectedUserIcon}>
                                    <User style={styles.userIconInner} />
                                </div>
                                <div>
                                    <p style={styles.userName}>{selectedUser.name}</p>
                                    <p style={styles.userEmail}>{selectedUser.email}</p>
                                </div>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={styles.input}
                                onFocus={(e) => {
                                    Object.assign(e.target.style, styles.inputFocus);
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                                placeholder="Enter amount"
                                min="1"
                                max={userData.balance}
                            />
                            <p style={styles.balanceInfo}>
                                Available balance: {formatCurrency(userData.balance)}
                            </p>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Description (Optional)
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={styles.input}
                                onFocus={(e) => {
                                    Object.assign(e.target.style, styles.inputFocus);
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                                placeholder="What's this for?"
                            />
                        </div>

                        <div style={styles.buttonFlex}>
                            <button
                                onClick={() => setStep(1)}
                                style={{
                                    ...styles.button,
                                    ...styles.buttonSecondary,
                                    ...styles.buttonFlexItem
                                }}
                                onMouseEnter={(e) => {
                                    Object.assign(e.target.style, styles.buttonSecondaryHover);
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                }}
                            >
                                Back
                            </button>
                            <button
                                onClick={proceedToConfirm}
                                style={{
                                    ...styles.button,
                                    ...styles.buttonPrimary,
                                    ...styles.buttonFlexItem
                                }}
                                onMouseEnter={(e) => {
                                    Object.assign(e.target.style, styles.buttonPrimaryHover);
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#2563eb';
                                }}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirm Transfer */}
                {step === 3 && (
                    <div style={styles.stepContainer}>
                        <div style={styles.confirmationHeader}>
                            <h3 style={styles.confirmationTitle}>Confirm Transfer</h3>
                            <p style={styles.confirmationSubtitle}>Please review the details below</p>
                        </div>

                        <div style={styles.confirmationDetails}>
                            <div style={styles.confirmationRow}>
                                <span style={styles.confirmationLabel}>To</span>
                                <div style={styles.confirmationValue}>
                                    <p style={styles.confirmationValuePrimary}>{selectedUser.name}</p>
                                    <p style={styles.userEmail}>{selectedUser.email}</p>
                                </div>
                            </div>

                            <div style={styles.confirmationRow}>
                                <span style={styles.confirmationLabel}>Amount</span>
                                <span style={{
                                    ...styles.confirmationValue,
                                    ...styles.confirmationValueAmount
                                }}>
                                    {formatCurrency(parseFloat(amount))}
                                </span>
                            </div>

                            {description && (
                                <div style={styles.confirmationRow}>
                                    <span style={styles.confirmationLabel}>Description</span>
                                    <span style={styles.confirmationValuePrimary}>{description}</span>
                                </div>
                            )}

                            <div style={{
                                ...styles.confirmationRow,
                                ...styles.confirmationDivider
                            }}>
                                <span style={styles.confirmationLabel}>Remaining Balance</span>
                                <span style={styles.confirmationValuePrimary}>
                                    {formatCurrency(userData.balance - parseFloat(amount))}
                                </span>
                            </div>
                        </div>

                        <div style={styles.buttonFlex}>
                            <button
                                onClick={() => setStep(2)}
                                style={{
                                    ...styles.button,
                                    ...styles.buttonSecondary,
                                    ...styles.buttonFlexItem
                                }}
                                onMouseEnter={(e) => {
                                    Object.assign(e.target.style, styles.buttonSecondaryHover);
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                }}
                            >
                                Back
                            </button>
                            <button
                                onClick={confirmTransfer}
                                disabled={isLoading}
                                style={{
                                    ...styles.button,
                                    ...styles.buttonSuccess,
                                    ...styles.buttonFlexItem,
                                    ...(isLoading ? styles.buttonDisabled : {})
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading) {
                                        Object.assign(e.target.style, styles.buttonSuccessHover);
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isLoading) {
                                        e.target.style.backgroundColor = '#16a34a';
                                    }
                                }}
                            >
                                {isLoading ? 'Processing...' : 'Confirm & Send'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && success && (
                    <div style={styles.successContainer}>
                        <div style={styles.successIconContainer}>
                            <div style={styles.successIconWrapper}>
                                <CheckCircle style={styles.successIcon} />
                            </div>
                        </div>

                        <div>
                            <h3 style={styles.successTitle}>Transfer Successful!</h3>
                            <p style={styles.successSubtitle}>
                                {formatCurrency(parseFloat(amount))} sent to {selectedUser.name}
                            </p>
                        </div>

                        <div style={styles.balanceUpdateContainer}>
                            <p style={styles.balanceUpdateLabel}>Updated Balance</p>
                            <p style={styles.balanceUpdateAmount}>{formatCurrency(userData.balance)}</p>
                        </div>

                        <button
                            onClick={resetTransfer}
                            style={{
                                ...styles.button,
                                ...styles.buttonPrimary,
                                width: '100%'
                            }}
                            onMouseEnter={(e) => {
                                Object.assign(e.target.style, styles.buttonPrimaryHover);
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#2563eb';
                            }}
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