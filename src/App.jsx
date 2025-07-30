import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Navbar from "./layout/Navbar";
import Home from "./pages/HomePage";
import RentalsPage from "./pages/RentalsPage";
import EventsPage from "./pages/EventsPage";
import VendorPage from "./pages/VendorPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/admin/login";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/vendor" element={<VendorPage />} />

        {/* ADMIN */}
        <Route path="/admin" element={<h1>Admin Dashboard</h1>} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
