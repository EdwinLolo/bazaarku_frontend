import { MapPin, Clock, CheckCircle } from "lucide-react";

const RentalProductCard = ({ product, className = '', onClick }) => {
    const { banner, name, price, location, is_ready } = product;

    const formattedPrice = typeof price === 'number'
        ? price.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        })
        : 'Price not available';

    return (
        <div
            className={`relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
                hover:shadow-lg hover:ring-1 hover:ring-primary-500/30 transition-all duration-300 group
                flex flex-col h-full ${className}`}
            onClick={onClick}
        >
            <div className="absolute top-4 right-4 z-10">
                <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full
                        ${is_ready
                            // Use solid background colors for better visibility
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-amber-100 text-amber-800 border-2 border-amber-300'}`}
                >
                    {is_ready ? <CheckCircle size={14} className="text-green-600" /> : <Clock size={14} className="text-amber-600" />}
                    <span className="mt-0.5">{is_ready ? "Available Now" : "Reserved"}</span>
                </span>
            </div>

            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                    src={banner}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    // Added a fallback placeholder image in case the banner URL is broken
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=Image+Not+Found' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-4 pt-3.5 flex flex-col flex-grow gap-3">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
                    {name}
                </h3>

                <div>
                    <div className="flex items-end justify-between">
                        <div className="text-xl font-bold text-gray-900">
                            {formattedPrice}
                        </div>
                        <div className="text-xs font-medium text-gray-500"></div>
                    </div>

                    <div className="mt-3 flex items-center text-sm text-gray-600 gap-2 border-t border-gray-100 pt-3">
                        <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
};

export default RentalProductCard;