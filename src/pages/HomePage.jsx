import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Carousel from "../components/Carousel";
import EventCard from "../components/EventCard";
import RentalCard from "../components/RentalCard";
import TempImage from "../assets/Audio Control Panel.png";
import { getBaseUrl } from "../models/utils";
import Loading from "../components/Loading";

const MIN_LOOP_SLIDES = 5;

// Function to get fallback slides, kept here since it's a home page concern
const getFallbackSlides = () => [
  {
    url: "https://placehold.co/1200x400/000033/FFFFFF?text=Event+1",
    alt: "Event 1 Banner",
    link: "#",
  },
  {
    url: "https://placehold.co/1200x400/003300/FFFFFF?text=Event+2",
    alt: "Event 2 Banner",
    link: "#",
  },
  {
    url: "https://placehold.co/1200x400/330000/FFFFFF?text=Event+3",
    alt: "Event 3 Banner",
    link: "#",
  },
  {
    url: "https://placehold.co/1200x400/330033/FFFFFF?text=Event+4",
    alt: "Event 4 Banner",
    link: "#",
  },
  {
    url: "https://placehold.co/1200x400/003333/FFFFFF?text=Event+5",
    alt: "Event 5 Banner",
    link: "#",
  },
];

function Home() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch all data concurrently
        const [eventsResponse, rentalsResponse, carouselResponse] =
          await Promise.all([
            fetch(`${getBaseUrl()}/events/user?limit=3`),
            fetch(`${getBaseUrl()}/rentals/users?limit=5`),
            fetch(`${getBaseUrl()}/banners/active`),
          ]);

        // Handle events response
        const eventsData = await eventsResponse.json();
        if (eventsResponse.ok && eventsData && Array.isArray(eventsData.data)) {
          setEvents(eventsData.data);
        } else {
          console.error(
            "API response for events does not contain a data array:",
            eventsData
          );
          setEvents([]);
        }

        // Handle rentals response
        const rentalsData = await rentalsResponse.json();
        if (
          rentalsResponse.ok &&
          rentalsData &&
          Array.isArray(rentalsData.data)
        ) {
          setRentals(rentalsData.data);
        } else {
          console.error(
            "API response for rentals does not contain a data array:",
            rentalsData
          );
          setRentals([]);
        }

        // Handle carousel response
        let fetchedCarouselData = [];
        const carouselData = await carouselResponse.json();
        if (
          carouselResponse.ok &&
          carouselData &&
          Array.isArray(carouselData.data)
        ) {
          fetchedCarouselData = carouselData.data.map((slide) => ({
            url: slide.banner,
            alt: slide.name || "Banner Image",
            link: slide.link || "#",
          }));
        } else {
          console.error(
            "API response for carousel does not contain a data array:",
            carouselData
          );
        }

        // Apply fallback slides if needed
        let finalSlides = [...fetchedCarouselData];
        if (finalSlides.length < MIN_LOOP_SLIDES) {
          const fallbackNeeded = MIN_LOOP_SLIDES - finalSlides.length;
          const fallbacks = getFallbackSlides().slice(0, fallbackNeeded);
          finalSlides = [...finalSlides, ...fallbacks];
        }
        setCarouselSlides(finalSlides);
      } catch (error) {
        console.error("Error fetching data:", error);
        setEvents([]);
        setRentals([]);
        setCarouselSlides(getFallbackSlides()); // Show fallback slides on error
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <Loading message="Loading awesome events, rentals, and banners..." />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mt-6 mb-4 px-4 sm:px-0">
        <Carousel slides={carouselSlides} />
      </div>

      <section className="mb-16 px-4 md:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight">
            Upcoming Events
          </h2>
          <Link
            to="/events"
            className="text-primary font-semibold text-lg hover:underline transition-colors duration-300 flex items-center gap-2">
            <span>View All Events</span>
            <ArrowRight size={20} />
          </Link>
        </div>
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No upcoming events at the moment.
          </p>
        )}
      </section>

      <section className="mb-16 px-4 md:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h1 className="text-2xl sm:text-3xl text-primary font-bold mb-1 sm:mb-0">
            Tool Rentals
          </h1>
          <Link
            to="/rentals"
            className="text-primary font-semibold text-base sm:text-lg hover:underline flex items-center gap-2">
            <span>View All Rentals</span>
            <ArrowRight size={20} />
          </Link>
        </div>
        {rentals && rentals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 auto-rows-fr">
            {rentals.map((rental, index) => {
              let colSpanClass;
              const patternIndex = index % 3;

              if (patternIndex === 0) {
                colSpanClass =
                  "lg:col-span-4 md:col-span-2 sm:col-span-2 col-span-1";
              } else if (patternIndex === 1) {
                colSpanClass =
                  "lg:col-span-2 md:col-span-1 sm:col-span-2 col-span-1";
              } else {
                colSpanClass =
                  "lg:col-span-1 md:col-span-1 sm:col-span-2 col-span-1";
              }

              return (
                <RentalCard
                  key={rental.id}
                  rental={rental}
                  className={`h-56 sm:h-64 md:h-72 ${colSpanClass}`}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No rentals available at the moment.
          </p>
        )}
      </section>
    </div>
  );
}

export default Home;
