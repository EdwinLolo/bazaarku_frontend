import React from 'react';

const Loading = ({ message }) => (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-800"></div>
        {message && <p className="mt-4 text-lg font-bold text-primary">{message}</p>}
    </div>
);

export default Loading;