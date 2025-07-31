import React from "react";
import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";
import { logout as logoutAPI } from "../models/auth"; // Adjust the import path as necessary

function AdminFooter() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userProfile = localStorage.getItem("user_profile");
      return userProfile ? JSON.parse(userProfile) : null;
    } catch (error) {
      console.error("Error parsing user profile:", error);
      return null;
    }
  };

  const user = getUserData();

  const handleLogout = async () => {
    await logoutAPI();
    logout();
    navigate("/");
  };

  return (
    <footer className="py-4 mt-auto text-white bg-gray-800">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              © 2024 BazaarKu Admin Panel. All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Welcome, {user?.first_name} {user?.last_name}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-white transition-colors bg-red-600 rounded hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
