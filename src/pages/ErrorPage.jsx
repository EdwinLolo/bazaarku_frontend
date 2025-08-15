import { useRouteError } from "react-router-dom";
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800">Oops! Something went wrong.</h1>
            <p className="mt-2 text-lg text-gray-600">
                We encountered an unexpected error. Please try again later.
            </p>
            <p className="mt-4 p-2 bg-red-50 text-red-700 rounded-md font-mono text-sm">
                <i>{error.statusText || error.message}</i>
            </p>
            <a
                href="/"
                className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
                Go Back to Homepage
            </a>
        </div>
    );
}