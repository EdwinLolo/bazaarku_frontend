import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import EventCard from '../components/EventCard';
import RentalCard from '../components/RentalCard';

import TempImage from '../assets/Audio Control Panel.png';
import { getBaseUrl } from '../models/utils';

function Home() {
    const [events, setEvents] = useState([]);
    const [rentals, setRentals] = useState([]);


    return (
        <div className="flex flex-col min-h-screen">
            <div className="mt-6 mb-4 px-4 sm:px-0">
                <Carousel />
            </div>

            <section className="mb-16 px-4 md:px-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-primary mb-8">Upcoming Events</h2>
                    <Link to="/events" className="text-primary font-semibold text-lg hover:underline">
                        View All Events
                    </Link>
                </div>
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

            <section className="mb-16 px-4 md:px-12">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl text-primary font-bold mb-4">Tool Rentals</h1>
                    <Link to="/rentals" className="text-primary font-semibold text-lg hover:underline">
                        View All Rentals
                    </Link>
                </div>
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
            </section>
        </div>
    );
}

export default Home;