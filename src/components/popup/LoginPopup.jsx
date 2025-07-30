import { X, Lock, Mail, ChevronRight } from 'lucide-react';

function LoginPopup({ onClose, onRegisterClick }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div
                className="absolute inset-0 backdrop-blur-sm bg-black/50 pointer-events-auto"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 pointer-events-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Sign in with email</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                            <X size={24} />
                        </button>
                    </div>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                                Login
                            </button>
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onRegisterClick}
                                className="text-blue-600 hover:underline font-medium flex items-center justify-center cursor-pointer"
                            >
                                Register Now <ChevronRight size={16} className="ml-1" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPopup;
