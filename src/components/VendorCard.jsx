import { MapPin } from "lucide-react";
import { Link } from 'react-router-dom';

const VendorCard = ({ vendor }) => {
    const { banner, name, location, id } = vendor;
    const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

    return (
        <Link
            to={`/vendors/${id}`}
            className="group relative w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-400/50 cursor-pointer"
        >
            <div className="relative w-full aspect-[16/9] overflow-hidden">
                <img
                    src={banner}
                    alt={name}
                    className="w-full h-full object-cover transition-all duration-500 lg:grayscale lg:group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent"></div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-4 text-white transition-all duration-300 transform lg:translate-y-full lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100
                        bg-gradient-to-t from-transparent via-black/50 to-black/90">
                <h3 className="text-2xl font-extrabold mb-1 tracking-tight drop-shadow-lg">
                    {capitalizeFirst(name)}
                </h3>
                <div className="flex items-center text-sm font-medium drop-shadow-lg">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Based in {capitalizeFirst(location)}</span>
                </div>
            </div>
        </Link>
    );
};

export default VendorCard;