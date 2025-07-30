import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import EventCard from '../components/EventCard';
import RentalProductCard from '../components/RentalProductCard';
import RentalCard from '../components/RentalCard';

import TempImage from '../assets/Audio Control Panel.png';

function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex items-center justify-center mt-12 mb-6">
                <Carousel />
            </div>

            {/* --- Upcoming Events Section --- */}
            <section className="mb-16 px-4 md:px-12">
                <h2 className="text-3xl font-bold text-primary mb-8">Upcoming Events</h2>
                {/* Applied Grid Layout for Event Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    <EventCard
                        imageUrl={TempImage}
                        title="Urban Sneaker Society Society 2024"
                        location="ICE BSD"
                        date="Oct 25-27"
                    />
                    <EventCard
                        imageUrl={TempImage}
                        title="Wonderland by USS 2024"
                        location="JIEXPO"
                        date="March 17-19"
                    />
                    <EventCard
                        imageUrl={TempImage}
                        title="USS YARD SALE"
                        location="City Hall, PIM 3"
                        date="March 29-31"
                    />
                    {/* Add more EventCards here to see the grid in action, e.g.: */}
                    <EventCard
                        imageUrl={TempImage}
                        title="Music Fest 2024"
                        location="Senayan Park"
                        date="May 10-12"
                    />
                    <EventCard
                        imageUrl={TempImage}
                        title="Food Fair Extravaganza"
                        location="Gandaria City"
                        date="June 1-5"
                    />
                </div>
            </section>

            {/* --- Tool Rentals (Categories) Section --- */}
            <div className="px-4 md:px-12 mb-5">
                <h1 className="text-4xl text-primary font-bold mb-4">Tool Rentals</h1>
                {/* Example Grid Layout for Rental Cards - Varying Widths, Consistent Height */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-8 auto-rows-fr">
                    {/* Row 1: 2-column, 1-column, 1-column */}
                    <RentalCard
                        imageUrl={TempImage}
                        title="Stage and Audio Visual Equipment"
                        className="col-span-1 sm:col-span-2 lg:col-span-3 h-64"
                    />
                    <RentalCard
                        imageUrl={TempImage}
                        title="Decor and Furniture"
                        className="col-span-1 sm:col-span-1 lg:col-span-2 h-64"
                    />
                    <RentalCard
                        imageUrl={TempImage}
                        title="Event Lighting Solutions"
                        className="col-span-1 sm:col-span-1 lg:col-span-1 h-64"
                    />

                    {/* Row 2: 2.5-column (or close to it), 0.5-column (or close to it), 1-column */}
                    <RentalCard
                        imageUrl={TempImage}
                        title="Power Distribution & Generators"
                        className="col-span-1 sm:col-span-2 lg:col-span-4 h-64"
                    />
                    <RentalCard
                        imageUrl={TempImage}
                        title="AV Mixing Consoles"
                        className="col-span-1 sm:col-span-1 lg:col-span-2 h-64"
                    />
                    <RentalCard
                        imageUrl={TempImage}
                        title="Special Effects Equipment"
                        className="col-span-1 sm:col-span-1 lg:col-span-3 h-64"
                    />
                    <RentalCard
                        imageUrl={TempImage}
                        title="Furniture and Seating Arrangements"
                        className="col-span-1 sm:col-span-1 lg:col-span-3 h-64"
                    />
                </div>
            </div>

            {/* --- Tool Rentals Product Section --- */}
            <div className="px-4 md:px-12 mb-5">
                <h1 className="text-4xl text-primary font-bold mb-4">Tool Rentals Product</h1>
                {/* Applied Grid Layout for RentalProduct Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Sound System 1"
                        price="Rp. 1.000.000,00"
                        location="Tangerang"
                    />
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Lighting Rig A"
                        price="Rp. 750.000,00"
                        location="Jakarta"
                    />
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Projector HD"
                        price="Rp. 1.200.000,00"
                        location="Bekasi"
                    />
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Fog Machine Pro"
                        price="Rp. 300.000,00"
                        location="Depok"
                    />
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="Portable Stage 2x2m"
                        price="Rp. 900.000,00"
                        location="Tangerang"
                    />
                    <RentalProductCard
                        imageUrl={TempImage}
                        title="DJ Mixer Pioneer"
                        price="Rp. 600.000,00"
                        location="Jakarta"
                    />
                    {/* Add more RentalProductCards here */}
                </div>
            </div>
        </div>
    );
}

export default Home;