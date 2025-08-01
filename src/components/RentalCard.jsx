import { Link } from 'react-router-dom';

const RentalCard = ({ imageUrl, title, className = '', id }) => {
    return (
        <Link
            key={id}
            to={`/rentals`}
            className={`group relative w-full h-80 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/70 cursor-pointer ${className}`}
        >
            <div className="relative w-full h-full">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="absolute bottom-0 inset-x-0 h-[66.67%] bg-gradient-to-t from-gray-900/90 to-transparent flex flex-col justify-end p-6 transition-all duration-500 ease-in-out group-hover:from-blue-900/90">
                <h3 className="text-white text-3xl font-extrabold mb-2 drop-shadow-lg transition-all duration-500 ease-in-out group-hover:-translate-y-2 group-hover:text-sky-300">
                    {title}
                </h3>
            </div>
        </Link>
    );
};

export default RentalCard;
