import { MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ imageUrl, title, location, date, id }) => {
    return (
        <Link to={`/events/${id}`} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 w-full">
            <div className="h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-1">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{date}</span>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;