import React, { useState, useEffect } from "react";
import { getBaseUrl } from "../models/utils";
import EventCard from "../components/EventCard";
import VendorCard from "../components/VendorCard";
import { ChevronDown, MapPin, Briefcase } from "lucide-react";
import Loading from "../components/Loading";
import TempImage from "../assets/Audio Control Panel.png";

function EventsPage() {
  // State for Events
  const [events, setEvents] = useState([]);
  const [eventPage, setEventPage] = useState(1);
  const [eventLimit, setEventLimit] = useState(6);
  const [totalEventPages, setTotalEventPages] = useState(1);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // State for Vendors
  const [vendors, setVendors] = useState([]);
  const [vendorPage, setVendorPage] = useState(1);
  const [vendorLimit, setVendorLimit] = useState(6);
  const [totalVendorPages, setTotalVendorPages] = useState(1);
  const [loadingVendors, setLoadingVendors] = useState(true);

  // State for Filter Options
  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  // State for Selected Filters
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Fetch Areas and Categories on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [areasResponse, categoriesResponse] = await Promise.all([
          fetch(`${getBaseUrl()}/areas`),
          fetch(`${getBaseUrl()}/event-categories?limit=100`), // Fetch all categories
        ]);

        const areasData = await areasResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (areasData.success) {
          setAreas(areasData.data);
        }
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch Events when eventPage, eventLimit, or a filter changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true); // Set loading to true at the start of the fetch
      try {
        const filterParams = new URLSearchParams();
        filterParams.append("page", eventPage);
        filterParams.append("limit", eventLimit);
        if (selectedAreaId) {
          filterParams.append("area_id", selectedAreaId);
        }
        if (selectedCategoryId) {
          filterParams.append("event_category_id", selectedCategoryId);
        }

        const response = await fetch(
          `${getBaseUrl()}/events/user?${filterParams.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const responseData = await response.json();
        if (responseData && Array.isArray(responseData.data)) {
          setEvents(responseData.data);
          setTotalEventPages(responseData.pagination.totalPages);
        } else {
          console.error(
            "API response for events does not contain a data array:",
            responseData
          );
          setEvents([]);
          setTotalEventPages(1);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoadingEvents(false); // Set loading to false when fetch is complete
      }
    };
    fetchEvents();
  }, [eventPage, eventLimit, selectedAreaId, selectedCategoryId]);

  // Fetch Vendors when vendorPage or vendorLimit changes
  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true); // Set loading to true at the start of the fetch
      try {
        const response = await fetch(
          `${getBaseUrl()}/vendors/users?page=${vendorPage}&limit=${vendorLimit}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const responseData = await response.json();
        if (responseData && Array.isArray(responseData.data)) {
          setVendors(responseData.data);
          setTotalVendorPages(responseData.pagination.totalPages);
        } else {
          console.error(
            "API response for vendors does not contain a data array:",
            responseData
          );
          setVendors([]);
          setTotalVendorPages(1);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]);
      } finally {
        setLoadingVendors(false); // Set loading to false when fetch is complete
      }
    };
    fetchVendors();
  }, [vendorPage, vendorLimit]);

  // A reusable pagination component
  const PaginationControls = ({ currentPage, totalPages, setPage }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
          disabled={currentPage === 1}
          className={`py-2 px-4 rounded-xl text-white font-semibold transition-colors duration-300 ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-dark"
          }`}>
          Previous
        </button>
        <span className="text-lg font-semibold text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setPage((prevPage) => Math.min(totalPages, prevPage + 1))
          }
          disabled={currentPage === totalPages}
          className={`py-2 px-4 rounded-xl text-white font-semibold transition-colors duration-300 ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-dark"
          }`}>
          Next
        </button>
      </div>
    );
  };

  // Full-page initial loading state
  if (loadingFilters) {
    return <Loading message="Loading filter options..." />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 md:px-12 my-5">
        <h1 className="text-4xl text-primary font-bold mb-4">Events</h1>
        <div className="w-full aspect-[12/5] sm:aspect-[15/5] mb-6">
          <img
            src={TempImage}
            alt="Audio Control Panel"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      <section className="mb-16 px-4 md:px-12">
        <div className="flex justify-between items-center mb-4 flex-col md:flex-row space-y-4 md:space-y-0">
          <h1 className="text-4xl text-primary font-bold mb-4 md:mb-0">
            Nearest Event
          </h1>
          <div className="flex space-x-4">
            {/* Area Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                className="cursor-pointer text-gray-700 font-semibold py-2 px-4 rounded-xl shadow-md inline-flex items-center transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 min-w-[12rem] justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    {areas.find((a) => a.id === selectedAreaId)?.name ||
                      "Filter by Area"}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                    isAreaDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isAreaDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl z-10 ring-1 ring-gray-200 focus:outline-none">
                  <button
                    onClick={() => {
                      setSelectedAreaId("");
                      setEventPage(1);
                      setIsAreaDropdownOpen(false);
                    }}
                    className="cursor-pointer block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-t-xl">
                    All Areas
                  </button>
                  {areas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => {
                        setSelectedAreaId(area.id);
                        setEventPage(1);
                        setIsAreaDropdownOpen(false);
                      }}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                      {area.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className="cursor-pointer text-gray-700 font-semibold py-2 px-4 rounded-xl shadow-md inline-flex items-center transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 min-w-[12rem] justify-between">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>
                    {categories.find((c) => c.id === selectedCategoryId)
                      ?.name || "Filter by Category"}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl z-10 ring-1 ring-gray-200 focus:outline-none">
                  <button
                    onClick={() => {
                      setSelectedCategoryId("");
                      setEventPage(1);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="cursor-pointer block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-t-xl">
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setEventPage(1);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {loadingEvents ? (
          <div className="flex flex-col items-center justify-center min-h-84">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-800"></div>
            <p className="mt-4 text-lg font-bold text-primary">
              Loading Events...
            </p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => (
              <EventCard
                id={event.id}
                key={event.id}
                imageUrl={event.banner}
                name={event.name}
                location={event.location}
                start_date={event.start_date}
                end_date={event.end_date}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No events found...</p>
        )}
        {/* Event Pagination */}
        <PaginationControls
          currentPage={eventPage}
          totalPages={totalEventPages}
          setPage={setEventPage}
        />
      </section>

      <section className="mb-16 px-4 md:px-12">
        <h1 className="text-4xl text-primary font-bold mb-4">Vendors</h1>
        {loadingVendors ? (
          <Loading message="Loading vendors..." />
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                imageUrl={vendor.banner}
                name={vendor.name}
                location={vendor.location}
                id={vendor.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No vendor found...</p>
        )}
        {/* Vendor Pagination */}
        <PaginationControls
          currentPage={vendorPage}
          totalPages={totalVendorPages}
          setPage={setVendorPage}
        />
      </section>
    </div>
  );
}

export default EventsPage;
