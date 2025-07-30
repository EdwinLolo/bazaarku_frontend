import { X, Lock, Mail, User } from 'lucide-react';

function CreateAccountPopup({ onClose, onLoginClick }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div
                className="absolute inset-0 backdrop-blur-sm bg-black/50 pointer-events-auto"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md pointer-events-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Create an account</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                            <X size={24} />
                        </button>
                    </div>

                    <p className="mb-6 text-gray-600">
                        Already have an account?
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="ml-1 text-blue-600 hover:underline font-medium cursor-pointer"
                        >
                            Login
                        </button>
                    </p>

                    <form>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enter your Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-start mb-6">
                            <input
                                type="checkbox"
                                className="mt-1 mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <label className="text-sm text-gray-700">
                                I agree to Terms and Conditions
                            </label>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="text-center mb-4">
                            <button
                                type="button"
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAccountPopup;
