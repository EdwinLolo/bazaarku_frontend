import { X, Lock, Mail, User } from 'lucide-react';
import Logo from '../../assets/logo.png'; // Assuming Logo is correctly imported

function CreateAccountPopup({ onClose, onLoginClick }) {
    return (
        // Fixed overlay for the popup, covering the entire screen
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none font-inter">
            {/* Backdrop for blurring and closing the popup */}
            <div
                className="absolute inset-0 backdrop-blur-sm bg-black/50 pointer-events-auto"
                onClick={onClose}
            />
            {/* Main popup container - responsive width and layout */}
            <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md md:max-w-3xl lg:max-w-4xl pointer-events-auto flex flex-col lg:flex-row overflow-hidden">
                {/* Left half - Logo/Image section (hidden on small screens, shown on medium/large) */}
                <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-8 rounded-l-xl">
                    {/* Placeholder for your logo or a relevant image */}
                    {/* Updated to prevent stretching using object-contain and max-width/height */}
                    <img src={Logo} alt="BazaarKu Logo" className="max-w-full max-h-full object-contain" />
                </div>

                {/* Right half - Form section */}
                <div className="w-full lg:w-1/2 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Create an account</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* First Name Input */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        id="firstName"
                                        type="text"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            {/* Last Name Input */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <div className="relative">
                                    {/* No icon for last name, but keeping relative for consistency if one were added */}
                                    <input
                                        id="lastName"
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Enter your Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="password"
                                    type="password"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Terms and Conditions Checkbox */}
                        <div className="flex items-start mb-6">
                            <input
                                id="terms"
                                type="checkbox"
                                className="mt-1 mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700 select-none">
                                I agree to <span className="text-blue-600 hover:underline cursor-pointer">Terms and Conditions</span>
                            </label>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        {/* Create Account Button */}
                        <div className="text-center mb-4">
                            <button
                                type="submit" // Changed to submit for form semantic, though current form has no onSubmit handler
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-gray-600 text-center text-sm">
                            Already have an account?
                            <button
                                type="button"
                                onClick={onLoginClick}
                                className="ml-1 text-blue-600 hover:underline font-medium cursor-pointer focus:outline-none"
                            >
                                Login
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAccountPopup;