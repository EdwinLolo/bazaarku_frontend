import {
    Mail,
    X,
    Lock,
    ChevronRight,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { login as loginAPI } from "../../models/auth";
import { useAuth } from "../../App";

function LoginPopup({ onClose, onRegisterClick }) {
    const navigate = useNavigate(); // Add this hook
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await loginAPI(formData.email, formData.password);

            if (response) {
                console.log("Login successful:", response);

                // Store token if provided
                if (response.session) {
                    localStorage.setItem("session_token", response.session);
                }

                // Store user data
                const userData = response.user;
                if (userData) {
                    localStorage.setItem("user_data", JSON.stringify(userData));
                }

                const userData2 = response.profile;
                if (userData2) {
                    localStorage.setItem("user_profile", JSON.stringify(userData2));
                }

                login(response);

                // Navigate based on user role
                if (userData2?.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }

                // Close the popup
                onClose();
                // Optional: Show success message
                // You can replace this with a toast notification
                console.log(`Welcome ${userData?.first_name || "User"}!`);
            } else {
                // Handle API error response
                setErrors({
                    general: response.message || response.error || "Login failed",
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors({
                general:
                    error.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
                className="absolute inset-0 pointer-events-auto backdrop-blur-sm bg-black/50"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md mx-4 bg-white shadow-2xl pointer-events-auto rounded-xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Sign in with email</h2>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-500 transition-colors rounded-full cursor-pointer hover:text-gray-700 hover:bg-gray-100"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {/* General error message */}
                        {errors.general && (
                            <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                                {errors.general}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none ${errors.email
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                    placeholder="you@example.com"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                                    size={18}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full py-2 pl-10 pr-12 border rounded-lg focus:ring-2 focus:outline-none ${errors.password
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                                    disabled={isLoading}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="mb-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center w-full px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 animate-spin" size={18} />
                                        Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </div>

                        {/* Register Link */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onRegisterClick}
                                className="flex items-center justify-center font-medium text-blue-600 hover:underline focus:outline-none"
                                disabled={isLoading}>
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
