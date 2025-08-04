import React, { useState } from "react";
import { useAuth } from "../App";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logout as logoutAPI } from "../models/auth";
import {
  Users,
  Calendar,
  Package,
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  ChevronDown,
  Settings,
} from "lucide-react";

function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    try {
      await logoutAPI();
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, clear local state
      logout();
      navigate("/");
    }
  };

  // Navigation items
  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: Home,
      exact: true,
    },
    {
      path: "/admin/add-user",
      label: "Add User",
      icon: Users,
    },
    {
      path: "/admin/events",
      label: "Events",
      icon: Calendar,
    },
    {
      path: "/admin/rentals",
      label: "Rentals",
      icon: Package,
    },
    // {
    //   path: "/admin/applications",
    //   label: "Applications",
    //   icon: FileText,
    // },
  ];

  // Check if current path is active
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed z-50 p-2 text-white bg-gray-800 rounded-md top-4 left-4 lg:hidden">
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <span className="font-bold text-white">B</span>
              </div>
              <span className="text-lg font-semibold">BazaarKu Admin</span>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden p-1 transition-colors rounded lg:block hover:bg-gray-700">
            <Menu size={20} />
          </button>
        </div>

        {/* User info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
                <span className="font-semibold text-white">
                  {user?.first_name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-300 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
                title={isCollapsed ? item.label : ""}>
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          {!isCollapsed && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center w-full px-3 py-2 mb-3 text-sm font-medium text-gray-300 transition-colors rounded-lg hover:bg-gray-700 hover:text-white">
              <Settings size={20} />
              <span className="ml-3">User Home</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-2 text-sm font-medium text-red-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors
              ${isCollapsed ? "justify-center" : ""}
            `}
            title={isCollapsed ? "Logout" : ""}>
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
