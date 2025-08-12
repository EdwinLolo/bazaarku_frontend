import { apiCall, getBaseUrl } from "./utils";

export const getUserData = async () => {
  return apiCall("/admin/users", {
    method: "GET",
  });
};

export const updateUser = async (userId, userData) => {
  return apiCall(`/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (userId) => {
  return apiCall(`/admin/users/${userId}`, {
    method: "DELETE",
  });
};

export const getEventData = async () => {
  return apiCall("/event-categories", {
    method: "GET",
  });
};

export const getEventData2 = async () => {
  return apiCall("/event-data", {
    method: "GET",
  });
};

export const createEventCategory = async (categoryData) => {
  return apiCall("/event-categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
};

export const updateEventCategory = async (categoryId, categoryData) => {
  return apiCall(`/event-categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
};

export const deleteEventCategory = async (categoryId) => {
  return apiCall(`/event-categories/${categoryId}`, {
    method: "DELETE",
  });
};

export const getAreaData = async () => {
  return apiCall("/areas", {
    method: "GET",
  });
};

export const createArea = async (areaData) => {
  return apiCall("/areas", {
    method: "POST",
    body: JSON.stringify(areaData),
  });
};

export const updateArea = async (areaId, areaData) => {
  return apiCall(`/areas/${areaId}`, {
    method: "PUT",
    body: JSON.stringify(areaData),
  });
};

export const deleteArea = async (areaId) => {
  return apiCall(`/areas/${areaId}`, {
    method: "DELETE",
  });
};

export const getEventProduct = async () => {
  return apiCall("/events", {
    method: "GET",
  });
};

export const updateEvent = async (eventId, eventData) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  // Check if eventData is FormData (for file uploads) or regular object
  const isFormData = eventData instanceof FormData;

  const options = {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - let browser handle it
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? eventData : JSON.stringify(eventData),
  };

  const response = await fetch(`${baseURL}/events/${eventId}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update event");
  }

  return await response.json();
};

export const createEvent = async (eventData) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  // Check if eventData is FormData (for file uploads) or regular object
  const isFormData = eventData instanceof FormData;

  const options = {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - let browser handle it
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? eventData : JSON.stringify(eventData),
  };

  const response = await fetch(`${baseURL}/events`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create event");
  }

  return await response.json();
};

export const deleteEvent = async (eventId) => {
  return apiCall(`/events/${eventId}`, {
    method: "DELETE",
  });
};

export const getEventVendors = async () => {
  return apiCall("/vendors", {
    method: "GET",
  });
};

// In models/admin.js
export const createEventVendor = async (vendorData) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  // Check if vendorData is FormData (for file uploads) or regular object
  const isFormData = vendorData instanceof FormData;

  const options = {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - let browser handle it
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? vendorData : JSON.stringify(vendorData),
  };

  const response = await fetch(`${baseURL}/vendors`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create vendor");
  }

  return await response.json();
};

export const updateEventVendor = async (vendorId, vendorData) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  // Check if vendorData is FormData (for file uploads) or regular object
  const isFormData = vendorData instanceof FormData;

  console.log("=== UPDATE EVENT VENDOR API ===");
  console.log("Vendor ID:", vendorId);
  console.log("Is FormData:", isFormData);

  if (isFormData) {
    console.log("FormData contents:");
    for (let [key, value] of vendorData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}:`,
          `File(${value.name}, ${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}:`, value);
      }
    }
  } else {
    console.log("Regular data:", vendorData);
  }

  const options = {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - let browser handle it
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? vendorData : JSON.stringify(vendorData),
  };

  console.log("Request headers:", options.headers);
  console.log("Making request to:", `${baseURL}/vendors/${vendorId}`);

  const response = await fetch(`${baseURL}/vendors/${vendorId}`, options);

  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);

  if (!response.ok) {
    const error = await response.json();
    console.error("API Error:", error);
    throw new Error(error.error || "Failed to update vendor");
  }

  const result = await response.json();
  console.log("API Response:", result);
  return result;
};

export const deleteEventVendor = async (vendorId) => {
  return apiCall(`/vendors/${vendorId}`, {
    method: "DELETE",
  });
};

export const getBooth = async () => {
  return apiCall("/booths", {
    method: "GET",
  });
};

export const updateBooth = async (boothId, boothData) => {
  return apiCall(`/booths/${boothId}/status`, {
    method: "PUT",
    body: JSON.stringify(boothData),
  });
};

export const createBooth = async (boothData) => {
  return apiCall("/booths", {
    method: "POST",
    body: JSON.stringify(boothData),
  });
};

export const deleteBooth = async (boothId) => {
  return apiCall(`/booths/${boothId}`, {
    method: "DELETE",
  });
};

export const getRentalCategories = async () => {
  return apiCall("/rentals", {
    method: "GET",
  });
};

export const createRentalCategory = async (data) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  // Check if data is FormData (for file uploads) or regular object
  const isFormData = data instanceof FormData;

  console.log("=== CREATE RENTAL CATEGORY API ===");
  console.log("Base URL:", baseURL);
  console.log("Is FormData:", isFormData);
  console.log("Token exists:", !!token);

  if (isFormData) {
    console.log("FormData contents:");
    for (let [key, value] of data.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}:`,
          `File(${value.name}, ${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}:`, value);
      }
    }
  } else {
    console.log("Regular data:", data);
  }

  try {
    const options = {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData - let browser handle it
        ...(!isFormData && { "Content-Type": "application/json" }),
      },
      body: isFormData ? data : JSON.stringify(data),
    };

    console.log("Making request to:", `${baseURL}/rentals`);
    console.log("Request options:", options);

    const response = await fetch(`${baseURL}/rentals`, options);

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log("Response content-type:", response.headers.get("content-type"));

    // Check if response is HTML (error page)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const htmlText = await response.text();
      console.error(
        "Received HTML instead of JSON:",
        htmlText.substring(0, 500)
      );
      throw new Error(
        `Server returned HTML instead of JSON. Status: ${response.status}`
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(
          errorJson.message ||
            errorJson.error ||
            "Failed to create rental category"
        );
      } catch (parseError) {
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }
    }

    const result = await response.json();
    console.log("API Response:", result);
    return result;
  } catch (error) {
    console.error("Create rental category error:", error);
    throw error;
  }
};

export const updateRentalCategory = async (id, data) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  // Check if data is FormData (for file uploads) or regular object
  const isFormData = data instanceof FormData;

  console.log("=== UPDATE RENTAL CATEGORY API ===");
  console.log("Category ID:", id);
  console.log("Base URL:", baseURL);
  console.log("Is FormData:", isFormData);

  try {
    const options = {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(!isFormData && { "Content-Type": "application/json" }),
      },
      body: isFormData ? data : JSON.stringify(data),
    };

    console.log("Making request to:", `${baseURL}/rentals/${id}`);

    const response = await fetch(`${baseURL}/rentals/${id}`, options);

    console.log("Response status:", response.status);
    console.log("Response content-type:", response.headers.get("content-type"));

    // Check if response is HTML (error page)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const htmlText = await response.text();
      console.error(
        "Received HTML instead of JSON:",
        htmlText.substring(0, 500)
      );
      throw new Error(
        `Server returned HTML instead of JSON. Status: ${response.status}`
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(
          errorJson.message ||
            errorJson.error ||
            "Failed to update rental category"
        );
      } catch (parseError) {
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }
    }

    const result = await response.json();
    console.log("API Response:", result);
    return result;
  } catch (error) {
    console.error("Update rental category error:", error);
    throw error;
  }
};

export const deleteRentalCategory = async (categoryId) => {
  return apiCall(`/rentals/${categoryId}`, {
    method: "DELETE",
  });
};

export const getRentalProducts = async () => {
  return apiCall("/rental-products", {
    method: "GET",
  });
};

export const createRentalProduct = async (data) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  const isFormData = data instanceof FormData;

  const options = {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
  };

  // Changed endpoint from /rentals to /rental-products
  const response = await fetch(`${baseURL}/rental-products`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create rental product");
  }

  return await response.json();
};

export const updateRentalProduct = async (id, data) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  const isFormData = data instanceof FormData;

  const options = {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
  };

  // Changed endpoint
  const response = await fetch(`${baseURL}/rental-products/${id}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update rental product");
  }

  return await response.json();
};

export const deleteRentalProduct = async (productId) => {
  return apiCall(`/rental-products/${productId}`, {
    method: "DELETE",
  });
};

export const getBanners = async () => {
  return apiCall("/banners", {
    method: "GET",
  });
};

export const createBanner = async (data) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  const isFormData = data instanceof FormData;

  const options = {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
  };

  // Changed endpoint from /rentals to /rental-products
  const response = await fetch(`${baseURL}/banners`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create rental product");
  }

  return await response.json();
};

export const updateBanner = async (id, data) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();

  const isFormData = data instanceof FormData;

  const options = {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
  };

  // Changed endpoint
  const response = await fetch(`${baseURL}/banners/${id}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update rental product");
  }

  return await response.json();
};

export const deleteBanner = async (id) => {
  return apiCall(`/banners/${id}`, {
    method: "DELETE",
  });
};

export const getEventRatings = async () => {
  return apiCall("/rating", {
    method: "GET",
  });
};

export const createEventRating = async (data) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();
  const isFormData = data instanceof FormData;

  const options = {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
  };
  const response = await fetch(`${baseURL}/rating`, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create event rating");
  }
  return await response.json();
};

export const updateEventRating = async (id, data) => {
  const token = localStorage.getItem("session_token");
  const baseURL = getBaseUrl();
  const isFormData = data instanceof FormData;
  const options = {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
  };
  const response = await fetch(`${baseURL}/rating/${id}`, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update event rating");
  }
  return await response.json();
};

export const deleteEventRating = async (id) => {
  return apiCall(`/rating/${id}`, {
    method: "DELETE",
  });
};
