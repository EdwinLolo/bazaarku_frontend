import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom'; 
import { MapPin, Calendar, Users, Briefcase, ChevronRight } from "lucide-react";
import { getBaseUrl } from "../models/utils";
import Loading from "../components/Loading";

const EventDetailPage = () => {
    // useParams is now correctly imported from react-router-dom
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch event data when the component mounts or the ID changes
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Fetch event data from the API endpoint
                const response = await fetch(`${getBaseUrl()}/events/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }
                const data = await response.json();

                // Add a check to see if the data is present before setting the state
                if (data.success && data.data) {
                    setEvent(data.data);
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

    // Show a loading spinner while the data is being fetched
    if (loading) {
        return <Loading />;
    }

    // Show an error message if the fetch failed
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-xl text-gray-600">{error}</p>
            </div>
        );
    }

    // Check if event data exists before rendering the page
    if (!event) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-xl text-gray-600">Event not found.</p>
            </div>
        );
    }

    // Format the date using the user's browser locale
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedStartDate = new Date(event.start_date).toLocaleDateString(undefined, options);
    const formattedEndDate = new Date(event.end_date).toLocaleDateString(undefined, options);
    const dateRange = `${formattedStartDate} - ${formattedEndDate}`;

    // Helper function to get the status badge style
    const getStatusBadge = (status) => {
        let colorClass = '';
        switch (status) {
            case 'upcoming':
                colorClass = 'bg-blue-500';
                break;
            case 'ongoing':
                colorClass = 'bg-green-500';
                break;
            case 'completed':
                colorClass = 'bg-gray-500';
                break;
            default:
                colorClass = 'bg-gray-400';
        }
        return (
            <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${colorClass}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-900">
            {/* Main banner image with a dark overlay */}
            <div className="relative h-96 w-full overflow-hidden">
                <img
                    src={event.banner}
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 -mt-24 mb-12">
                <div className="bg-white rounded-3xl p-8 shadow-2xl relative">
                    {/* Event header with title and status badge */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-2 md:mb-0">
                            {event.name}
                        </h1>
                        {getStatusBadge(event.status)}
                    </div>

                    {/* Key event details section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-100 p-6 rounded-2xl flex items-start space-x-4">
                            <MapPin className="text-blue-500 h-6 w-6 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Location</p>
                                <p className="mt-1 text-lg font-medium">{event.area?.name || event.location}</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-2xl flex items-start space-x-4">
                            <Calendar className="text-emerald-500 h-6 w-6 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Dates</p>
                                <p className="mt-1 text-lg font-medium">{dateRange}</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-2xl flex items-start space-x-4">
                            <Briefcase className="text-purple-500 h-6 w-6 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Category</p>
                                <p className="mt-1 text-lg font-medium">{event.event_category?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description section */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-4">About This Event</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                    </div>

                    {/* Booth and Vendor details section */}
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Booths & Vendors</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Booth counts card */}
                            <div className="bg-gray-100 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold mb-2">Booth Statistics</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-4">
                                    <div className="p-4 rounded-xl bg-green-100 text-green-700">
                                        <p className="text-3xl font-extrabold">{event.accepted_booths}</p>
                                        <p className="text-sm font-medium mt-1">Accepted</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-blue-100 text-blue-700">
                                        <p className="text-3xl font-extrabold">{event.pending_booths}</p>
                                        <p className="text-sm font-medium mt-1">Pending</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-red-100 text-red-700">
                                        <p className="text-3xl font-extrabold">{event.rejected_booths}</p>
                                        <p className="text-sm font-medium mt-1">Rejected</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vendor details card */}
                            <div className="bg-gray-100 p-6 rounded-2xl flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Event Organizer</h3>
                                    <div className="flex items-center space-x-4 mt-4">
                                        <Users className="text-purple-500 h-10 w-10" />
                                        <div>
                                            <p className="text-lg font-medium">{event.vendor?.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">{event.vendor?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    to={`/vendors/${event.vendor?.id}`}
                                    className="mt-4 flex items-center justify-between text-blue-600 font-medium hover:underline"
                                >
                                    <span>View Vendor Profile</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
