// src/components/common/ErrorMessage.js
export const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};
