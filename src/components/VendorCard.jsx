import { Link } from 'react-router-dom';

const VendorCard = ({ imageUrl, title, location, id }) => {
    return (
        <Link to={`/vendors/${id}`} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 w-full">
            <div className="h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-1">
                    <span>{location}</span>
                </div>
            </div>
        </Link>
    );
};

export default VendorCard;