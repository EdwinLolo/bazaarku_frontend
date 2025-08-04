import { useState } from "react";
import { X, Loader2, User, Phone, MessageSquare } from 'lucide-react';
import { getBaseUrl } from "../../models/utils";

function ApplyBoothPopup({ event, onClose }) {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        desc: "",
        is_acc: "PENDING",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\+?[0-9\s-()]{7,}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (!formData.desc.trim()) {
            newErrors.desc = "A brief description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        console.log("Submitting application with data:", { ...formData, eventId: event.id });
        try {
            const response = await fetch(`${getBaseUrl()}/booths`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, eventId: event.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error submitting application:", errorData);
                setErrors({ general: "Failed to submit application. Please try again." });
            }

            const responseData = await response.json();
            console.log("Application submitted successfully:", responseData);

            onClose(); // Close the popup after successful submission
        } catch (error) {
            console.error("Error submitting application:", error);
            setErrors({ general: "An error occurred while submitting your application. Please try again." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
                className="absolute inset-0 pointer-events-auto backdrop-blur-sm bg-black/50"
                onClick={!isLoading ? onClose : undefined}
            />
            <div className="relative w-full max-w-3xl mx-4 bg-white shadow-2xl pointer-events-auto rounded-xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Apply for Booth</h2>
                        <button
                            onClick={!isLoading ? onClose : undefined}
                            className="cursor-pointer absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 float-right"
                        >
                            <X size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                    <p className="mb-4">You are applying for a booth in : <strong>{event.name}</strong></p>
                    <p className="mb-4">Please fill out the following details:</p>
                    <form onSubmit={handleSubmit}>
                        {/* General error message */}
                        {errors.general && (
                            <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                                {errors.general}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Booth Name Field */}
                            <div>
                                <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-gray-700">
                                    Booth Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full py-2.5 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${errors.name
                                            ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500/50 focus:border-blue-500"
                                            }`}
                                        placeholder="e.g., Creative Crafts"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label htmlFor="phone" className="block mb-1.5 text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full py-2.5 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${errors.phone
                                            ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500/50 focus:border-blue-500"
                                            }`}
                                        placeholder="e.g., 08123456789"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Description Field */}
                        <div className="mt-5">
                            <label htmlFor="desc" className="block mb-1.5 text-sm font-medium text-gray-700">
                                Booth Description
                            </label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                                <textarea
                                    id="desc"
                                    name="desc"
                                    rows="6"
                                    value={formData.desc}
                                    onChange={handleChange}
                                    className={`w-full py-2.5 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors resize-y ${errors.desc
                                        ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500/50 focus:border-blue-500"
                                        }`}
                                    placeholder="Briefly describe what you will be selling or showcasing..."
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.desc && <p className="mt-1.5 text-sm text-red-600">{errors.desc}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
}

export default ApplyBoothPopup;