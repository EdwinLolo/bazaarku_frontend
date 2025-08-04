import React from 'react';
import { CircleAlert, RefreshCw } from 'lucide-react';

function ErrorDisplay({ error, onRetry }) {
    return (
        <div className="min-h-screen flex items-center justify-center text-gray-900 antialiased">
            {/* Error Card with animation */}
            <div className="relative animate-fade-in-scale flex flex-col items-center w-full max-w-md p-8 overflow-hidden text-center bg-white/80 backdrop-blur-lg border border-red-200/50 rounded-2xl shadow-2xl">
                {/* Pulsing Icon Container */}
                <div className="relative mb-5">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse-slow opacity-20"></div>
                    <div className="relative flex items-center justify-center w-20 h-20 bg-red-500 rounded-full">
                        <CircleAlert className="text-white" size={48} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-3xl font-bold text-gray-800">
                    Oops!
                </h2>
                <p className="mt-2 text-base text-gray-600">
                    {error}
                </p>

                {/* Retry Button */}
                <button
                    className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 mt-8 font-semibold text-white transition-all duration-300 bg-red-500 rounded-full shadow-lg hover:bg-red-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                    onClick={onRetry}
                >
                    <RefreshCw size={18} />
                    <span>Refresh</span>
                </button>
            </div>
        </div>
    );
}

export default ErrorDisplay;