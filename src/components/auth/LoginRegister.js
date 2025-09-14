// src/components/auth/LoginRegister.js
import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Smartphone, Shield, Loader2 } from 'lucide-react';
import { registerUser, loginUser } from '../../firebase/auth';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (errors.general) {
            setErrors(prev => ({
                ...prev,
                general: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!isLogin && !formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!isLogin && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            let result;
            if (isLogin) {
                result = await loginUser(formData.email, formData.password);
            } else {
                result = await registerUser(formData);
            }

            if (!result.success) {
                setErrors({ general: result.error });
            }
        } catch (error) {
            setErrors({ general: 'Something went wrong. Please try again.' });
        }

        setIsLoading(false);
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    // Styles object
    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #faf5ff 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '16px 12px'
        },
        wrapper: {
            width: '100%',
            maxWidth: '384px'
        },
        header: {
            textAlign: 'center',
            marginBottom: '24px'
        },
        logo: {
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        },
        logoIcon: {
            width: '28px',
            height: '28px',
            color: 'white'
        },
        title: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 4px 0'
        },
        subtitle: {
            fontSize: '14px',
            color: '#6b7280',
            margin: '0'
        },
        toggleContainer: {
            display: 'flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px'
        },
        toggleButton: {
            flex: '1',
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '14px',
            border: 'none',
            background: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minHeight: '48px'
        },
        toggleActive: {
            backgroundColor: 'white',
            color: '#2563eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        formCard: {
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            border: '1px solid #f3f4f6'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column'
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
        },
        inputWrapper: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
        },
        inputIcon: {
            position: 'absolute',
            left: '12px',
            width: '20px',
            height: '20px',
            color: '#9ca3af',
            zIndex: '1'
        },
        input: {
            width: '100%',
            padding: '16px 12px 16px 44px',
            fontSize: '16px',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            backgroundColor: 'white',
            transition: 'all 0.2s ease',
            outline: 'none'
        },
        inputError: {
            borderColor: '#ef4444',
            backgroundColor: '#fef2f2'
        },
        passwordInput: {
            paddingRight: '56px'
        },
        passwordToggle: {
            position: 'absolute',
            right: '12px',
            padding: '12px',
            border: 'none',
            background: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'color 0.2s ease',
            minHeight: '44px',
            minWidth: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        errorAlert: {
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
        },
        errorText: {
            color: '#ef4444',
            fontSize: '12px',
            margin: '4px 0 0 4px'
        },
        submitButton: {
            width: '100%',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            padding: '16px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minHeight: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        },
        spinner: {
            width: '20px',
            height: '20px',
            animation: 'spin 1s linear infinite'
        },
        toggleLink: {
            textAlign: 'center',
            marginTop: '20px'
        },
        linkButton: {
            color: '#2563eb',
            fontWeight: '500',
            fontSize: '14px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'color 0.2s ease',
            minHeight: '44px'
        },
        footer: {
            textAlign: 'center',
            marginTop: '16px',
            padding: '0 8px',
            fontSize: '12px',
            color: '#9ca3af'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logo}>
                        <Shield style={styles.logoIcon} />
                    </div>
                    <h1 style={styles.title}>TradePay</h1>
                    <p style={styles.subtitle}>Digital payments for trading expo</p>
                </div>

                {/* Toggle Buttons */}
                <div style={styles.toggleContainer}>
                    <button
                        onClick={() => setIsLogin(true)}
                        disabled={isLoading}
                        style={{
                            ...styles.toggleButton,
                            ...(isLogin ? styles.toggleActive : {})
                        }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        disabled={isLoading}
                        style={{
                            ...styles.toggleButton,
                            ...(!isLogin ? styles.toggleActive : {})
                        }}
                    >
                        Register
                    </button>
                </div>

                {/* Form Card */}
                <div style={styles.formCard}>
                    {/* General Error */}
                    {errors.general && (
                        <div style={styles.errorAlert}>
                            <p style={{ color: '#dc2626', fontSize: '14px', margin: '0' }}>
                                {errors.general}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {/* Name Field */}
                        {!isLogin && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Full Name</label>
                                <div style={styles.inputWrapper}>
                                    <User style={styles.inputIcon} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        style={{
                                            ...styles.input,
                                            ...(errors.name ? styles.inputError : {})
                                        }}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.name && <p style={styles.errorText}>{errors.name}</p>}
                            </div>
                        )}

                        {/* Email Field */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <div style={styles.inputWrapper}>
                                <Mail style={styles.inputIcon} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    style={{
                                        ...styles.input,
                                        ...(errors.email ? styles.inputError : {})
                                    }}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
                        </div>

                        {/* Phone Field */}
                        {!isLogin && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Phone Number</label>
                                <div style={styles.inputWrapper}>
                                    <Smartphone style={styles.inputIcon} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        style={{
                                            ...styles.input,
                                            ...(errors.phone ? styles.inputError : {})
                                        }}
                                        placeholder="Enter your phone number"
                                        autoComplete="tel"
                                    />
                                </div>
                                {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
                            </div>
                        )}

                        {/* Password Field */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.inputWrapper}>
                                <Lock style={styles.inputIcon} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    style={{
                                        ...styles.input,
                                        ...styles.passwordInput,
                                        ...(errors.password ? styles.inputError : {})
                                    }}
                                    placeholder="Enter your password"
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    style={styles.passwordToggle}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.password && <p style={styles.errorText}>{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        {!isLogin && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Confirm Password</label>
                                <div style={styles.inputWrapper}>
                                    <Lock style={styles.inputIcon} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        style={{
                                            ...styles.input,
                                            ...(errors.confirmPassword ? styles.inputError : {})
                                        }}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={styles.submitButton}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 style={styles.spinner} />
                                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                                </>
                            ) : (
                                isLogin ? 'Login to TradePay' : 'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Toggle Link */}
                    <div style={styles.toggleLink}>
                        <button
                            onClick={toggleMode}
                            disabled={isLoading}
                            style={styles.linkButton}
                        >
                            {isLogin
                                ? "Don't have an account? Register here"
                                : 'Already have an account? Login here'
                            }
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <p>Secure digital payments • Trading Expo 2024</p>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;