import { useState } from "react";
import { X, Loader2, User, Star, MessageSquare } from 'lucide-react';
import { getBaseUrl } from "../../models/utils";
import Swal from "sweetalert2";

function ReviewPopup({ event, user_id, onClose }) {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        review: "",
        rating_star: ""
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

        if (!formData.review.trim()) {
            newErrors.review = "A brief review is required";
        }

        if (!formData.rating_star || isNaN(formData.rating_star) || formData.rating_star < 1 || formData.rating_star > 5) {
            newErrors.rating_star = "Rating is required and must be between 1 and 5";
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

        console.log("Submitting review with data:", { ...formData, eventId: event.id });
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${getBaseUrl()}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, event_id: event.id, user_id: user_id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error("Error submitting review:", responseData);
                setErrors({ general: responseData.message || "Failed to submit review. Please try again." });
            } else {
                console.log("Review submitted successfully:", responseData);
                onClose(); // Close the popup ONLY on successful submission.

                Swal.fire({
                    icon: 'success',
                    title: 'Review Submitted',
                    text: 'Your review has been submitted successfully.',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false
                }).then(() => {
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            setErrors({ general: "An error occurred while submitting your review. Please try again." });
        } finally {
            setIsLoading(false);
            // Reset form data after submission
            setFormData({
                name: "",
                review: "",
                rating_star: ""
            });
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
                        <h2 className="text-2xl font-bold">Review the Event</h2>
                        <button
                            onClick={!isLoading ? onClose : undefined}
                            className="cursor-pointer absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 float-right"
                        >
                            <X size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                    <p className="mb-4">You are reviewing the event: <strong>{event.name}</strong></p>
                    <p className="mb-4">Please fill out the following details:</p>
                    <form onSubmit={handleSubmit}>
                        {/* General error message */}
                        {errors.general && (
                            <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                                {errors.general}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-gray-700">
                                    Name
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
                                        placeholder="e.g., Booth Name"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="rating_star" className="block mb-1.5 text-sm font-medium text-gray-700">
                                    Star Rating
                                </label>
                                <div className="relative">
                                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        min={1}
                                        type="number"
                                        id="rating_star"
                                        name="rating_star"
                                        value={formData.rating_star}
                                        onChange={handleChange}
                                        className={`w-full py-2.5 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${errors.rating_star
                                            ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500/50 focus:border-blue-500"
                                            }`}
                                        placeholder="1-5"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.rating_star && <p className="mt-1.5 text-sm text-red-600">{errors.rating_star}</p>}
                            </div>
                        </div>

                        {/* Review Field */}
                        <div className="mt-5">
                            <label htmlFor="review" className="block mb-1.5 text-sm font-medium text-gray-700">
                                Review
                            </label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                                <textarea
                                    id="review"
                                    name="review"
                                    rows="6"
                                    value={formData.review}
                                    onChange={handleChange}
                                    className={`w-full py-2.5 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors resize-y ${errors.review
                                        ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500/50 focus:border-blue-500"
                                        }`}
                                    placeholder="Describe your experience..."
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.review && <p className="mt-1.5 text-sm text-red-600">{errors.review}</p>}
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
                                    "Submit Review"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
}

export default ReviewPopup;