// src/components/common/Loading.js
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="text-center">
                {/* Loading spinner with mobile-optimized size */}
                <div className="relative">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600 mx-auto mb-4 sm:mb-6" />
                    {/* Optional: Add a subtle pulse background */}
                    <div className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full animate-pulse opacity-30 mx-auto"></div>
                </div>
                
                {/* Loading message with mobile-optimized typography */}
                <p className="text-gray-600 text-base sm:text-lg font-medium px-4 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                    {message}
                </p>
                
                {/* Optional: Add loading dots animation */}
                <div className="flex justify-center space-x-1 mt-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                
                {/* Brand consistency */}
                <div className="mt-8 opacity-60">
                    <p className="text-xs sm:text-sm text-gray-500">TradePay</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;