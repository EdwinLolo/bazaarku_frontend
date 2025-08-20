import Swal from "sweetalert2";

export const getBaseUrl = () => {
  const baseUrl1 = import.meta.env.VITE_API_BASE_URL;
  // console.log("Using API base URL:", baseUrl1);
  return baseUrl1;
};

function BaseURL() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  // console.log("Using API base URL:", baseUrl);
  return baseUrl;
}

// Forcefully clear session and redirect user to login (or a provided route)
export const forceLogout = (redirect = "/") => {
  try {
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_profile");
    localStorage.removeItem("user_data");
  } catch (_) {
    // ignore storage errors
  }
  // Replace to prevent navigating back to protected page
  window.location.replace(redirect);
};

// Show a SweetAlert message and then redirect (used for invalid/expired token)
export const notifyAuthExpiredAndRedirect = async (redirect = "/") => {
  const text =
    "Your session token is invalid or has expired. Redirecting to login...";
  try {
    if (Swal && typeof Swal.fire === "function") {
      // Show a blocking modal with a loading spinner; don't auto-close
      Swal.fire({
        title: "Session expired",
        text,
        icon: "warning",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
          // Kick off logout shortly so the modal is visible while navigating
          setTimeout(() => forceLogout(redirect), 500);
        },
      });
      return;
    } else {
      // Fallback if SweetAlert isn't available
      alert(text);
      forceLogout(redirect);
    }
  } catch (_) {
    // If anything goes wrong, still force logout
    forceLogout(redirect);
  }
};

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("session_token");
  const baseURL = BaseURL();

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  let response;
  try {
    response = await fetch(`${baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });
  } catch (e) {
    // Network error – don't force logout, just bubble up
    throw new Error("Network error. Please check your connection.");
  }

  // Auto logout on Unauthorized (401) or custom Forbidden-like (402 per request)
  if (response.status === 401 || response.status === 402) {
    await notifyAuthExpiredAndRedirect();
    // Stop further processing; throw to halt any awaiting code paths
    throw new Error("Session expired. Redirecting to login...");
  }

  if (!response.ok) {
    // Safely parse JSON if possible
    let error;
    try {
      error = await response.json();
    } catch (_) {
      // Non-JSON error response
      throw new Error(`HTTP ${response.status}`);
    }
    throw new Error(error.error || error.message || "API request failed");
  }

  // Parse JSON safely on success
  try {
    return await response.json();
  } catch (_) {
    return null;
  }
};
