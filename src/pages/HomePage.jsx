import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import EventCard from '../components/EventCard';
import RentalProductCard from '../components/RentalProductCard';
import RentalCard from '../components/RentalCard';

import TempImage from '../assets/Audio Control Panel.png';

function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="mt-6 mb-4">
                <Carousel />
            </div>

            {/* --- Upcoming Events Section --- */}
            <section className="mb-16 px-4 md:px-12">
                <h2 className="text-3xl font-bold text-primary mb-8">Upcoming Events</h2>
                {/* Applied Grid Layout for Event Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <EventCard
                        imageUrl={TempImage}
                        title="Urban Sneaker Society Society 2024"
                        location="ICE BSD"
                        date="Oct 25-27"
                        id="urban-sneaker-society-2024"
                    />
                    <EventCard
                        imageUrl={TempImage}
                        title="Wonderland by USS 2024"
                        location="JIEXPO"
                        date="March 17-19"
                        id="wonderland-by-uss-2024"
                    />
                    <EventCard
                        imageUrl={TempImage}
                        title="USS YARD SALE"
                        location="City Hall, PIM 3"
                        date="March 29-31"
                        id="uss-yard-sale"
                    />
                </div>
            </section>

            <div className="px-4 md:px-12 mb-10">
                <h1 className="text-4xl text-primary font-bold mb-4">Tool Rentals</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-8 auto-rows-fr">
                    <RentalCard
                        imageUrl={TempImage}
                        title="Power Distribution & Generators"
                        className="col-span-1 sm:col-span-2 lg:col-span-4 h-72"
                        id="power-distribution-generators"
                    />
                    <RentalCard
                        imageUrl={TempImage}
                        title="AV Mixing Consoles"
                        className="col-span-1 sm:col-span-1 lg:col-span-2 h-72"
                        id="av-mixing-consoles"
                    />
                    <RentalCard
                        imageUrl={TempImage}
                        title="Stage and Audio Visual Equipment"
                        className="col-span-1 sm:col-span-2 lg:col-span-3 h-72"
                        id="stage-audio-visual-equipment"
                    />
                    <RentalCard
                        imageUrl={TempImage}
                        title="Decor and Furniture"
                        className="col-span-1 sm:col-span-1 lg:col-span-2 h-72"
                        id="decor-furniture"
                    />
                    <RentalCard
                        imageUrl={TempImage}
                        title="Event Lighting Solutions"
                        className="col-span-1 sm:col-span-1 lg:col-span-1 h-72"
                        id="event-lighting-solutions"
                    />
                </div>
            </div>

            {/* <div className="px-4 md:px-12 mb-5">
                <h1 className="text-4xl text-primary font-bold mb-4">Tool Rentals Product</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Sound System 1"
                        price="Rp. 1.000.000,00"
                        location="Tangerang"
                        id="sound-system-1"
                        rental_category="audio"
                    />
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Lighting Rig A"
                        price="Rp. 750.000,00"
                        location="Jakarta"
                        id="lighting-rig-a"
                        rental_category="lighting"
                    />
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Projector HD"
                        price="Rp. 1.200.000,00"
                        location="Bekasi"
                        id="projector-hd"
                        rental_category="visual"
                    />
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Fog Machine Pro"
                        price="Rp. 300.000,00"
                        location="Depok"
                        id="fog-machine-pro"
                        rental_category="effects"
                    />
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Portable Stage 2x2m"
                        price="Rp. 900.000,00"
                        location="Tangerang"
                        id="portable-stage-2x2m"
                        rental_category="stage"
                    />
                </div>
            </div> */}
        </div>
    );
}

export default Home;