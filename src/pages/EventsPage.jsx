import React from "react";
import { getBaseUrl } from "../models/utils";
import TempImage from '../assets/Audio Control Panel.png';
import EventCard from "../components/EventCard";
import VendorCard from "../components/VendorCard";

function EventsPage() {
    // const [events, setEvents] = React.useState([]);

    const events = [
        {
            imageUrl: TempImage,
            title: "Urban Sneaker Society Society 2024",
            location: "ICE BSD",
            date: "Oct 25-27",
            id: "urban-sneaker-society-2024",
        },
        {
            imageUrl: TempImage,
            title: "Wonderland by USS 2024",
            location: "JIEXPO",
            date: "March 17-19",
            id: "wonderland-by-uss-2024",
        },
        {
            imageUrl: TempImage,
            title: "USS YARD SALE",
            location: "City Hall, PIM 3",
            date: "March 29-31",
            id: "uss-yard-sale",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <div className="px-4 md:px-12 my-5">
                <h1 className="text-4xl text-primary font-bold mb-4">Events</h1>
                <img
                    src={TempImage}
                    alt="Audio Control Panel"
                    className="w-full h-80 md:h-120 object-cover rounded-lg mb-6"
                />
            </div>

            <section className="mb-16 px-4 md:px-12">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl text-primary font-bold mb-4">Nearest Event</h1>
                    <div>
                        
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            imageUrl={event.imageUrl}
                            title={event.title}
                            location={event.location}
                            date={event.date}
                        />
                    ))}
                </div>
            </section>

            <section className="mb-16 px-4 md:px-12">
                <h1 className="text-4xl text-primary font-bold mb-4">Vendor</h1>
                <div className="grid grid-cols-1 sm:gri</section>d-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                    <VendorCard
                        imageUrl={TempImage}
                        title="Vendor Name"
                        location="Vendor Location"
                        id="vendor-id"
                    />
                    <VendorCard
                        imageUrl={TempImage}
                        title="Vendor Name"
                        location="Vendor Location"
                        id="vendor-id"
                    />
                    <VendorCard
                        imageUrl={TempImage}
                        title="Vendor Name"
                        location="Vendor Location"
                        id="vendor-id"
                    />
                </div>
            </section>
        </div >
    )
}

export default EventsPage;