import React, { useState, useEffect, createContext, useContext } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    useLocation,
    ScrollRestoration
} from "react-router-dom";

// Layouts
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

// Normal pages
import Home from "./pages/HomePage";
import RentalsPage from "./pages/RentalsPage";
import EventsPage from "./pages/EventsPage";
import VendorPage from "./pages/VendorPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin imports
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAddUser from "./pages/admin/AdminAddUser";
import AdminEvent from "./pages/admin/AdminEvent";
import AdminRental from "./pages/admin/AdminRental";
import AdminAplication from "./pages/admin/AdminAplication";

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Check your 3 localStorage items
            const sessionToken = localStorage.getItem("session_token");
            const userData = localStorage.getItem("user_data");
            const userProfile = localStorage.getItem("user_profile");

            if (sessionToken && userData && userProfile) {
                const parsedUserData = JSON.parse(userData);
                const parsedUserProfile = JSON.parse(userProfile);

                // Combine the data as needed
                const combinedUser = {
                    ...parsedUserData,
                    ...parsedUserProfile,
                    session: sessionToken,
                };

                setUser(combinedUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            // Clear invalid data
            localStorage.removeItem("session_token");
            localStorage.removeItem("user_data");
            localStorage.removeItem("user_profile");
        } finally {
            setIsLoading(false);
        }
    };

    const login = (responseData) => {
        // Handle your response structure
        if (responseData.session) {
            localStorage.setItem("session_token", responseData.session);
        }

        if (responseData.user) {
            localStorage.setItem("user_data", JSON.stringify(responseData.user));
        }

        if (responseData.profile) {
            localStorage.setItem(
                "user_profile",
                JSON.stringify(responseData.profile)
            );
        }

        // Combine user data for state
        const combinedUser = {
            ...responseData.user,
            ...responseData.profile,
            session: responseData.session,
        };

        setUser(combinedUser);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        // Clear all your localStorage items
        localStorage.removeItem("session_token");
        localStorage.removeItem("user_data");
        localStorage.removeItem("user_profile");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                checkAuthStatus,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

// Protected Route Component for Admin
function AdminProtectedRoute({ children }) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-32 h-32 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="mb-4 text-2xl font-bold text-red-600">
                        Access Denied
                    </h2>
                    <p className="mb-4 text-gray-600">
                        Please login to access this area.
                    </p>
                    <Link
                        to="/"
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    // Check role from the combined user data
    if (user?.role !== "admin") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="mb-4 text-2xl font-bold text-red-600">
                        Access Denied
                    </h2>
                    <p className="mb-4 text-gray-600">
                        You don't have permission to access this area.
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                        Current role: {user?.role || "Unknown"}
                    </p>
                    <Link
                        to="/"
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return children;
}

// Layout for public routes
function PublicLayout() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <Outlet />
            <ScrollRestoration />
            {!isAdminRoute && <Footer />}
        </>
    );
}

// Admin Layout Wrapper
function AdminLayoutWrapper() {
    return (
        <AdminProtectedRoute>
            <AdminLayout>
                <Outlet />
            </AdminLayout>
        </AdminProtectedRoute>
    );
}

// Router configuration
const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/rentals",
                element: <RentalsPage />
            },
            {
                path: "/events",
                element: <EventsPage />
            },
            {
                path: "/vendor",
                element: <VendorPage />
            },
            {
                path: "/admin",
                element: <AdminLayoutWrapper />,
                children: [
                    {
                        index: true,
                        element: <AdminDashboard />
                    },
                    {
                        path: "add-user",
                        element: <AdminAddUser />
                    },
                    {
                        path: "events",
                        element: <AdminEvent />
                    },
                    {
                        path: "rentals",
                        element: <AdminRental />
                    },
                    {
                        path: "applications",
                        element: <AdminAplication />
                    }
                ]
            },
            {
                path: "*",
                element: <NotFoundPage />
            }
        ]
    }
]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;