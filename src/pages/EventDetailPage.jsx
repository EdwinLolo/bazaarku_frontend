import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Store, Phone, Star, User } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import Swal from "sweetalert2";

import { getBaseUrl } from "../models/utils";
import { useAuth } from "../App";

import Loading from "../components/Loading";
import ApplyBoothPopup from "../components/popup/ApplyBoothPopup";
import ErrorDisplay from "../components/ErrorDisplay";
import LoginPopup from "../components/popup/LoginPopup";
import CreateAccountPopup from "../components/popup/CreateAccountPopup";
import ReviewPopup from "../components/popup/ReviewPopup";

const StarRating = React.memo(({ rating, className = '' }) => {
    const stars = useMemo(() => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                size={16}
                className={index < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
        ));
    }, [rating]);

    return (
        <div className={`flex items-center ${className}`}>
            {stars}
        </div>
    );
});

StarRating.displayName = 'StarRating';

const ReviewCard = React.memo(({ review }) => (
    <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <User size={20} className="text-indigo-600" />
            </div>
            <div>
                <p className="font-semibold text-gray-800">{review.name}</p>
                <StarRating rating={review.rating_star} />
            </div>
        </div>
        <p className="text-gray-600 leading-relaxed">{review.review}</p>
    </div>
));

ReviewCard.displayName = 'ReviewCard';

const EventDetailPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [ratings, setRatings] = useState({ reviews: [], average: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupReview, setShowPopupReview] = useState(false);
    const [isReviewAble, setIsReviewAble] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const { user } = useAuth();
    const user_profile = localStorage.getItem("user_profile");

    const isLoggedIn = useMemo(() =>
        (user !== null && user !== undefined) ||
        (user_profile !== null && user_profile !== undefined),
        [user, user_profile]
    );

    const fetchEvent = useCallback(async (retryCount = 0) => {
        try {
            setLoading(true);
            setError(null);

            const [eventResponse, ratingResponse] = await Promise.all([
                fetch(`${getBaseUrl()}/events/${id}`),
                fetch(`${getBaseUrl()}/rating/event/${id}`)
            ]);

            if (!eventResponse.ok) {
                throw new Error(`Event fetch failed: ${eventResponse.status}`);
            }

            if (!ratingResponse.ok) {
                throw new Error(`Rating fetch failed: ${ratingResponse.status}`);
            }

            const [eventData, ratingData] = await Promise.all([
                eventResponse.json(),
                ratingResponse.json()
            ]);

            if (eventData.success && eventData.data) {
                const event = eventData.data;
                console.log('Check Event Data', event);

                const acceptedBoothsCount = (event.booth || []).filter(b => b.is_acc === 'APPROVED').length;
                setEvent({ ...event, accepted_booths: acceptedBoothsCount });
            } else {
                setError('Event not found.');
                return;
            }

            if (ratingData.success && ratingData.data) {
                const reviews = ratingData.data;
                const totalStars = reviews.reduce((acc, r) => acc + r.rating_star, 0);
                const average = reviews.length > 0 ? totalStars / reviews.length : 0;
                setRatings({ reviews, average });
            }

            if (user?.id && eventData.success && eventData.data && ratingData.success) {
                const userApprovedBoothsCount = (eventData.data.booth || []).filter(b => b.is_acc === 'APPROVED' && b.user_id === user.id).length;
                const userExistingReviewsCount = (ratingData.data || []).filter(r => r.user_id === user.id).length;
                
                // Check if event has ended (allow reviews only after end_date)
                const eventEndDate = new Date(eventData.data.end_date);
                const currentDate = new Date();
                const eventHasEnded = currentDate > eventEndDate;
                
                // User can review if they have approved booths, haven't reached the review limit, AND event has ended
                const canWriteMoreReviews = userApprovedBoothsCount > 0 && 
                                          userExistingReviewsCount < userApprovedBoothsCount && 
                                          eventHasEnded;
                setIsReviewAble(canWriteMoreReviews);
            } else {
                setIsReviewAble(false);
            }
        } catch (err) {
            console.error("Error fetching event details:", err);

            // Retry logic for network errors
            if (retryCount < 2 && (err.name === 'TypeError' || err.message.includes('fetch failed'))) {
                setTimeout(() => fetchEvent(retryCount + 1), 1000 * (retryCount + 1));
                return;
            }

            setError(err.message || 'An error occurred while fetching event details.');
        } finally {
            setLoading(false);
        }
    }, [id, user]);

    // Handle booth application with proper authentication check
    const handleBoothApplication = useCallback(() => {
        if (!isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Login Required',
                text: 'You must be logged in to apply for a booth.',
                confirmButtonText: 'Login',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowLogin(true);
                }
            });
            return;
        }

        setSelectedEvent(event);
        setShowPopup(true);
    }, [isLoggedIn, event]);

    // Calculate remaining reviews for display
    const remainingReviews = useMemo(() => {
        if (!user?.id || !event || !ratings.reviews) return 0;
        
        const userApprovedBoothsCount = (event.booth || []).filter(b => b.is_acc === 'APPROVED' && b.user_id === user.id).length;
        const userExistingReviewsCount = ratings.reviews.filter(r => r.user_id === user.id).length;
        
        return Math.max(0, userApprovedBoothsCount - userExistingReviewsCount);
    }, [user?.id, event, ratings.reviews]);

    const handleNewReview = useCallback(() => {
        if (!isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Login Required',
                text: 'You must be logged in to write a review.',
                confirmButtonText: 'Login',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowLogin(true);
                }
            });
            return;
        }

        setSelectedEvent(event);
        setShowPopupReview(true);
    }, [isLoggedIn, event]);

    useEffect(() => {
        if (id) {
            fetchEvent();
        }
    }, [fetchEvent, id]);

    // Memoized date formatting to avoid recalculating on each render
    const formattedDates = useMemo(() => {
        if (!event) return { dateRange: '', formattedStartDate: '', formattedEndDate: '' };

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedStartDate = new Date(event.start_date).toLocaleDateString(undefined, options);
        const formattedEndDate = new Date(event.end_date).toLocaleDateString(undefined, options);
        const dateRange = `${formattedStartDate} - ${formattedEndDate}`;

        return { dateRange, formattedStartDate, formattedEndDate };
    }, [event]);

    // Memoized booth statistics
    const boothStats = useMemo(() => {
        if (!event) return { totalBooths: 0, bookedBooths: 0, availableBooths: 0 };

        const totalBooths = event.booth_slot || 0;
        const bookedBooths = event.accepted_booths || 0;
        const availableBooths = Math.max(0, totalBooths - bookedBooths);

        return { totalBooths, bookedBooths, availableBooths };
    }, [event]);

    // Memoized status badge to avoid recalculating on each render
    const statusBadge = useMemo(() => {
        if (!event?.status) return null;

        let colorClass = '';
        switch (event.status) {
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
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
        );
    }, [event?.status]);

    // Memoized price display
    const priceDisplay = useMemo(() => {
        if (!event?.price) return 'Free';
        if (event.price === '-') return 'Free';

        const price = Number(event.price);
        return isNaN(price) ? 'Free' : `Rp${price.toLocaleString('id-ID')}`;
    }, [event?.price]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <ErrorDisplay
                error={error}
                onRetry={fetchEvent}
            />
        );
    }

    if (!event) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">Event not found.</p>
                    <Link
                        to="/events"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Browse Events
                    </Link>
                </div>
            </div>
        );
    }

    const { dateRange } = formattedDates;
    const { totalBooths, bookedBooths, availableBooths } = boothStats;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Banner */}
            <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
                <img
                    src={event.banner}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = '/placeholder-event-banner.jpg';
                        e.target.onerror = null;
                    }}
                    loading="lazy"
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
                            {statusBadge}
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
                                        {priceDisplay}
                                    </p>
                                </div>
                                <button
                                    onClick={handleBoothApplication}
                                    disabled={availableBooths === 0}
                                    className={`inline-flex items-center px-8 py-3 font-semibold rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${availableBooths === 0
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-blue-500'
                                        }`}
                                >
                                    <Store className="h-5 w-5 mr-2" />
                                    {availableBooths === 0 ? 'Fully Booked' : 'Apply for Booth'}
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews & Ratings</h2>
                                {isReviewAble && (
                                    <button
                                        onClick={handleNewReview}
                                        disabled={!isReviewAble}
                                        className='inline-flex items-center px-8 py-3 font-semibold rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                            bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-blue-500'
                                    >
                                        <Star className="h-5 w-5 mr-2" />
                                        Write a Review {remainingReviews > 1 && `(${remainingReviews} remaining)`}
                                    </button>
                                )}
                            </div>
                            {ratings.reviews.length > 0 ? (
                                <>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Star size={24} className="text-yellow-400 fill-current" />
                                            <span className="text-2xl font-bold text-gray-800">{ratings.average.toFixed(1)}</span>
                                        </div>
                                        <p className="text-gray-600">based on {ratings.reviews.length} reviews</p>
                                    </div>
                                    <div className="space-y-6">
                                        {ratings.reviews.map((review, index) => (
                                            <ReviewCard key={index} review={review} />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-600">No reviews yet for this event.</p>
                            )}
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
                                    <span className="text-sm">{statusBadge}</span>
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

            {/* Apply Booth Popup */}
            {showPopup && isLoggedIn && (
                <ApplyBoothPopup
                    event={selectedEvent}
                    user_id={user.id}
                    onClose={() => setShowPopup(false)}
                />
            )}

            {/* Review Popup */}
            {showPopupReview && isLoggedIn && (
                <ReviewPopup
                    event={selectedEvent}
                    user_id={user.id}
                    onClose={() => setShowPopupReview(false)}
                />
            )}

            {/* Login Popup */}
            {showLogin && (
                <LoginPopup
                    onClose={() => setShowLogin(false)}
                    onRegisterClick={() => {
                        setShowLogin(false);
                        setShowCreate(true);
                    }}
                />
            )}

            {/* Create Account Popup */}
            {showCreate && (
                <CreateAccountPopup
                    onClose={() => setShowCreate(false)}
                    onLoginClick={() => {
                        setShowCreate(false);
                        setShowLogin(true);
                    }}
                />
            )}
        </div>
    );
};

export default EventDetailPage;