const RentalCard = ({ imageUrl, title, className = '' }) => {
    return (
        <div className={`relative rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 w-full ${className}`}>
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-xl font-bold">
                {title}
            </div>
        </div>
    );
};

export default RentalCard;