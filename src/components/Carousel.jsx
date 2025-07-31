import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';
import { getBaseUrl } from '../models/utils';

const MIN_LOOP_SLIDES = 5;

function Carousel() {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slides, setDisplaySlides] = useState([]);
    const [originalSlides, setOriginalSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndPrepareSlides = async () => {
            setIsLoading(true);
            let fetchedData = [];
            try {
                const response = await fetch(`${getBaseUrl()}/banners/active`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Failed to fetch slides');

                const { data } = await response.json();
                fetchedData = data.map(slide => ({
                    url: slide.banner,
                    alt: slide.name || 'Banner Image',
                    link: slide.link || '#',
                }));
                setOriginalSlides(fetchedData); // Store original fetched data for reference
            } catch (error) {
                console.error('Error fetching slides:', error);
                setOriginalSlides([]); // Clear original slides on error
            } finally {
                // Determine slides to display: fetched + fallback if needed
                let finalSlides = [...fetchedData];
                if (finalSlides.length < MIN_LOOP_SLIDES) {
                    const fallbackNeeded = MIN_LOOP_SLIDES - finalSlides.length;
                    // Ensure we don't try to take more fallbacks than available if MIN_LOOP_SLIDES is large
                    const fallbacks = getFallbackSlides().slice(0, fallbackNeeded);
                    finalSlides = [...finalSlides, ...fallbacks];
                }
                setDisplaySlides(finalSlides); // Set the array for Swiper
                setIsLoading(false);
            }
        };

        fetchAndPrepareSlides();
    }, []);

    const getFallbackSlides = () => [
        { url: 'https://placehold.co/1200x400/000033/FFFFFF?text=Event+1', alt: 'Event 1 Banner', link: '#' },
        { url: 'https://placehold.co/1200x400/003300/FFFFFF?text=Event+2', alt: 'Event 2 Banner', link: '#' },
        { url: 'https://placehold.co/1200x400/330000/FFFFFF?text=Event+3', alt: 'Event 3 Banner', link: '#' },
        { url: 'https://placehold.co/1200x400/330033/FFFFFF?text=Event+4', alt: 'Event 4 Banner', link: '#' },
        { url: 'https://placehold.co/1200x400/003333/FFFFFF?text=Event+5', alt: 'Event 5 Banner', link: '#' },
    ];

    const handleDotClick = (index) => {
        if (swiperRef.current) {
            swiperRef.current.slideToLoop?.(index) || swiperRef.current.slideTo(index);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center aspect-[3/1] bg-gray-100 rounded-2xl animate-pulse">
                <div className="text-center p-4">
                    <span className="loading loading-spinner text-primary"></span>
                    <p className="mt-2 text-gray-500">Loading banners...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center px-4 sm:px-0" aria-label="Image carousel">
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                modules={[Navigation, Autoplay]}
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 1.1,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 1.15,
                        spaceBetween: 25,
                    },
                    1024: {
                        slidesPerView: 1.25,
                        spaceBetween: 40,
                    },
                }}
                className="mySwiper rounded-2xl w-full aspect-[13/4]"
                role="region"
                aria-roledescription="carousel"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide
                        key={index}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} of ${slides.length}`}
                    >
                        <a
                            href={slide.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full block"
                            aria-label={slide.alt}
                        >
                            <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-xl aspect-[3/1]">
                                <img
                                    src={slide.url}
                                    alt={slide.alt}
                                    className="w-full h-full object-cover" 
                                    loading="lazy"
                                />
                            </div>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Pagination Dots */}
            <div
                className="flex justify-center mt-4 space-x-2"
                role="tablist"
                aria-label="Carousel navigation dots"
            >
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${activeIndex === index
                            ? 'bg-blue-600 scale-125'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        role="tab"
                        aria-label={`Go to slide ${index + 1}`}
                        aria-selected={activeIndex === index}
                        aria-controls={`slide-${index}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Carousel;