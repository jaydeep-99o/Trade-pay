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
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        // Clear general error
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
            // Success case will be handled by AuthContext
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">TradePay</h1>
                    <p className="text-gray-600">Digital payments for trading expo</p>
                </div>

                {/* Toggle Buttons */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        disabled={isLoading}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${isLogin
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        disabled={isLoading}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${!isLogin
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Register
                    </button>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* General Error */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-600 text-sm">{errors.general}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Name Field (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone Field (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                        )}

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                                </>
                            ) : (
                                isLogin ? 'Login to TradePay' : 'Create Account'
                            )}
                        </button>
                    </div>

                    {/* Additional Options */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={toggleMode}
                            disabled={isLoading}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLogin
                                ? "Don't have an account? Register here"
                                : 'Already have an account? Login here'
                            }
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    <p>Secure digital payments • Trading Expo 2024</p>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;