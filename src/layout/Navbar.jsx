import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginPopup from "../components/popup/LoginPopup";
import CreateAccountPopup from "../components/popup/CreateAccountPopup";
import Logo from "../assets/logo.png"; // Assuming you have a logo image

const SearchIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
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
                  className="w-full py-3 pl-5 pr-12 text-gray-800 transition-all duration-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <SearchIcon className="absolute w-6 h-6 text-gray-500 -translate-y-1/2 top-1/2 right-4" />
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
                    <XIcon className="h-7 w-7" />
                  ) : (
                    <MenuIcon className="h-7 w-7" />
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
