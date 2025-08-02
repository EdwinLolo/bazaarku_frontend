import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Store, Phone } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { getBaseUrl } from "../models/utils";
import Loading from "../components/Loading";

const EventDetailPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`${getBaseUrl()}/events/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }
                const data = await response.json();

                if (data.success && data.data) {
                    const eventData = {
                        ...data.data,
                        total_booths: data.data.total_booths || 50,
                        price: data.data.price || 0,
                        contact: data.data.contact || '6281234567890',
                    };
                    setEvent(eventData);
                } else {
                    setError('Event not found.');
                }
            } catch (err) {
                console.error("Error fetching event details:", err);
                setError('An error occurred while fetching event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-xl text-gray-600">{error}</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-xl text-gray-600">Event not found.</p>
            </div>
        );
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedStartDate = new Date(event.start_date).toLocaleDateString(undefined, options);
    const formattedEndDate = new Date(event.end_date).toLocaleDateString(undefined, options);
    const dateRange = `${formattedStartDate} - ${formattedEndDate}`;

    const getStatusBadge = (status) => {
        let colorClass = '';
        switch (status) {
            case 'upcoming':
                colorClass = 'bg-blue-600';
                break;
            case 'ongoing':
                colorClass = 'bg-green-600';
                break;
            case 'completed':
                colorClass = 'bg-gray-600';
                break;
            default:
                colorClass = 'bg-gray-500';
        }
        return (
            <span className={`px-4 py-1.5 text-sm font-semibold text-white rounded-full ${colorClass} shadow-md`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const totalBooths = event.total_booths;
    const bookedBooths = event.accepted_booths;
    const availableBooths = totalBooths - bookedBooths;

    const handleApplyForBooth = () => {
        // TODO: Implement booth application logic
        alert('Booth application feature coming soon!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Banner */}
            <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
                <img
                    src={event.banner}
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* Event Header Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2">
                                    {event.name}
                                </h1>
                                <p className="text-lg md:text-xl text-gray-200">
                                    {event.event_category?.name || 'Event'}
                                </p>
                            </div>
                            {getStatusBadge(event.status)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event Details & About Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
                                <div className="flex items-start space-x-4">
                                    <MapPin className="text-blue-600 h-6 w-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</h4>
                                        <p className="text-base font-semibold text-gray-900 mt-1">{event.location || event.area?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <Calendar className="text-emerald-600 h-6 w-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Duration</h4>
                                        <p className="text-base font-semibold text-gray-900 mt-1">{dateRange}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="prose prose-gray max-w-none border-t border-gray-200 pt-8 mt-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                                    {event.description}
                                </p>
                            </div>
                        </div>

                        {/* Booth Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booth Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                                    <div className="text-2xl font-bold text-blue-700">{totalBooths}</div>
                                    <div className="text-sm font-medium text-blue-600 mt-1">Total Booths</div>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                                    <div className="text-2xl font-bold text-green-700">{availableBooths}</div>
                                    <div className="text-sm font-medium text-green-600 mt-1">Available</div>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                                    <div className="text-2xl font-bold text-orange-700">{bookedBooths}</div>
                                    <div className="text-sm font-medium text-orange-600 mt-1">Booked</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-8 border-t border-gray-200">
                                <div className="text-center sm:text-left mb-4 sm:mb-0">
                                    <p className="text-sm font-medium text-gray-600">Booth Application Price</p>
                                    <p className="text-xl font-bold text-gray-900 mt-1">
                                        {event.price && event.price !== '-' ? `Rp${Number(event.price).toLocaleString('id-ID')}` : 'Free'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleApplyForBooth}
                                    className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <Store className="h-5 w-5 mr-2" />
                                    Apply for Booth
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Contact Card */}
                        {event.contact && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Event</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    For inquiries or more information, you can contact the event organizer directly via WhatsApp.
                                </p>
                                <a
                                    href={`https://wa.me/${event.contact}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <FaWhatsapp className="h-5 w-5 mr-2" />
                                    WhatsApp
                                </a>
                            </div>
                        )}

                        {/* Organizer Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor</h3>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Users className="text-purple-600 h-6 w-6" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-semibold text-gray-900 truncate">
                                        {event.vendor?.name || 'N/A'}
                                    </p>
                                    {event.vendor?.phone && (
                                        <p className="text-sm text-gray-600 flex items-center mt-1">
                                            <Phone className="h-4 w-4 mr-1" />
                                            {event.vendor.phone}
                                        </p>
                                    )}
                                    {event.vendor?.id && (
                                        <Link
                                            to={`/vendors/${event.vendor.id}`}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 hover:underline"
                                        >
                                            View Profile
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status</span>
                                    <span className="text-sm">{getStatusBadge(event.status)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Category</span>
                                    <span className="text-gray-900 font-medium">{event.event_category?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Availability</span>
                                    <span className={`text-sm font-medium ${availableBooths > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {availableBooths > 0 ? 'Available' : 'Fully Booked'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;