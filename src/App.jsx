import {
    useLocation,
    createBrowserRouter,
    RouterProvider,
    ScrollRestoration,
    Outlet,
} from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

import Home from "./pages/HomePage";
import RentalsPage from "./pages/RentalsPage";
import EventsPage from "./pages/EventsPage";
import VendorPage from "./pages/VendorPage";
import NotFoundPage from "./pages/NotFoundPage";

import AdminDashboard from "./pages/admin/AdminDashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "rentals", element: <RentalsPage /> },
            { path: "events", element: <EventsPage /> },
            { path: "vendor", element: <VendorPage /> },
            { path: "admin", element: <AdminDashboard /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
], {
    scrollRestoration: 'manual', // Required for custom anchor handling
});

function Layout() {
    const location = useLocation();
    const hideNavFooter = location.pathname.startsWith("/admin/");

    return (
        <>
            <ScrollRestoration
                getKey={(location) => {
                    return location.hash ? location.pathname : location.key;
                }}
            />
            {!hideNavFooter && <Navbar />}
            <Outlet />
            {!hideNavFooter && <Footer />}
        </>
    );
}

function App() {
    return <RouterProvider router={router} />;
}

export default App;
