import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { getBaseUrl } from '../models/utils';

const MIN_LOOP_SLIDES = 5;

function Carousel() {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slides, setDisplaySlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingVisible, setLoadingVisible] = useState(true);

    useEffect(() => {
        const fetchAndPrepareSlides = async () => {
            setIsLoading(true);
            let fetchedData = [];
            try {
                const response = await fetch(`${getBaseUrl()}/banners/active`);
                if (!response.ok) throw new Error('Failed to fetch slides');

                const { data } = await response.json();
                fetchedData = data.map(slide => ({
                    url: slide.banner,
                    alt: slide.name || 'Banner Image',
                    link: slide.link || '#',
                }));
            } catch (error) {
                console.error('Error fetching slides:', error);
            } finally {
                let finalSlides = [...fetchedData];
                if (finalSlides.length < MIN_LOOP_SLIDES) {
                    const fallbackNeeded = MIN_LOOP_SLIDES - finalSlides.length;
                    const fallbacks = getFallbackSlides().slice(0, fallbackNeeded);
                    finalSlides = [...finalSlides, ...fallbacks];
                }
                setDisplaySlides(finalSlides);
                setTimeout(() => {
                    setIsLoading(false);
                    setTimeout(() => setLoadingVisible(false), 500); // Fade-out buffer
                }, 1000);
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

    return (
        <div className="w-full" aria-label="Image carousel">
            <div className={`relative w-full overflow-hidden aspect-[13/4] ${loadingVisible ? 'my-[12px] sm:my-[14px]' : ''}`}>
                {/* Loading Screen */}
                {loadingVisible && (
                    <div
                        className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <div className="relative flex h-10 w-10">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-10 w-10 bg-blue-500"></span>
                            </div>
                            <p className="mt-4 text-primary text-lg font-semibold">Loading amazing banners...</p>
                        </div>
                    </div>
                )}

                {/* Carousel */}
                {!loadingVisible && (
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
                            0: { slidesPerView: 1, spaceBetween: 10 },
                            640: { slidesPerView: 1.25, spaceBetween: 15 },
                            768: { slidesPerView: 1.25, spaceBetween: 25 },
                            1024: { slidesPerView: 1.4, spaceBetween: 40 },
                        }}
                        className="w-full h-full"
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
                                    className="block w-full h-full"
                                    aria-label={slide.alt}
                                >
                                    <div className="w-full h-full flex justify-center items-center overflow-hidden">
                                        <img
                                            src={slide.url}
                                            alt={slide.alt}
                                            className="w-full h-full object-cover rounded-2xl"
                                            loading="lazy"
                                        />
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            {/* Navigation Dots */}
            {!loadingVisible && (
                <div className="flex justify-center mt-4 space-x-2" role="tablist" aria-label="Carousel navigation dots">
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
            )}
        </div>
    );
}

export default Carousel;
