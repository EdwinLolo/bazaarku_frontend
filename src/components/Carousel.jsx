import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

function Carousel({ slides }) {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleDotClick = (index) => {
        if (swiperRef.current) {
            swiperRef.current.slideToLoop?.(index) || swiperRef.current.slideTo(index);
        }
    };

    if (!slides || slides.length === 0) {
        return <div className="text-center text-gray-500 py-10">No banners available.</div>;
    }

    return (
        <div className="w-full" aria-label="Image carousel">
            <div className="relative w-full overflow-hidden aspect-[15/5]">
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
                        0: { slidesPerView: 1, spaceBetween: 15 },
                        640: { slidesPerView: 1.25, spaceBetween: 20 },
                        768: { slidesPerView: 1.25, spaceBetween: 30 },
                        1024: { slidesPerView: 1.4, spaceBetween: 45 },
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
            </div>

            <div className="flex justify-center mt-4 space-x-2" role="tablist" aria-label="Carousel navigation dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === index
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