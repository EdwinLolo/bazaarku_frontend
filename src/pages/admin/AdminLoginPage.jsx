import { Lock, Mail  } from 'lucide-react';

function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
                    </div>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="admin@example.com"
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
                        <div>
                            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLoginPage;