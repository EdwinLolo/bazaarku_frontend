import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../App";
import { getBaseUrl } from "../models/utils";
import { Link } from "react-router-dom";
import { User, Mail, Calendar, CheckCircle, Clock, XCircle, ServerCrash, Inbox, MapPin } from 'lucide-react';

// Move constants outside component to avoid recreation
const STATUS_STYLES = {
    'Approved': { icon: <CheckCircle size={14} />, color: 'bg-green-100 text-green-800' },
    'Pending': { icon: <Clock size={14} />, color: 'bg-amber-100 text-amber-800' },
    'Rejected': { icon: <XCircle size={14} />, color: 'bg-red-100 text-red-800' },
};

// Utility functions
const formatDateRange = (start, end) => {
    const startDate = new Date(start).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const endDate = new Date(end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
};

const getStatus = (is_acc) => {
    switch (is_acc) {
        case 'APPROVED': return 'Approved';
        case 'REJECTED': return 'Rejected';
        default: return 'Pending';
    }
};

// Optimized sub-components
const StatusBadge = ({ status }) => {
    const { icon, color } = STATUS_STYLES[status] || {
        icon: <Clock size={14} />,
        color: 'bg-gray-100 text-gray-800'
    };

    return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-1 rounded-full ${color}`}>
            {icon}
            {status}
        </span>
    );
};

const Loading = ({ message = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-800"></div>
        <p className="mt-4 text-lg font-bold text-primary text-center">{message}</p>
    </div>
);

const ErrorDisplay = ({ error, icon: Icon = ServerCrash }) => (
    <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 rounded-lg">
        <Icon className="w-12 h-12 mb-4" />
        <p className="text-lg font-semibold">Could not load data</p>
        <p className="text-sm text-center max-w-md">{error}</p>
    </div>
);

const EmptyState = ({ message = "No booth applications found" }) => (
    <div className="text-center h-64 flex flex-col items-center justify-center text-gray-500">
        <Inbox className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm mt-2">Applications you submit will appear here</p>
    </div>
);

const ProfileHeader = ({ userInfo, userFullName }) => {
    const joinedDate = useMemo(() => {
        return userInfo?.created_at
            ? new Date(userInfo.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            : 'Unknown';
    }, [userInfo?.created_at]);

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-28 h-28 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-14 h-14 text-indigo-600" />
                </div>
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">{userFullName}</h1>
                    <p className="text-sm font-medium text-white bg-indigo-500 px-3 py-0.5 rounded-full inline-block mt-2">
                        {userInfo?.role || 'User'}
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-gray-600">
                        <div className="flex items-center gap-2 justify-center">
                            <Mail size={16} className="text-gray-400" />
                            <span>{userInfo?.email || 'No email provided'}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            <Calendar size={16} className="text-gray-400" />
                            <span>Joined on {joinedDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ApplicationCard = ({ application }) => {
    const { event, name, is_acc } = application;

    return (
        <Link to={`/events/${event.id}`} className="block border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-indigo-300 hover:bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-800">{event.name}</h3>
                        <div className="sm:hidden">
                            <StatusBadge status={getStatus(is_acc)} />
                        </div>
                    </div>
                    <p className="font-semibold text-indigo-600">{name}</p>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{formatDateRange(event.start_date, event.end_date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:block flex-shrink-0">
                    <StatusBadge status={getStatus(is_acc)} />
                </div>
            </div>
        </Link>
    );
};

const ProfilePage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);

    // Memoize user info to avoid unnecessary recalculations
    const userInfo = useMemo(() => {
        try {
            return user ?? JSON.parse(localStorage.getItem("user_profile") || 'null');
        } catch {
            return null;
        }
    }, [user]);

    const userFullName = useMemo(() => {
        const fullName = `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`.trim();
        return fullName || "User";
    }, [userInfo?.first_name, userInfo?.last_name]);

    // Memoized fetch function
    const fetchBoothApplications = useCallback(async (userId) => {
        try {
            const response = await fetch(`${getBaseUrl()}/booths/user/${userId}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to fetch applications: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching booth applications:", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        if (!userInfo?.id) {
            setLoading(false);
            return;
        }

        const loadApplications = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchBoothApplications(userInfo.id);
                setApplications(data.data || []);
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        loadApplications();
    }, [userInfo?.id, fetchBoothApplications]);

    // Early return if no user info
    if (!userInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <ErrorDisplay
                    error="Please log in to view your profile"
                    icon={User}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <ProfileHeader userInfo={userInfo} userFullName={userFullName} />

                <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Booth Applications</h2>
                    {loading && <Loading message="Loading Applications..." />}
                    {error && <ErrorDisplay error={error} />}
                    {!loading && !error && applications.length === 0 && <EmptyState />}
                    {!loading && !error && applications.length > 0 && (
                        <div className="space-y-4">
                            {applications.map(app => (
                                <ApplicationCard key={app.id} application={app} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
