import React from 'react';
import { X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import TempImage from '../../assets/Audio Control Panel.png';

const RentalProductPopup = ({ product, onClose }) => {
    const formattedPrice = product?.price
        ? product.price.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        })
        : 'Price not available';

    const whatsappMessage = `Hello, I'm interested in the product ${product?.name} (${formattedPrice}) you have for rent. May I ask for more details?`;
    const whatsappUrl = `https://wa.me/${product.contact}?text=${encodeURIComponent(
        whatsappMessage
    )}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
                className="absolute inset-0 pointer-events-auto bg-black/50"
                onClick={onClose}
            />
            <div className="relative w-full max-w-5xl mx-4 bg-white shadow-lg pointer-events-auto max-h-[90vh] rounded-xl overflow-y-auto scroll-hidden">
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 float-right"
                >
                    <X size={24} strokeWidth={2.5} />
                </button>

                <div className="flex flex-col w-full h-full p-0 m-0">
                    {/* Image Section */}
                    <div className="w-full h-[65vh] bg-gray-100">
                        <img
                            src={product?.banner || TempImage}
                            alt={product?.name}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Divider */}
                    <hr className="w-full border-t border-gray-200" />

                    {/* Content Section */}
                    <div className="w-full p-6 md:p-10">
                        {/* Title & Price */}
                        <div className="mb-6">
                            <h2 id="product-name" className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                                {product?.name}
                            </h2>
                            <p className="mt-2 text-3xl font-bold text-blue-700">
                                {formattedPrice}
                            </p>
                        </div>

                        {/* Status & Location */}
                        <div className="mb-6 space-y-2">
                            <div className="flex items-center gap-3">
                                <span className={`inline-block w-4 h-4 rounded-full ${product?.is_ready ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                <span className="text-lg font-semibold text-gray-700">
                                    {product?.is_ready ? 'Available Now' : 'Reserved'}
                                </span>
                            </div>
                            <p className="text-gray-500 text-base">
                                <span className="font-semibold text-gray-600">Location:</span> {product?.location}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                            <div className="pr-2">
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {product?.description || 'No description provided.'}
                                </p>
                            </div>
                        </div>

                        {/* Additional details (Grid) */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm mb-8">
                            <div>
                                <div className="text-gray-500 font-medium">Condition</div>
                                <div className="font-bold text-gray-800 mt-1">{product?.condition || 'Excellent'}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 font-medium">Min. Rental</div>
                                <div className="font-bold text-gray-800 mt-1">{product?.min_rental || '1 day'}</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-3 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50"
                            >
                                <FaWhatsapp className="text-2xl" />
                                <span>Contact via WhatsApp</span>
                            </a>
                            <button
                                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                            >
                                Rent Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalProductPopup;