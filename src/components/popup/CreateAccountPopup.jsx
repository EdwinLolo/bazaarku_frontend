import { useState } from "react";
import { X, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/logo.png";
import { signup } from "../../models/auth";
import Swal from "sweetalert2";

function CreateAccountPopup({ onClose, onLoginClick }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms and conditions";
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

    try {
      // Call signup API
      const result = await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        "user"
      );

      // Show success message with auto-close
      await Swal.fire({
        icon: "success",
        title: "Account Created Successfully!",
        html: `
                    <div style="text-align: center;">
                        <p>Welcome to BazaarKu, ${formData.firstName}!</p>
                        <p style="margin-top: 10px; color: #666;">
                            Redirecting to login in <span id="countdown">3</span> seconds...
                        </p>
                    </div>
                `,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: "Login Now",
        confirmButtonColor: "#3085d6",
        allowOutsideClick: false,
        didOpen: () => {
          // Countdown timer
          let timeLeft = 3;
          const countdownElement = document.getElementById("countdown");

          const timer = setInterval(() => {
            timeLeft--;
            if (countdownElement) {
              countdownElement.textContent = timeLeft;
            }
            if (timeLeft <= 0) {
              clearInterval(timer);
            }
          }, 1000);
        },
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        terms: false,
      });

      // Close current popup and open login popup
      onClose();

      // Small delay to ensure smooth transition
      setTimeout(() => {
        onLoginClick();
      }, 100);
    } catch (error) {
      console.error("Signup error:", error);

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.message ||
          "An error occurred while creating your account. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none font-inter">
      <div
        className="absolute inset-0 pointer-events-auto backdrop-blur-sm bg-black/50"
        onClick={onClose}
      />
      <div className="relative flex flex-col w-full max-w-md overflow-hidden bg-white shadow-lg pointer-events-auto rounded-xl md:max-w-3xl lg:max-w-4xl lg:flex-row">
        {/* Left half - Logo section */}
        <div className="items-center justify-center hidden p-8 lg:flex lg:w-1/2 bg-primary rounded-l-xl">
          <img
            src={Logo}
            alt="BazaarKu Logo"
            className="object-contain max-w-full max-h-full"
          />
        </div>

        {/* Right half - Form section */}
        <div className="w-full p-6 lg:w-1/2 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Create an account
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 transition-colors rounded-full cursor-pointer hover:text-gray-700 hover:bg-gray-100"
              disabled={isLoading}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Your existing form fields remain the same */}
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              {/* First Name Input */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-1 text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                    size={18}
                  />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name Input */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-1 text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                  size={18}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                  size={18}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  disabled={isLoading}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must contain uppercase, lowercase, and number (min. 6 chars)
              </p>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start mb-6">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                disabled={isLoading}
                className={`mt-1 mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer ${
                  errors.terms ? "border-red-500" : ""
                }`}
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 select-none">
                I agree to{" "}
                <span className="text-blue-600 cursor-pointer hover:underline">
                  Terms and Conditions
                </span>
              </label>
            </div>
            {errors.terms && (
              <p className="mb-4 text-xs text-red-500">{errors.terms}</p>
            )}

            <hr className="my-6 border-gray-200" />

            {/* Create Account Button */}
            <div className="mb-4 text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Login Link */}
            <p className="text-sm text-center text-gray-600">
              Already have an account?
              <button
                type="button"
                onClick={onLoginClick}
                disabled={isLoading}
                className="ml-1 font-medium text-blue-600 cursor-pointer hover:underline focus:outline-none disabled:opacity-50">
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
