import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginPopup from '../components/popup/LoginPopup';
import CreateAccountPopup from '../components/popup/CreateAccountPopup';
import Logo from '../assets/logo.png'; // Assuming you have a logo image

const SearchIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const MenuIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

const XIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

// Main Navbar Component
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const navLinks = [
        { name: 'Home', to: '/' },
        { name: 'Rental', to: '/rentals' },
        { name: 'Events', to: '/events' },
    ];

    return (
        <>
            <header className="text-white bg-primary shadow-md font-sans">
                <div className="container mx-auto px-12">
                    <div className="flex items-center justify-between h-20">
                        {/* Left Section: Logo and Nav Links */}
                        <div className="flex items-center space-x-8">
                            {/* Logo */}
                            <Link to="/" className="flex items-center space-x-2">
                                <img src={Logo} alt="Bazaarku Logo" className="w-full h-20 object-contain" />
                            </Link>

                            {/* Desktop Nav Links */}
                            <nav className="hidden md:flex items-center space-x-6">
                                {navLinks.map((link) => (
                                    <Link key={link.name} to={link.to} className="font-bold text-lg hover:text-gray-300 transition-colors duration-300">
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        {/* End Left Section */}
                        {/* Middle Section: Search Bar (Visible on larger screens) */}
                        <div className="hidden lg:flex flex-1 justify-center px-8">
                            <div className="relative w-full max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    className="w-full py-3 pl-5 pr-12 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                />
                                <SearchIcon className="absolute top-1/2 right-4 -translate-y-1/2 h-6 w-6 text-gray-500" />
                            </div>
                        </div>
                        {/* End Middle Section */}
                        {/* Right Section: Login Button and Mobile Menu */}
                        <div className="flex items-center space-x-4">
                            {/* Login Button */}
                            <Link
                                to="#"
                                onClick={() => setShowLogin(true)}
                                className="hidden sm:block bg-white text-primary font-bold py-2 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white transition-all duration-300"
                            >
                                Login
                            </Link>
                            {/* Mobile Menu Button */}
                            <div className="md:hidden">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:text-gray-300 focus:outline-none">
                                    {isMenuOpen ? <XIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
                                </button>
                            </div>
                        </div>
                        {/* End Right Section */}
                    </div>
                    {/* Mobile Menu (collapsible) */}
                    {isMenuOpen && (
                        <div className="md:hidden pt-2 pb-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.to} className="block px-3 py-2 rounded-md text-base font-semibold hover:bg-blue-700">
                                    {link.name}
                                </Link>
                            ))}
                            <div className="sm:hidden pt-2">
                                <Link
                                    to="#"
                                    onClick={() => setShowLogin(true)}
                                    className="w-full block bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition-all duration-300"
                                >
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
}

export default Navbar;