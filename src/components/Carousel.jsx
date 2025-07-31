import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Import if not already bundled with 'swiper/css'

// Import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

function Carousel() {
    const slides = [
        {
            url: 'https://placehold.co/1200x400/000033/FFFFFF?text=Event+1',
            alt: 'Event 1 Banner'
        },
        {
            url: 'https://placehold.co/1200x400/000033/FFFFFF?text=Event+2',
            alt: 'Event 2 Banner'
        },
        {
            url: 'https://placehold.co/1200x400/000033/FFFFFF?text=Event+3',
            alt: 'Event 3 Banner'
        },
        {
            url: 'https://placehold.co/1200x400/000033/FFFFFF?text=Event+4',
            alt: 'Event 4 Banner'
        },
    ];

    return (
        // Adjust the max-w if you want the carousel to take up more width in the layout.
        // The inner Swiper styles will handle the peek effect.
        // <div className="w-full">
            <Swiper
                // Install modules
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={15} // Adjust space between slides (e.g., 15px)

                // Key for the "peek" effect:
                slidesPerView={1.2} // Show 1 full slide and 0.2 (20%) of the next/previous
                centeredSlides={true} // Center the active slide, showing parts of previous and next
                loop={true} // Essential for the peek effect to work seamlessly on first/last slides

                // navigation // Enable navigation arrows
                pagination={{ clickable: true }} // Enable pagination dots, make them clickable
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}

                // Add breakpoints for more responsive control of slidesPerView and spaceBetween
                // breakpoints={{
                //     // when window width is >= 640px (sm breakpoint)
                //     640: {
                //         slidesPerView: 1.2,
                //         spaceBetween: 20,
                //     },
                //     // when window width is >= 768px (md breakpoint)
                //     768: {
                //         slidesPerView: 1.3, // Maybe show a bit more of the peek on larger screens
                //         spaceBetween: 25,
                //     },
                //     // when window width is >= 1024px (lg breakpoint)
                //     1024: {
                //         slidesPerView: 1.4, // Even more peek
                //         spaceBetween: 30,
                //     },
                //     // when window width is >= 1280px (xl breakpoint)
                //     1280: {
                //         slidesPerView: 1.5, // 1 full slide + half of the next/previous
                //         spaceBetween: 35,
                //     },
                // }}
                className="mySwiper h-60 md:h-76 lg:h-90"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            style={{ backgroundImage: `url(${slide.url})` }}
                            className="w-full h-full bg-center bg-cover flex flex-col justify-center items-center p-4 text-white text-3xl font-bold"
                            aria-label={slide.alt}
                        >
                            {/* Content of the slide */}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        // </div>
    );
}

export default Carousel;