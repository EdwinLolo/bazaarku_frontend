import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

import Home from "./pages/HomePage";
import RentalsPage from "./pages/RentalsPage";
import EventsPage from "./pages/EventsPage";
import VendorPage from "./pages/VendorPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin imports
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

function AppContent() {
  const location = useLocation();
  const hideNavFooter = location.pathname.startsWith("/admin/");
  return (
    <>
      {!hideNavFooter && <Navbar />}
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/vendor" element={<VendorPage />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!hideNavFooter && <Footer />}
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
