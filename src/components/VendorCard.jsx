import { MapPin } from "lucide-react";
import { Link } from 'react-router-dom';

const VendorCard = ({ imageUrl, name, location, id }) => {
    const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

    return (
        <Link
            to={`/vendors/${id}`}
            className="group relative w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer"
        >
            <div className="relative w-full h-64 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent"></div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-6 text-white transition-all duration-300 transform md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <h3 className="text-3xl font-extrabold mb-1 tracking-tight drop-shadow-lg">
                    {capitalizeFirst(name)}
                </h3>
                <div className="flex items-center text-sm font-medium drop-shadow-lg">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Based in {capitalizeFirst(location)}</span>
                </div>
            </div>
        </Link>
    );
};

export default VendorCard;