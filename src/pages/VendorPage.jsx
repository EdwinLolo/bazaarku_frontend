import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBaseUrl } from "../models/utils";
import Loading from "../components/Loading";
import EventCard from "../components/EventCard";
import { MapPin, Calendar, Globe, Mail, Edit } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import ErrorDisplay from "../components/ErrorDisplay";
import { useAuth } from "../App";

function VendorPage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("events");

  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/vendors/${id}`);
        const data = await response.json();

        if (data.success && data.data) {
          let isVendor = false;
          // Your existing logic for checking if the current user is the vendor
          if (user === null) {
            const userData = localStorage.getItem("user_profile");
            if (userData) {
              const parsedUserData = JSON.parse(userData);
              isVendor =
                data.data.user_id === parsedUserData.id &&
                parsedUserData.role === "vendor";
            }
          } else {
            isVendor =
              data.data.user_id === user?.id && user?.role === "vendor";
          }

          const initialEvents = data.data.event || [];
          let eventsWithRatings = [];

          if (initialEvents.length > 0) {
            const ratingPromises = initialEvents.map(event =>
              fetch(`${getBaseUrl()}/rating/event/${event.id}`)
                .then(res => res.ok ? res.json() : Promise.resolve({ success: false, data: [] }))
                .catch(err => {
                  console.error(`Error fetching rating for event ${event.id}:`, err);
                  return { success: false, data: [] }; 
                })
            );

            const ratingResults = await Promise.all(ratingPromises);

            eventsWithRatings = initialEvents.map((event, index) => {
              const ratingData = ratingResults[index];
              let average_rating = 0;

              if (ratingData && ratingData.success && Array.isArray(ratingData.data) && ratingData.data.length > 0) {
                const ratings = ratingData.data;
                const totalStars = ratings.reduce((sum, review) => sum + (review.rating_star || 0), 0);
                average_rating = totalStars / ratings.length;
              }

              return {
                ...event,
                average_rating, 
              };
            });
          }

          const vendorData = {
            ...data.data,
            isVendor: isVendor,
            event: eventsWithRatings, 
          };

          setVendor(vendorData);
          setFormData(vendorData);

          console.log("Fetched and enriched vendor data:", vendorData);
        } else {
          setError(data.message || "Vendor not found.");
        }
      } catch (err) {
        console.error("Error fetching vendor details:", err);
        setError("An error occurred while fetching vendor details.");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${getBaseUrl()}/vendors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setVendor((prev) => ({ ...prev, ...formData }));
        setIsEditing(false);
      } else {
        setError(data.message || "Failed to update vendor details.");
      }
    } catch (err) {
      console.error("Error updating vendor details:", err);
      setError("An error occurred while updating vendor details.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800">Vendor Not Found</h2>
          <p className="text-gray-600 mt-2">
            The vendor you're looking for is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative h-106 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${vendor.banner ||
              "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              })`,
            filter: "brightness(0.8)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-purple-900/30"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-10">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg max-w-3xl">
            {/* {vendor.isVendor && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-20"
                aria-label="Edit Profile">
                <Edit className="w-5 h-5 cursor-pointer" />
              </button>
            )} */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-gray-100 rounded-xl w-24 h-24 md:w-32 md:h-32 border-3 border-black flex items-center justify-center">
                <span className="text-5xl font-bold text-gray-700">
                  {vendor.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {vendor.name}
                </h1>
                <div className="flex items-center mt-2 text-blue-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    {vendor.location.charAt(0).toUpperCase() +
                      vendor.location.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {vendor.event.slice(0, 5).map((event, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {event.category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                className={`px-6 py-4 font-medium text-sm md:text-base cursor-pointer ${activeTab === "about"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("about")}>
                About Us
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm md:text-base cursor-pointer ${activeTab === "events"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("events")}>
                Events
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm md:text-base cursor-pointer ${activeTab === "contact"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("contact")}>
                Contact
              </button>
              {/* <button
                                className={`px-6 py-4 font-medium text-sm md:text-base ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Reviews
                            </button> */}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* About Tab */}
            {activeTab === "about" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  About Our Services
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {vendor.desc ||
                    "We specialize in creating unforgettable experiences for all types of events. With over 10 years of experience, our team of professionals brings creativity, expertise, and attention to detail to every project we undertake."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-blue-50 rounded-xl p-5">
                      <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        Premium Quality (Dummy)
                      </h3>
                      <p className="text-gray-600">
                        We use only the finest materials and ingredients for all
                        our services.
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-4">
                    Our Team
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((member) => (
                      <div key={member} className="text-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-3" />
                        <h4 className="font-medium text-gray-900">
                          Team Member Dummy {member}
                        </h4>
                        <p className="text-sm text-gray-600">Position</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Our Events
                  </h2>
                </div>

                {vendor.event.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="text-blue-600 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Upcoming Events
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      This vendor doesn't have any scheduled events at the
                      moment. Check back later!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendor.event.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Get In Touch
                  </h2>

                  <div className="space-y-5">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <Mail className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-600">
                          contact@
                          {vendor.name.toLowerCase().replace(/\s+/g, "")}.com
                        </p>
                      </div>
                    </div>

                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://wa.me/${vendor.phone}`}
                      className="flex items-start cursor-pointer">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <FaWhatsapp className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Whatsapp Number
                        </h3>
                        <p className="text-gray-600">{vendor.phone}</p>
                      </div>
                    </a>

                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <MapPin className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Location</h3>
                        <p className="text-gray-600">
                          {vendor.location.charAt(0).toUpperCase() +
                            vendor.location.slice(1)}
                        </p>
                      </div>
                    </div>

                    {/* <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <Globe className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Website</h3>
                        <a
                          href={vendor.website || "#"}
                          className="text-blue-600 hover:underline">
                          www.{vendor.name.toLowerCase().replace(/\s+/g, "")}
                          .com
                        </a>
                      </div>
                    </div> */}
                  </div>

                  <div className="mt-8">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Follow Us
                    </h3>
                    <div className="flex space-x-4">
                      <a
                        href={`https://instagram.com/${vendor.insta}`}
                        className="bg-gray-100 p-3 rounded-full text-pink-600 hover:bg-pink-100 transition-colors">
                        <FaInstagram className="w-5 h-5" />
                      </a>
                      <a
                        href="#"
                        className="bg-gray-100 p-3 rounded-full text-blue-600 hover:bg-blue-100 transition-colors">
                        <FaFacebook className="w-5 h-5" />
                      </a>
                      <a
                        href="#"
                        className="bg-gray-100 p-3 rounded-full text-sky-500 hover:bg-sky-100 transition-colors">
                        <FaTwitter className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {/* {activeTab === 'reviews' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                                    <button className="text-blue-600 font-medium flex items-center">
                                        Write a Review
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                                        <div className="text-4xl font-bold text-gray-900 mb-2">4.8</div>
                                        <div className="flex justify-center mb-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-gray-600">Based on 124 reviews</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">5 stars</span>
                                                <span className="text-sm font-medium text-gray-700">84%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '84%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">4 stars</span>
                                                <span className="text-sm font-medium text-gray-700">12%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">3 stars</span>
                                                <span className="text-sm font-medium text-gray-700">3%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '3%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">2 stars</span>
                                                <span className="text-sm font-medium text-gray-700">1%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '1%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">1 star</span>
                                                <span className="text-sm font-medium text-gray-700">0%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[1, 2, 3].map(review => (
                                        <div key={review} className="border border-gray-200 rounded-xl p-5">
                                            <div className="flex justify-between mb-3">
                                                <div className="flex items-center">
                                                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 mr-3" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500">2 weeks ago</span>
                                            </div>
                                            <p className="text-gray-700">
                                                Absolutely amazing service! The team went above and beyond to make our wedding day perfect.
                                                Attention to detail was impeccable and everyone was so professional.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleFormSubmit} className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Your Profile
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-800">
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="desc"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="desc"
                    id="desc"
                    rows="4"
                    value={formData.desc || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <div>
                  <label
                    htmlFor="banner"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image URL
                  </label>
                  <input
                    type="text"
                    name="banner"
                    id="banner"
                    value={formData.banner || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Whatsapp Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="insta"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram Handle (without @)
                  </label>
                  <input
                    type="text"
                    name="insta"
                    id="insta"
                    value={formData.insta || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData.website || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorPage;
