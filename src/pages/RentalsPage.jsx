import React, { useEffect, useState } from "react";
import RentalProductCard from '../components/RentalProductCard';
import RentalProductPopup from '../components/popup/RentalProductPopup';
import { getBaseUrl } from "../models/utils";
import TempImage from '../assets/Audio Control Panel.png';
import Loading from '../components/Loading';

function RentalsPage() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;

        if (showPopup) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = originalStyle;
            document.body.style.paddingRight = '0px';
        }

        return () => {
            document.body.style.overflow = originalStyle;
            document.body.style.paddingRight = '0px';
        };
    }, [showPopup]);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const response = await fetch(`${getBaseUrl()}/rentals/with-products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch rentals products');
                }
                const responseData = await response.json();
                if (responseData && Array.isArray(responseData.data)) {
                    setRentals(responseData.data);
                } else {
                    console.error("API response for rentals does not contain a data array:", responseData);
                    setRentals([]);
                }
            } catch (error) {
                console.error("Error fetching rentals:", error);
                setRentals([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, []);

    if (loading) {
        return <Loading message="Loading rentals..." />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="px-4 md:px-12 my-5">
                <h1 className="text-4xl text-primary font-bold mb-4">Tool Rentals</h1>
                <div className="w-full aspect-[12/5] sm:aspect-[15/5] mb-6">
                    <img
                        src={TempImage}
                        alt="Audio Control Panel"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            </div>

            {rentals.length > 0 ? (
                rentals.map((rental, index) => (
                    <section key={rental.id} className="mb-16 px-4 md:px-12">
                        <div className="flex justify-between items-center mb-4 flex-col md:flex-row space-y-4 md:space-y-0">
                            <h2 className="text-3xl text-primary font-bold mb-4 md:mb-0">{rental.name}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {rental.rental_products && rental.rental_products.length > 0 ? (
                                rental.rental_products.map((product) => (
                                    <RentalProductCard
                                        key={product.id}
                                        imageUrl={product.banner || TempImage}
                                        title={product.name}
                                        price={product.price}
                                        location={product.location}
                                        id={product.id}
                                        isReady={product.is_ready}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowPopup(true);
                                        }}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No products available for this rental.</p>
                            )}
                        </div>
                    </section>
                ))
            ) : (
                <p className="text-gray-500 italic px-4 md:px-12">No rentals found...</p>
            )}

            {showPopup && (
                <RentalProductPopup
                    product={selectedProduct}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div >
    );
}

export default RentalsPage;