// src/components/common/Loading.js
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default Loading;


