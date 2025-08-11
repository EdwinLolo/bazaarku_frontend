const Loading = ({ message }) => (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-800"></div>
        {message && (
            <div className="flex items-center justify-center w-full">
                <p className="mt-4 text-lg font-bold text-primary text-center w-full">{message}</p>
            </div>
        )}
    </div>
);

export default Loading;