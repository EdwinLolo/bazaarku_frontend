import { FaWhatsapp, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

const App = () => {
    return (
        <footer className="bg-primary text-white py-4 px-4 sm:px-8 md:px-12 lg:px-14">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-0 sm:gap-8">
                {/* Logo Section */}
                <div className="flex items-center mb-6 lg:mb-0">
                    <img src={Logo} alt="Bazaarku Logo" className="h-32 w-auto mr-4" />
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-row gap-4 sm:gap-8 text-xl font-bold mb-6 lg:mb-0">
                    <Link to="/" className="hover:text-gray-300 transition-colors duration-200">Home</Link>
                    <Link to="/rentals" className="hover:text-gray-300 transition-colors duration-200">Rental</Link>
                    <Link to="/events" className="hover:text-gray-300 transition-colors duration-200">Events</Link>
                </nav>

                {/* Contact and Social Media */}
                <div className="flex flex-col items-center lg:items-end text-center lg:text-right mt-2 sm:mt-0">
                    <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200">
                            <FaWhatsapp size={24} strokeWidth={3} className="text-green-600" />
                        </a>
                        <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200">
                            <FaTiktok size={24} className="text-black" />
                        </a>
                        <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200">
                            <FaYoutube size={24} className="text-red-600" />
                        </a>
                    </div>
                    <p className="mt-4 font-semibold">Hak Cipta &copy; 2025 Bazaarku. Hak Cipta Dilindungi Undang-undang.</p>
                </div>
            </div>
        </footer>
    );
};

export default App;