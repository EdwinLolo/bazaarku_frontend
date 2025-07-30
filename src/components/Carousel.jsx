import React, { useState, useEffect } from 'react';

function Carousel() {
    const slides = [
        {
            url: 'https://placehold.co/1200x400/000033/FFFFFF?text=Event+1',
        },
        {
            url: 'https://placehold.co/1200x400/000033/FFFFFF?text=Event+2',
        },
        {
            url: 'https://placehold.co/1200x400/000033/FFFFFF?text=Event+3',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    }

    useEffect(() => {
        const timer = setTimeout(goToNext, 5000);
        return () => clearTimeout(timer);
    }, [currentIndex]);

    return (
        <div className="relative h-60 md:h-76 lg:h-90 w-full max-w-4xl group">
            <div style={{ backgroundImage: `url(${slides[currentIndex].url})` }} className="w-full h-full rounded-2xl bg-center bg-cover transition-all duration-500 ease-in-out flex flex-col justify-center items-center p-4">
            </div>
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center space-x-2">
                {slides.map((slide, slideIndex) => (
                    <div key={slideIndex} onClick={() => goToSlide(slideIndex)} className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'}`}>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Carousel;