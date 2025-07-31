import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const RentalProductCard = ({ imageUrl, title, price, location, id, className = '', rental_category }) => {
    return (
        <Link to={`/rentals/${rental_category}/${id}`} className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 w-full ${className}`}>
            {/* Product Image */}
            <div className="h-40 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Product Details */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-xl font-bold text-gray-900 mb-2">{price}</p>
                <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{location}</span>
                </div>
            </div>
        </Link>
    );
};

export default RentalProductCard;