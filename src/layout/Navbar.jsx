import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react"; // Import icons from lucide-react
import LoginPopup from "../components/popup/LoginPopup";
import CreateAccountPopup from "../components/popup/CreateAccountPopup";
import Logo from "../assets/logo.png"; // Assuming you have a logo image

// Main Navbar Component
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const navLinks = [
        { name: "Home", to: "/" },
        { name: "Rental", to: "/rentals" },
        { name: "Events", to: "/events" },
    ];

    return (
        <>
            <header className="font-sans text-white shadow-md bg-primary">
                <div className="container px-12 mx-auto">
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
                        <div className="flex items-center space-x-4">
                            {/* Login Button */}
                            <Link
                                to="#"
                                onClick={() => setShowLogin(true)}
                                className="hidden px-6 py-2 font-bold transition-all duration-300 bg-white rounded-lg sm:block text-primary hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
                                Login
                            </Link>
                            {/* Mobile Menu Button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="hover:text-gray-300 focus:outline-none">
                                    {isMenuOpen ? (
                                        // Using Lucide X icon when menu is open
                                        <X className="h-7 w-7" />
                                    ) : (
                                        // Using Lucide Menu icon when menu is closed
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
                                    className="block px-3 py-2 text-base font-semibold rounded-md hover:bg-blue-700">
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-2 sm:hidden">
                                <Link
                                    to="#"
                                    onClick={() => setShowLogin(true)}
                                    className="block w-full px-4 py-2 font-bold transition-all duration-300 bg-white rounded-full text-primary hover:bg-gray-200">
                                    Login
                                </Link>
                            </div>
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
