import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, Zap, Target, Lightbulb, Handshake, CalendarCheck, Store, ShoppingCart } from 'lucide-react';

const AboutUsPage = () => {
    return (
        <div className="bg-gray-50 font-sans text-gray-800">
            {/* Hero Section */}
            <header className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 sm:py-32 lg:py-40">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <img
                        src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop"
                        alt="Vibrant event atmosphere"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1920x1080/60a5fa/ffffff?text=Bazaarku+Events' }}
                    />
                </div>
                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                        Connecting Communities, One Event at a Time.
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-indigo-100">
                        Bazaarku is the ultimate ecosystem for vibrant events, seamless vendor management, and effortless equipment rentals.
                    </p>
                </div>
            </header>

            {/* Our Mission Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Our Mission</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            To empower event creators, vendors, and attendees by providing a centralized, user-friendly platform that simplifies every aspect of event planning and participation. We aim to foster a thriving community where creativity and commerce flourish.
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Empower Creators</h3>
                            <p className="mt-2 text-gray-600">Provide tools for event organizers to host successful, memorable events with ease.</p>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                                <Store size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Support Vendors</h3>
                            <p className="mt-2 text-gray-600">Offer a marketplace for vendors to find opportunities, rent equipment, and grow their business.</p>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Engage Attendees</h3>
                            <p className="mt-2 text-gray-600">Create a seamless experience for users to discover events and connect with local vendors.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">How Bazaarku Works</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            A simple, streamlined process for everyone involved in making an event happen.
                        </p>
                    </div>
                    <div className="mt-16 space-y-12">
                        {/* Step for Event Organizers */}
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="md:w-1/2">
                                <div className="bg-white p-6 rounded-2xl shadow-md">
                                    <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">For Event Organizers</span>
                                    <h3 className="text-2xl font-bold text-gray-900">List Your Event & Find Vendors</h3>
                                    <p className="mt-3 text-gray-600">Easily create and manage your event page, accept booth applications from a diverse pool of vendors, and promote your event to a wider audience.</p>
                                </div>
                            </div>
                            <div className="md:w-1/2 flex justify-center">
                                <CalendarCheck className="w-32 h-32 text-indigo-500" />
                            </div>
                        </div>
                        {/* Step for Vendors */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                            <div className="md:w-1/2">
                                <div className="bg-white p-6 rounded-2xl shadow-md">
                                    <span className="inline-block bg-teal-100 text-teal-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">For Vendors</span>
                                    <h3 className="text-2xl font-bold text-gray-900">Apply for Booths & Rent Gear</h3>
                                    <p className="mt-3 text-gray-600">Discover exciting event opportunities, apply for a booth with a single click, and rent all the necessary equipment—from tents to sound systems—all in one place.</p>
                                </div>
                            </div>
                            <div className="md:w-1/2 flex justify-center">
                                <ShoppingCart className="w-32 h-32 text-teal-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
                                alt="Team collaborating"
                                className="rounded-2xl shadow-xl w-full h-auto object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=Our+Story' }}
                            />
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Our Story</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Bazaarku was born from a simple observation: organizing and participating in local events was unnecessarily complicated. Founders, a mix of event organizers and local vendors from Malang, experienced firsthand the hassle of juggling multiple platforms for communication, rentals, and applications.
                            </p>
                            <p className="mt-4 text-gray-600">
                                We envisioned a single, streamlined solution. A place where an event organizer could list their bazaar, a local artisan could find a place to sell their crafts, and a food vendor could rent a high-quality tent for the weekend. In 2025, we brought that vision to life, creating Bazaarku to serve the vibrant communities of East Java and beyond.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Our Core Values</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            The principles that guide our platform, our community, and our company.
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                            <Target className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold">Community First</h3>
                                <p className="mt-1 text-gray-600">We build for the community, prioritizing features that foster connection and collaboration.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                            <Lightbulb className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold">Innovation</h3>
                                <p className="mt-1 text-gray-600">We constantly seek creative solutions to simplify complexities in event management.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                            <Handshake className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold">Trust & Transparency</h3>
                                <p className="mt-1 text-gray-600">We believe in clear communication and building a platform where all users feel secure and respected.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-white">
                <div className="container mx-auto px-8 py-16 sm:py-24">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center text-white">
                        <h2 className="text-3xl sm:text-4xl font-bold">Ready to Join the Bazaarku Community?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-indigo-100">
                            Whether you're planning an event, looking to sell your products, or searching for your next great experience, Bazaarku is here to help.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link to="/events" className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300">
                                Explore Events
                            </Link>
                            <Link to="/vendors" className="inline-block bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-400 transition-colors duration-300">
                                Become a Vendor
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;