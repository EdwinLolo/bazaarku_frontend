import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getBaseUrl } from "../models/utils";
import Loading from "../components/Loading";
import { MapPin, Calendar, Globe } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Alert } from "@mui/material";
import EventCard from "../components/EventCard";

function VendorPage() {
    const { id } = useParams();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await fetch(`${getBaseUrl()}/vendors/${id}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setVendor({
                        ...data.data,
                        event: data.data.event || []
                    });
                } else {
                    setError(data.message || 'Vendor not found.');
                }
            } catch (err) {
                console.error("Error fetching vendor details:", err);
                setError('An error occurred while fetching vendor details.');
            } finally {
                setLoading(false);
            }
        };
        fetchVendor();
    }, [id]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 antialiased p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-md w-full border border-gray-200">
                    <Alert severity="error" sx={{ width: "100%", mb: 2, fontSize: 18 }}>
                        {error}
                    </Alert>
                    <button
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition duration-300 ease-in-out font-medium"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <Loading />;
    }

    if (!vendor) {
        return <div className="text-center mt-20 text-gray-600 font-medium text-lg">Vendor data not available.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
            {/* Header with Background Image and Vendor Info */}
            <header
                className="relative h-96 md:h-[450px] bg-cover bg-center flex items-end p-6 md:p-10 shadow-lg overflow-hidden"
                style={{ backgroundImage: `url(${vendor.banner || 'https://via.placeholder.com/1920x500.png?text=Vendor+Banner'})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                <div className="relative z-10 w-full text-white">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg mb-2 leading-tight">
                                {vendor.name}
                            </h1>
                            <p className="text-lg md:text-xl font-medium flex items-center gap-2 drop-shadow-md">
                                <MapPin className="text-blue-300" size={24} />
                                {vendor.location}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200 -mt-20 md:-mt-24 relative z-20">

                    {/* About Us Section */}
                    <section className="mb-10 pb-6 border-b border-gray-200 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                            {vendor.desc}
                        </p>
                    </section>
                    
                    {/* Contact & Socials Section */}
                    <section className="mb-10 pb-6 border-b border-gray-200 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Connect With Us</h2>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                            {vendor.phone && (
                                <a
                                    href={`https://wa.me/${vendor.phone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 text-green-500 hover:text-green-600 transition transform hover:-translate-y-1 group"
                                >
                                    <FaWhatsapp className="text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-semibold text-lg md:text-xl">WhatsApp</span>
                                </a>
                            )}
                            {vendor.insta && (
                                <a
                                    href={`https://instagram.com/${vendor.insta}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 text-pink-500 hover:text-pink-600 transition transform hover:-translate-y-1 group"
                                >
                                    <FaInstagram className="text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-semibold text-lg md:text-xl">Instagram</span>
                                </a>
                            )}
                            {vendor.website && (
                                <a
                                    href={vendor.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 text-blue-500 hover:text-blue-600 transition transform hover:-translate-y-1 group"
                                >
                                    <Globe className="text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-semibold text-lg md:text-xl">Website</span>
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Our Events Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {vendor.event.length === 0 ? (
                                <p className="text-center col-span-full text-gray-500 text-lg">No events found at this time.</p>
                            ) : (
                                vendor.event.map(event => (
                                    <EventCard
                                        key={event.id}
                                        id={event.id}
                                        imageUrl={event.imageUrl}
                                        name={event.name}
                                        location={event.location}
                                        start_date={event.start_date}
                                        end_date={event.end_date}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default VendorPage;