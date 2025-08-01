import { MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ imageUrl, name, location, start_date, end_date , id }) => {
    const formattedStartDate = new Date(start_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    const formattedEndDate = new Date(end_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

    const date = `${formattedStartDate} - ${formattedEndDate}`;
    
    return (
        <Link
            to={`/events/${id}`}
            className="group relative w-full h-92 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-blue-400/50"
        >
            <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            
            <div
                className="absolute inset-x-4 bottom-4 p-6 rounded-2xl bg-white/80 text-gray-900 shadow-lg transition-all duration-500 ease-in-out group-hover:translate-y-[-10px] group-hover:bg-white/95"
            >
                <h3 className="mb-2 text-2xl font-bold transition-colors duration-300 group-hover:text-blue-600">
                    {name}
                </h3>
                
                <div className="flex flex-col space-y-1 text-sm font-medium text-gray-700 transition-colors duration-300">
                    <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-sky-500" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
