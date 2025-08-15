import { MapPin, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    // I'm using the corrected code from our previous conversation
    const { banner, name, location, start_date, end_date, id, price, average_rating } = event;

    const formattedStartDate = new Date(start_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    const formattedEndDate = new Date(end_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

    const date = `${formattedStartDate} - ${formattedEndDate}`;

    const formattedPrice = typeof price === 'number'
        ? price.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        })
        : 'Price not available';

    return (
        <Link
            to={`/events/${id}`}
            className="group relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-100/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-blue-400/50 flex flex-col"
        >
            <div className="relative w-full aspect-[16/9] overflow-hidden">
                <img
                    src={banner}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3 text-md font-semibold text-white py-1 px-3 rounded-2xl bg-blue-700">{formattedPrice}</div>
            </div>

            {/* vvv THIS IS THE LINE THAT WAS CHANGED vvv */}
            <div className="relative p-6 bg-white text-gray-900 transition-all duration-500 ease-in-out flex-1 flex flex-col justify-between">
                <div> {/* This wrapper div ensures the title and its margin are grouped together at the top */}
                    <h3 className="mb-2 text-2xl font-bold transition-colors duration-300 group-hover:text-blue-600">
                        {name}
                    </h3>
                </div>

                <div className="flex flex-col space-y-1 text-sm font-medium text-gray-700 transition-colors duration-300">
                    <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-sky-500" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="flex mr-2">
                            {[...Array(5)].map((_, index) => {
                                const ratingCount = average_rating || 0;
                                const isFilled = index < Math.floor(ratingCount);
                                const isPartiallyFilled = index < ratingCount && index >= Math.floor(ratingCount);

                                return (
                                    <Star
                                        key={index}
                                        className={`h-4 w-4 ${isFilled
                                                ? 'text-yellow-400 fill-current'
                                                : isPartiallyFilled
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                            }`}
                                    />
                                );
                            })}
                        </div>
                        <span className="font-semibold text-sm">
                            {average_rating ? average_rating.toFixed(1) : 'No rating'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;