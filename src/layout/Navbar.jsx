import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, UserRound, ChevronDown } from "lucide-react";
import LoginPopup from "../components/popup/LoginPopup";
import CreateAccountPopup from "../components/popup/CreateAccountPopup";
import Logo from "../assets/logo.png";
import { logout as logoutAPI } from "../models/auth";
import { useAuth } from "../App";

// Main Navbar Component
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    // Use the custom auth hook to access authentication state
    const { user, isAuthenticated, logout, login } = useAuth();

    const navLinks = [
        { name: "Home", to: "/" },
        { name: "Rental", to: "/rentals" },
        { name: "Events", to: "/events" },
    ];

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            await logoutAPI();
            logout();
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("Logout error:", error);
            // Even if API fails, clear local state
            logout();
        }
    };

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* <header className="font-sans text-white shadow-md bg-primary sticky top-0 z-50"> */}
            <header className="font-sans text-white shadow-md bg-primary">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between h-20">
                        {/* Left Section: Logo and Nav Links */}
                        <div className="flex items-center space-x-8">
                            {/* Logo */}
                            <Link to="/" className="flex items-center space-x-2">
                                <img
                                    src={Logo}
                                    alt="Bazaarku Logo"
                                    className="object-contain w-full h-20"
                                />
                            </Link>

                            {/* Desktop Nav Links */}
                            <nav className="items-center hidden space-x-6 md:flex">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.to}
                                        className="text-lg font-bold transition-colors duration-300 hover:text-gray-300">
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        {/* End Left Section */}

                        {/* Middle Section: Search Bar (Visible on larger screens) */}
                        <div className="justify-center flex-1 hidden px-8 lg:flex">
                            <div className="relative w-full max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    className="w-full py-2.5 pl-5 pr-12 text-gray-800 transition-all duration-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                {/* Using Lucide Search icon */}
                                <Search className="absolute w-6 h-6 text-gray-500 -translate-y-1/2 top-1/2 right-4" />
                            </div>
                        </div>
                        {/* End Middle Section */}

                        {/* Right Section: Login Button and Mobile Menu */}
                        <div className="flex items-center">
                            {/* Login Button */}
                            {isAuthenticated ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={handleDropdownToggle}
                                        className="flex items-center gap-2 px-4 py-2 bg-transparent rounded-full transition-all duration-300 hover:text-primary focus:outline-none hover:ring-2 focus:ring-white cursor-pointer"
                                    >
                                        <span className="hidden lg:block font-semibold text-lg">
                                            {user?.first_name || "Account"}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            strokeWidth={3}
                                        />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 w-64 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {user?.first_name} {user?.last_name}
                                                </p>
                                                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                                            </div>

                                            <div className="mx-4 border-b border-gray-200"></div>

                                            <div className="flex flex-col gap-2 p-4">
                                                {user?.role === "admin" && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition cursor-pointer"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="cursor-pointer hidden px-6 py-2 font-bold transition-all duration-300 bg-white rounded-lg sm:block text-primary hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                                >
                                    Login
                                </button>
                            )}

                            {/* Mobile Menu Button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="hover:text-gray-300 focus:outline-none">
                                    {isMenuOpen ? (
                                        <X className="h-7 w-7" />
                                    ) : (
                                        <Menu className="h-7 w-7" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {/* End Right Section */}
                    </div>

                    {/* Mobile Menu (collapsible) */}
                    {isMenuOpen && (
                        <div className="pt-2 pb-4 space-y-2 md:hidden">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-2 text-base font-bold rounded-md hover:bg-blue-700">
                                    {link.name}
                                </Link>
                            ))}
                            {!isAuthenticated ? (
                                <div className="pt-2 sm:hidden">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowLogin(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full px-4 py-2 font-bold transition-all duration-300 bg-white rounded-full text-primary hover:bg-gray-200"
                                    >
                                        Login
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-2 sm:hidden">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full px-4 py-2 font-bold transition-all duration-300 bg-red-600 rounded-full text-white hover:bg-red-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>
            {/* Login Popup */}
            {showLogin && (
                <LoginPopup
                    onClose={() => setShowLogin(false)}
                    onRegisterClick={() => {
                        setShowLogin(false);
                        setShowCreate(true);
                    }}
                />
            )}
            {/* Create Account Popup */}
            {showCreate && (
                <CreateAccountPopup
                    onClose={() => setShowCreate(false)}
                    onLoginClick={() => {
                        setShowCreate(false);
                        setShowLogin(true);
                    }}
                />
            )}
        </>
    );
};

export default Navbar;