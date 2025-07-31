import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Animated Floating Icon */}
                <div className="relative mx-auto mb-8">
                    <div className="absolute -inset-4 bg-indigo-200 dark:bg-indigo-900 rounded-full opacity-70 blur-lg animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-full shadow-lg inline-flex">
                        <Compass
                            className="w-16 h-16 text-indigo-600 dark:text-indigo-400"
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                {/* 404 Text */}
                <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-2">
                    404
                </h1>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Oops! The page you're looking for has been lost in the digital wilderness.
                    Let's get you back to civilization.
                </p>

                {/* Home Button */}
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Return to Home
                </Link>

                {/* Decorative Elements */}
                <div className="mt-12 flex justify-center space-x-4">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="h-3 w-3 bg-indigo-400 dark:bg-indigo-600 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;